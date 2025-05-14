const { Op } = require('sequelize');
const sequelize = require('../db/connectDB').sequelize;
const Client = require('../models/clientModel');
const Invoice = require('../models/invoiceModel');
const PaymentTracker = require('../models/paymentTrackerModel');
const Currency = require('../models/currencyModel');

const clientBalanceService = {
  // Add this function to the clientBalanceService object
  async getClientBalanceReport() {
    const transaction = await sequelize.transaction();
    try {
      // Get all clients with their balance information
      const clients = await Client.findAll({
        attributes: ['id', 'ClientName'],
        transaction
      });

      const report = await Promise.all(clients.map(async (client) => {
        // Get total invoiced amount for each client
        const invoiceTotal = await Invoice.findOne({
          where: { ClientID: client.id },
          attributes: [
            [sequelize.fn('SUM', sequelize.col('TotalAmount')), 'totalBill']
          ],
          raw: true,
          transaction
        });

        // Get total paid amount for each client
        const paymentTotal = await PaymentTracker.findOne({
          where: { ClientID: client.id },
          attributes: [
            [sequelize.fn('SUM', sequelize.col('Amount')), 'totalPaid']
          ],
          raw: true,
          transaction
        });

        const totalBill = invoiceTotal?.totalBill || 0;
        const totalPaid = paymentTotal?.totalPaid || 0;
        const balance = totalBill - totalPaid;

        return {
          clientId: client.id,
          clientName: client.ClientName,
          totalBill,
          totalPaid,
          balance
        };
      }));

      await transaction.commit();
      return report;
    } catch (error) {
      await transaction.rollback();
      console.error('Error generating client balance report:', error);
      throw new Error('Failed to generate client balance report');
    }
  },

  async getClientBalanceHistory(clientId, startDate, endDate) {
    const transaction = await sequelize.transaction();
    try {
      const client = await Client.findByPk(clientId, {
        include: [
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          }
        ],
        transaction
      });

      if (!client) {
        throw new Error('Client not found');
      }

      // Get all invoices within date range
      const invoices = await Invoice.findAll({
        where: {
          ClientID: clientId,
          InvoiceDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: [
          'InvoiceDate',
          'CurrencyID',
          'TotalAmount'
        ],
        order: [['InvoiceDate', 'ASC']],
        transaction
      });

      // Get all payments within date range
      const payments = await PaymentTracker.findAll({
        where: {
          ClientID: clientId,
          ReceivedDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: [
          'ReceivedDate',
          'CurrencyID',
          'Amount'
        ],
        order: [['ReceivedDate', 'ASC']],
        transaction
      });

      // Combine and sort transactions
      const transactions = [
        ...invoices.map(inv => ({
          date: inv.InvoiceDate,
          type: 'invoice',
          currencyId: inv.CurrencyID,
          amount: parseFloat(inv.TotalAmount)
        })),
        ...payments.map(pay => ({
          date: pay.ReceivedDate,
          type: 'payment',
          currencyId: pay.CurrencyID,
          amount: -parseFloat(pay.Amount)
        }))
      ].sort((a, b) => new Date(a.date) - new Date(b.date));

      // Calculate running balance
      const balances = {};
      const history = [];

      for (const transaction of transactions) {
        const { date, type, currencyId, amount } = transaction;
        
        if (!balances[currencyId]) {
          balances[currencyId] = 0;
        }
        balances[currencyId] += amount;

        history.push({
          date,
          type,
          currencyId,
          amount,
          balance: balances[currencyId]
        });
      }

      await transaction.commit();
      return {
        clientId: client.id,
        clientName: client.ClientName,
        history
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error('Error calculating client balance history: ' + error.message);
    }
  },

  async getClientBalance(clientId) {
    const transaction = await sequelize.transaction();
    try {
      const client = await Client.findByPk(clientId, {
        include: [
          {
            model: Currency,
            as: 'BillingCurrency',
            attributes: ['CurrencyName', 'CurrencyCode']
          }
        ],
        transaction
      });
  
      if (!client) {
        throw new Error('Client not found');
      }
  
      // Get all invoices for the client
      const invoiceTotal = await Invoice.findOne({
        where: { ClientID: clientId },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('TotalAmount')), 'totalBill']
        ],
        raw: true,
        transaction
      });
  
      // Get all payments for the client
      const paymentTotal = await PaymentTracker.findOne({
        where: { ClientID: client.id },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('Amount')), 'totalPaid']
        ],
        raw: true,
        transaction
      });
  
  
      // Calculate balance for each currency
      // const balances = {};
      // // const currencies = {};
  
      // // Process invoices
      // for (const invoice of invoices) {
      //   const currencyId = invoice.BillingCurrencyID;
      //   const amount = parseFloat(invoice.getDataValue('totalInvoiced'));
        
      //   if (!balances[currencyId]) {
      //     balances[currencyId] = 0;
      //   }
      //   balances[currencyId] += amount;
      // }
  
      // Process payments
      // const totalPaid = payments.length > 0 ? parseFloat(payments[0].getDataValue('totalPaid')) : 0;
      // const clientCurrencyId = client.BillingCurrencyID;
      
      const totalBill = invoiceTotal?.totalBill || 0;
      const totalPaid = paymentTotal?.totalPaid || 0;
      const balance = totalBill - totalPaid; // This matches the overview page calculation
  
      // if (!balances[clientCurrencyId]) {
      //   balances[clientCurrencyId] = 0;
      // }
      // balances[clientCurrencyId] -= totalPaid;
  
      // // Get currency details
      // const currencyIds = [...new Set([...Object.keys(balances)])];
      // const currencyDetails = await Currency.findAll({
      //   where: { id: { [Op.in]: currencyIds } },
      //   attributes: ['id', 'CurrencyName', 'CurrencyCode'],
      //   transaction
      // });
  
      // Format the response
      const formattedBalances = [{
        currencyId: client.BillingCurrencyID,
        currencyName: client.BillingCurrency.CurrencyName,
        currencyCode: client.BillingCurrency.CurrencyCode,
        balance: balance
      }];
      await transaction.commit();
      return {
        clientId: client.id,
        clientName: client.ClientName,
        balances: formattedBalances
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error('Error calculating client balance: ' + error.message);
    }
  },

  async getClientBalanceSummary() {
    const transaction = await sequelize.transaction();
    try {
      const clients = await Client.findAll({
        include: [
          {
            model: Currency,
            attributes: ['CurrencyName', 'CurrencyCode']
          }
        ],
        transaction
      });

      const summary = await Promise.all(clients.map(async client => {
        const balance = await this.getClientBalance(client.id);
        return balance;
      }));

      await transaction.commit();
      return summary;
    } catch (error) {
      await transaction.rollback();
      throw new Error('Error calculating client balance summary: ' + error.message);
    }
  }
};

module.exports = clientBalanceService;
