const { Op } = require('sequelize');
const Invoice = require('../models/invoiceModel');
const Client = require('../models/clientModel');
const Currency = require('../models/currencyModel');
const Employee = require('../models/employeeModel');
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

      const invoice = await Invoice.create({
        ClientID: client.id,
        BillingCurrencyID: client.BillingCurrencyID,
        Year: year,
        Month: month,
        TotalAmount: 0, // TODO: Calculate actual total amount if needed
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
            totalAmount: 0,
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

  async deleteInvoice(id) {
    try {
      console.log(`Deleting invoice: invoiceId=${id}`);
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        console.error(`Invoice not found: invoiceId=${id}`);
        throw new Error('Invoice not found');
      }

      if (invoice.PdfPath) {
        const filePath = path.join(__dirname, '../invoices', invoice.PdfPath);
        if (fs.existsSync(filePath)) {
          console.log(`Deleting PDF file: ${filePath}`);
          fs.unlinkSync(filePath);
        }
      }

      await invoice.destroy();
      console.log(`Invoice deleted: invoiceId=${id}`);
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

      const invoiceDir = path.join(__dirname, '../invoices');
      const invoiceFilePath = path.join(invoiceDir, `${invoice.id}.pdf`);
      console.log(`Regenerating PDF at: ${invoiceFilePath}`);
      await createInvoicePdf(
        {
          clientId: invoice.ClientID,
          year: invoice.Year,
          month: invoice.Month,
          totalAmount: invoice.TotalAmount,
          logoBase64: loadLogo(),
        },
        [],
        invoiceFilePath
      );
      console.log(`PDF regenerated for invoiceId=${invoice.id}`);

      return invoice;
    } catch (error) {
      console.error('Error regenerating invoice:', error);
      throw new Error(`Error regenerating invoice: ${error.message}`);
    }
  },
};

module.exports = invoiceService;