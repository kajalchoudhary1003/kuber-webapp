const { Op } = require('sequelize');
const Invoice = require('../models/invoiceModel');
const Client = require('../models/clientModel');
const Currency = require('../models/currencyModel');
const Employee = require('../models/employeeModel');
const { createInvoicePdf, loadLogo } = require('../utils/pdfUtils');
const path = require('path');
const fs = require('fs');

const invoiceService = {
  async generateInvoices(year, month) {
    try {
      // Get all active clients (not soft deleted)
      const clients = await Client.findAll({
        where: {
          deletedAt: null
        }
      });

      const generatedInvoices = [];
      for (const client of clients) {
        // Create invoice record
        const invoice = await Invoice.create({
          ClientID: client.id,
          BillingCurrencyID: client.BillingCurrencyID,
          Year: year,
          Month: month,
          TotalAmount: 0, // Required field, set to 0 initially
          OrganisationID: client.OrganisationID,
          BankDetailID: client.BankDetailID,
          Status: 'Generated',
          GeneratedOn: new Date()
        });

        // Generate PDF
        const invoiceDir = path.join(__dirname, '../invoices');
        if (!fs.existsSync(invoiceDir)) {
          fs.mkdirSync(invoiceDir, { recursive: true });
        }

        const invoiceFilePath = path.join(invoiceDir, `${invoice.id}.pdf`);
        await createInvoicePdf({
          clientId: client.id,
          year,
          month,
          totalAmount: 0,
          logoBase64: loadLogo()
        }, [], invoiceFilePath);

        // Update PDF path after generation
        await invoice.update({
          PdfPath: `${invoice.id}.pdf`
        });

        generatedInvoices.push(invoice);
      }

      return generatedInvoices;
    } catch (error) {
      throw new Error('Error generating invoices: ' + error.message);
    }
  },

  async getGeneratedInvoices(year, month) {
    try {
      const invoices = await Invoice.findAll({
        where: {
          Year: year,
          Month: month,
          Status: 'Generated'
        },
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'Abbreviation']
          },
          {
            model: Currency,
            as: 'Currency',
            attributes: ['Name', 'Code', 'Symbol']
          }
        ]
      });
      return invoices;
    } catch (error) {
      throw new Error('Error fetching generated invoices: ' + error.message);
    }
  },

  async getInvoiceById(id) {
    try {
      const invoice = await Invoice.findByPk(id, {
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'Abbreviation']
          },
          {
            model: Currency,
            as: 'Currency',
            attributes: ['Name', 'Code', 'Symbol']
          }
        ]
      });
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      return invoice;
    } catch (error) {
      throw new Error('Error fetching invoice: ' + error.message);
    }
  },

  async deleteInvoice(id) {
    try {
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Delete PDF file if it exists
      if (invoice.PdfPath) {
        const filePath = path.join(__dirname, '../invoices', invoice.PdfPath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await invoice.destroy();
      return { message: 'Invoice deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting invoice: ' + error.message);
    }
  },

  async markInvoiceAsSent(id) {
    try {
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      await invoice.update({ 
        Status: 'Sent',
        InvoicedOn: new Date()
      });
      return invoice;
    } catch (error) {
      throw new Error('Error marking invoice as sent: ' + error.message);
    }
  },

  async regenerateInvoice(id) {
    try {
      const invoice = await Invoice.findByPk(id, {
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'Abbreviation']
          }
        ]
      });
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Regenerate PDF
      const invoiceDir = path.join(__dirname, '../invoices');
      const invoiceFilePath = path.join(invoiceDir, `${invoice.id}.pdf`);
      await createInvoicePdf({
        clientId: invoice.ClientID,
        year: invoice.Year,
        month: invoice.Month,
        totalAmount: invoice.TotalAmount,
        logoBase64: loadLogo()
      }, [], invoiceFilePath);

      return invoice;
    } catch (error) {
      throw new Error('Error regenerating invoice: ' + error.message);
    }
  }
};

module.exports = invoiceService;
  