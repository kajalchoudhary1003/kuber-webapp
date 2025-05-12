const { Op } = require('sequelize');
const Invoice = require('../models/invoiceModel');
const Client = require('../models/clientModel');
const Currency = require('../models/currencyModel');
const Employee = require('../models/employeeModel');
const BillingDetail = require('../models/billingDetailModel');
const { createInvoicePdf, loadLogo } = require('../utils/pdfUtils');
const path = require('path');
const fs = require('fs');

const invoiceService = {
  async generateInvoices(year, month, clientId) {
    try {
      console.log(`Generating invoice for clientId: ${clientId}, year: ${year}, month: ${month}`);
      const client = await Client.findOne({
        where: {
          id: clientId,
          deletedAt: null,
        },
      });

      if (!client) {
        console.error(`Client not found: clientId=${clientId}`);
        throw new Error('Client not found');
      }
      console.log(`Client found: ${client.ClientName}`);

      const monthName = getMonthNameFromNumber(month);
      if (!monthName) {
        throw new Error(`Invalid month number: ${month}`);
      }
      
   
      const billingYear = month >= 1 && month <= 3 ? parseInt(year) + 1 : parseInt(year);

      // Calculate total billing amount for this client and month
      const billingTotal = await calculateTotalBillingAmount(clientId, billingYear, monthName);
      console.log(`Calculated total billing amount: ${billingTotal}`);

      const invoice = await Invoice.create({
        ClientID: client.id,
        BillingCurrencyID: client.BillingCurrencyID,
        Year: year,
        Month: month,
        TotalAmount: billingTotal, 
        OrganisationID: client.OrganisationID,
        BankDetailID: client.BankDetailID,
        Status: 'Generated',
        GeneratedOn: new Date(),
      });
      console.log(`Invoice created: invoiceId=${invoice.id}`);

      const invoiceDir = path.join(__dirname, '../invoices');
      if (!fs.existsSync(invoiceDir)) {
        console.log(`Creating invoices directory: ${invoiceDir}`);
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      const invoiceFilePath = path.join(invoiceDir, `${invoice.id}.pdf`);
      console.log(`Generating PDF at: ${invoiceFilePath}`);
      try {
        await createInvoicePdf(
          {
            clientId: client.id,
            year,
            month,
            totalAmount: billingTotal, // Using calculated amount for PDF as well
            logoBase64: loadLogo(),
          },
          [],
          invoiceFilePath
        );
        console.log(`PDF generated successfully for invoiceId=${invoice.id}`);
      } catch (pdfError) {
        console.error(`PDF generation failed for invoiceId=${invoice.id}:`, pdfError);
        throw new Error(`Failed to generate PDF: ${pdfError.message}`);
      }

      await invoice.update({ PdfPath: `${invoice.id}.pdf` });
      console.log(`Invoice updated with PdfPath: ${invoice.id}.pdf`);

      return invoice;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw new Error(`Error generating invoice: ${error.message}`);
    }
  },

  async getGeneratedInvoices(year, month) {
    try {
      console.log(`Fetching generated invoices for year=${year}, month=${month}`);
      const invoices = await Invoice.findAll({
        where: {
          Year: year,
          Month: month,
          Status: 'Generated',
        },
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'Abbreviation'],
          },
          {
            model: Currency,
            as: 'BillingCurrency',
            attributes: ['CurrencyName', 'CurrencyCode'],
          },
        ],
      });
      console.log(`Found ${invoices.length} generated invoices`);
      return invoices;
    } catch (error) {
      console.error('Error fetching generated invoices:', error);
      throw new Error(`Error fetching generated invoices: ${error.message}`);
    }
  },

  async getInvoiceById(id) {
    try {
      console.log(`Fetching invoice: invoiceId=${id}`);
      const invoice = await Invoice.findByPk(id, {
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'Abbreviation'],
          },
          {
            model: Currency,
            as: 'Currency',
            attributes: ['CurrencyName', 'CurrencyCode'],
          },
        ],
      });
      if (!invoice) {
        console.error(`Invoice not found: invoiceId=${id}`);
        throw new Error('Invoice not found');
      }
      return invoice;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw new Error(`Error fetching invoice: ${error.message}`);
    }
  },

  // Updated deleteInvoice function in invoiceService.js
async deleteInvoice(id) {
  try {
    console.log(`Deleting invoice: invoiceId=${id}`);
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      console.error(`Invoice not found: invoiceId=${id}`);
      throw new Error('Invoice not found');
    }
    console.log(`Found invoice:`, JSON.stringify(invoice, null, 2));

    if (invoice.PdfPath) {
      const filePath = path.join(__dirname, '../invoices', invoice.PdfPath);
      console.log(`Checking if file exists at: ${filePath}`);
      
      try {
        if (fs.existsSync(filePath)) {
          console.log(`File exists. Deleting PDF file: ${filePath}`);
          fs.unlinkSync(filePath);
          console.log(`File deleted successfully`);
        } else {
          console.log(`File does not exist at path: ${filePath}`);
        }
      } catch (fileError) {
        console.error(`Error handling file: ${fileError.message}`);
       
      }
    } else {
      console.log(`No PDF path found for invoice ${id}`);
    }

    try {
      await invoice.destroy();
      console.log(`Invoice deleted from database: invoiceId=${id}`);
    } catch (dbError) {
      console.error(`Database error deleting invoice: ${dbError.message}`);
      throw dbError;
    }
    
    return { message: 'Invoice deleted successfully' };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw new Error(`Error deleting invoice: ${error.message}`);
  }
},

  async markInvoiceAsSent(id) {
    try {
      console.log(`Marking invoice as sent: invoiceId=${id}`);
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        console.error(`Invoice not found: invoiceId=${id}`);
        throw new Error('Invoice not found');
      }

      await invoice.update({
        Status: 'Sent',
        InvoicedOn: new Date(),
      });
      console.log(`Invoice marked as sent: invoiceId=${id}`);
      return invoice;
    } catch (error) {
      console.error('Error marking invoice as sent:', error);
      throw new Error(`Error marking invoice as sent: ${error.message}`);
    }
  },

  async regenerateInvoice(id) {
  try {
    console.log(`Regenerating invoice: invoiceId=${id}`);
    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ['ClientName', 'Abbreviation'],
        },
      ],
    });
    if (!invoice) {
      console.error(`Invoice not found: invoiceId=${id}`);
      throw new Error('Invoice not found');
    }

    // Recalculate total amount for this invoice
    const monthName = getMonthNameFromNumber(invoice.Month);
    const billingYear = invoice.Month >= 1 && invoice.Month <= 3 ? parseInt(invoice.Year) + 1 : parseInt(invoice.Year);
    const billingTotal = await calculateTotalBillingAmount(invoice.ClientID, billingYear, monthName);
    
    // Update the invoice with new total if different
    if (billingTotal !== invoice.TotalAmount) {
      await invoice.update({ TotalAmount: billingTotal });
    }

    // Ensure the invoices directory exists
    const invoiceDir = path.join(__dirname, '../invoices');
    if (!fs.existsSync(invoiceDir)) {
      console.log(`Creating invoices directory: ${invoiceDir}`);
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    // Define the PDF file path
    const invoiceFilePath = path.join(invoiceDir, `${invoice.id}.pdf`);
    console.log(`Regenerating PDF at: ${invoiceFilePath}`);

    // Delete existing PDF if it exists to ensure a fresh file
    if (fs.existsSync(invoiceFilePath)) {
      console.log(`Deleting existing PDF: ${invoiceFilePath}`);
      fs.unlinkSync(invoiceFilePath);
    }

    // Generate the new PDF
    try {
      await createInvoicePdf(
        {
          clientId: invoice.ClientID,
          year: invoice.Year,
          month: invoice.Month,
          totalAmount: billingTotal,
          logoBase64: loadLogo(),
        },
        [],
        invoiceFilePath
      );
      console.log(`PDF regenerated successfully for invoiceId=${invoice.id}`);
    } catch (pdfError) {
      console.error(`Failed to generate PDF for invoiceId=${invoice.id}:`, pdfError);
      throw new Error(`Failed to generate PDF: ${pdfError.message}`);
    }

    // Update the PdfPath in the database
    await invoice.update({ PdfPath: `${invoice.id}.pdf` });
    console.log(`Updated PdfPath for invoiceId=${invoice.id}`);

    return invoice;
  } catch (error) {
    console.error('Error regenerating invoice:', error);
    throw new Error(`Error regenerating invoice: ${error.message}`);
  }
}
};

// Helper function to calculate total billing amount for a client and month
async function calculateTotalBillingAmount(clientId, year, monthName) {
  try {
    console.log(`Calculating total for clientId=${clientId}, year=${year}, month=${monthName}`);
    
    // Find all billing details for this client and year
    const billingDetails = await BillingDetail.findAll({
      where: {
        ClientID: clientId,
        Year: year
      }
    });
    
    if (!billingDetails || billingDetails.length === 0) {
      console.warn(`No billing details found for clientId=${clientId}, year=${year}`);
      return 0;
    }
    
    // Sum up the amounts for the specified month
    const total = billingDetails.reduce((sum, detail) => {
      const monthValue = detail[monthName] || 0;
      return sum + parseFloat(monthValue);
    }, 0);
    
    console.log(`Total calculated: ${total} for month ${monthName}`);
    return total;
  } catch (error) {
    console.error('Error calculating total billing amount:', error);
    throw new Error(`Error calculating billing total: ${error.message}`);
  }
}

// Helper function to convert month number to name
function getMonthNameFromNumber(monthNumber) {
  const fiscalMonthMap = {
    1: 'Jan', // January
    2: 'Feb', // February
    3: 'Mar', // March
    4: 'Apr', // April
    5: 'May', // May
    6: 'Jun', // June
    7: 'Jul', // July
    8: 'Aug', // August
    9: 'Sep', // September
    10: 'Oct', // October
    11: 'Nov', // November
    12: 'Dec', // December
  };
  
  return fiscalMonthMap[monthNumber];
}

module.exports = invoiceService;