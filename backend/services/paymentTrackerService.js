const { Op } = require('sequelize');
const PaymentTracker = require('../models/paymentTrackerModel');
const Client = require('../models/clientModel');
const Currency = require('../models/currencyModel');
const Invoice = require('../models/invoiceModel');
const sequelize = require('sequelize');

const paymentTrackerService = {
  async getAllPayments() {
    try {
      const payments = await PaymentTracker.findAll({
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
        order: [['ReceivedDate', 'DESC']]
      });
      return payments;
    } catch (error) {
      throw new Error('Error fetching payments: ' + error.message);
    }
  },

  async getPaymentById(id) {
    try {
      const payment = await PaymentTracker.findByPk(id, {
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
      if (!payment) {
        throw new Error('Payment not found');
      }
      return payment;
    } catch (error) {
      throw new Error('Error fetching payment: ' + error.message);
    }
  },

  async createPayment(paymentData) {
    try {
      const payment = await PaymentTracker.create(paymentData);
      return payment;
    } catch (error) {
      throw new Error('Error creating payment: ' + error.message);
    }
  },

  async updatePayment(id, paymentData) {
    try {
      const payment = await PaymentTracker.findByPk(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      await payment.update(paymentData);
      return payment;
    } catch (error) {
      throw new Error('Error updating payment: ' + error.message);
    }
  },

  async deletePayment(id) {
    try {
      const payment = await PaymentTracker.findByPk(id);
      if (!payment) {
        throw new Error('Payment not found');
      }
      await payment.destroy();
      return { message: 'Payment deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting payment: ' + error.message);
    }
  },

  async searchPayments(query) {
    try {
      const payments = await PaymentTracker.findAll({
        where: {
          [Op.or]: [
            { ReferenceNumber: { [Op.like]: `%${query}%` } },
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
        order: [['ReceivedDate', 'DESC']]
      });
      return payments;
    } catch (error) {
      throw new Error('Error searching payments: ' + error.message);
    }
  },

  async getClientPayments(clientId) {
    try {
      const payments = await PaymentTracker.findAll({
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
        order: [['ReceivedDate', 'DESC']]
      });
      return payments;
    } catch (error) {
      throw new Error('Error fetching client payments: ' + error.message);
    }
  },

  async getPaymentsByDateRange(startDate, endDate) {
    try {
      const payments = await PaymentTracker.findAll({
        where: {
          ReceivedDate: {
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
        order: [['ReceivedDate', 'DESC']]
      });
      return payments;
    } catch (error) {
      throw new Error('Error fetching payments by date range: ' + error.message);
    }
  },

  async getPaymentsByStatus(status) {
    try {
      const payments = await PaymentTracker.findAll({
        where: { Status: status },
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
        order: [['ReceivedDate', 'DESC']]
      });
      return payments;
    } catch (error) {
      throw new Error('Error fetching payments by status: ' + error.message);
    }
  },

  async getPaymentsSummary() {
    try {
      const summary = await PaymentTracker.findAll({
        attributes: [
          'Status',
          'CurrencyID',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('Amount')), 'totalAmount']
        ],
        group: ['Status', 'CurrencyID'],
        include: [
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          }
        ]
      });
      return summary;
    } catch (error) {
      throw new Error('Error fetching payments summary: ' + error.message);
    }
  },

  async getPaymentsByInvoice(invoiceId) {
    try {
      const payments = await PaymentTracker.findAll({
        where: { InvoiceID: invoiceId },
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          },
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          }
        ],
        order: [['ReceivedDate', 'DESC']]
      });
      return payments;
    } catch (error) {
      throw new Error('Error fetching payments by invoice: ' + error.message);
    }
  }
};

module.exports = paymentTrackerService;
