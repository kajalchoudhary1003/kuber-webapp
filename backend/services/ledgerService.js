const { Op } = require('sequelize');
const Ledger = require('../models/ledgerModel');
const Client = require('../models/clientModel');
const Currency = require('../models/currencyModel');
const Invoice = require('../models/invoiceModel');
const sequelize = require('sequelize');

const ledgerService = {
  async getAllLedgerEntries() {
    try {
      const ledgerEntries = await Ledger.findAll({
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          },
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          },
          {
            model: Invoice,
            attributes: ['InvoiceNumber', 'InvoiceDate']
          }
        ],
        order: [['TransactionDate', 'DESC']]
      });
      return ledgerEntries;
    } catch (error) {
      throw new Error('Error fetching ledger entries: ' + error.message);
    }
  },

  async getLedgerEntryById(id) {
    try {
      const ledgerEntry = await Ledger.findByPk(id, {
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          },
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          },
          {
            model: Invoice,
            attributes: ['InvoiceNumber', 'InvoiceDate']
          }
        ]
      });
      if (!ledgerEntry) {
        throw new Error('Ledger entry not found');
      }
      return ledgerEntry;
    } catch (error) {
      throw new Error('Error fetching ledger entry: ' + error.message);
    }
  },

  async createLedgerEntry(ledgerData) {
    try {
      const ledgerEntry = await Ledger.create(ledgerData);
      return ledgerEntry;
    } catch (error) {
      throw new Error('Error creating ledger entry: ' + error.message);
    }
  },

  async updateLedgerEntry(id, ledgerData) {
    try {
      const ledgerEntry = await Ledger.findByPk(id);
      if (!ledgerEntry) {
        throw new Error('Ledger entry not found');
      }

      await ledgerEntry.update(ledgerData);
      return ledgerEntry;
    } catch (error) {
      throw new Error('Error updating ledger entry: ' + error.message);
    }
  },

  async deleteLedgerEntry(id) {
    try {
      const ledgerEntry = await Ledger.findByPk(id);
      if (!ledgerEntry) {
        throw new Error('Ledger entry not found');
      }
      await ledgerEntry.destroy();
      return { message: 'Ledger entry deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting ledger entry: ' + error.message);
    }
  },

  async searchLedgerEntries(query) {
    try {
      const ledgerEntries = await Ledger.findAll({
        where: {
          [Op.or]: [
            { Description: { [Op.like]: `%${query}%` } },
            { '$Client.ClientName$': { [Op.like]: `%${query}%` } },
            { '$Client.ClientCode$': { [Op.like]: `%${query}%` } },
            { '$Invoice.InvoiceNumber$': { [Op.like]: `%${query}%` } }
          ]
        },
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          },
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          },
          {
            model: Invoice,
            attributes: ['InvoiceNumber', 'InvoiceDate']
          }
        ],
        order: [['TransactionDate', 'DESC']]
      });
      return ledgerEntries;
    } catch (error) {
      throw new Error('Error searching ledger entries: ' + error.message);
    }
  },

  async getClientLedgerEntries(clientId) {
    try {
      const ledgerEntries = await Ledger.findAll({
        where: { ClientID: clientId },
        include: [
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          },
          {
            model: Invoice,
            attributes: ['InvoiceNumber', 'InvoiceDate']
          }
        ],
        order: [['TransactionDate', 'DESC']]
      });
      return ledgerEntries;
    } catch (error) {
      throw new Error('Error fetching client ledger entries: ' + error.message);
    }
  },

  async getLedgerEntriesByDateRange(startDate, endDate) {
    try {
      const ledgerEntries = await Ledger.findAll({
        where: {
          TransactionDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          },
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          },
          {
            model: Invoice,
            attributes: ['InvoiceNumber', 'InvoiceDate']
          }
        ],
        order: [['TransactionDate', 'DESC']]
      });
      return ledgerEntries;
    } catch (error) {
      throw new Error('Error fetching ledger entries by date range: ' + error.message);
    }
  },

  async getLedgerEntriesByType(type) {
    try {
      const ledgerEntries = await Ledger.findAll({
        where: { Type: type },
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          },
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          },
          {
            model: Invoice,
            attributes: ['InvoiceNumber', 'InvoiceDate']
          }
        ],
        order: [['TransactionDate', 'DESC']]
      });
      return ledgerEntries;
    } catch (error) {
      throw new Error('Error fetching ledger entries by type: ' + error.message);
    }
  },

  async getLedgerSummary() {
    try {
      const summary = await Ledger.findAll({
        attributes: [
          'Type',
          'CurrencyID',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('Amount')), 'totalAmount']
        ],
        group: ['Type', 'CurrencyID'],
        include: [
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          }
        ]
      });
      return summary;
    } catch (error) {
      throw new Error('Error fetching ledger summary: ' + error.message);
    }
  }
};

module.exports = ledgerService;
