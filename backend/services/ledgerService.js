const Ledger = require('../models/ledgerModel');
const Invoice = require('../models/invoiceModel');
const PaymentTracker = require('../models/paymentTrackerModel');
const Client = require('../models/clientModel');
const Currency = require('../models/currencyModel');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

const getLedgerEntriesByClientAndDateRange = async (clientId, startDate, endDate) => {
  try {
    console.log("Ledger Service - Input parameters:", {
      clientId,
      startDate,
      endDate,
      types: {
        clientId: typeof clientId,
        startDate: typeof startDate,
        endDate: typeof endDate
      }
    });

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    console.log("Ledger Query Parameters:", {
      clientId,
      startDate,
      endDate,
      startObj: start,
      endObj: end
    });

    // First, get client information with currency
    console.log("Fetching client with ID:", clientId);
    const client = await Client.findByPk(clientId, {
      include: [
        {
          model: Currency,
          as: 'BillingCurrency',
          attributes: ['CurrencyCode', 'CurrencyName'],
          required: false // Make this optional in case currency is not set
        }
      ]
    });

    if (!client) {
      console.error(`Client not found with ID: ${clientId}`);
      throw new Error('Client not found');
    }

    console.log('Client found:', {
      id: client.id,
      name: client.ClientName,
      billingCurrencyId: client.BillingCurrencyID,
      currency: client.BillingCurrency
    });

    // Default currency symbol mapping (fallback)
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$'
    };

    const currencyCode = client.BillingCurrency?.CurrencyCode || 'INR';
    const currencyName = client.BillingCurrency?.CurrencyName || 'Indian Rupee';
    const currencySymbol = currencySymbols[currencyCode] || '₹';

    console.log('Currency info:', { currencyCode, currencyName, currencySymbol });

    // Debug: Check total counts first
    const totalInvoices = await Invoice.count({
      where: { ClientID: clientId }
    });
    const totalPayments = await PaymentTracker.count({
      where: { ClientID: clientId }
    });
    
    console.log(`Total records for client ${clientId}:`, {
      invoices: totalInvoices,
      payments: totalPayments
    });

    // Fetch invoices within date range
    console.log("Fetching invoices with date filter...");
    const invoiceEntries = await Invoice.findAll({
      where: {
        ClientID: clientId,
        GeneratedOn: {
          [Op.gte]: start,
          [Op.lte]: end 
        },
      },
      attributes: ['id', 'GeneratedOn', 'TotalAmount', 'Status'],
      order: [['GeneratedOn', 'ASC']],
    });

    console.log(`Invoice entries within date range: ${invoiceEntries.length}`);
    if (invoiceEntries.length > 0) {
      console.log("Sample date-filtered invoice:", invoiceEntries[0].dataValues);
    }

    
    const paymentEntries = await PaymentTracker.findAll({
      where: {
        ClientID: clientId,
        ReceivedDate: { 
          [Op.gte]: start,
          [Op.lte]: end 
        },
      },
      attributes: ['id', 'ReceivedDate', 'Amount', 'Remark'],
      order: [['ReceivedDate', 'ASC']],
    });
    
    console.log(`Payment entries within date range: ${paymentEntries.length}`);
    if (paymentEntries.length > 0) {
      console.log("Sample payment entry:", {
        id: paymentEntries[0].id,
        receivedDate: paymentEntries[0].ReceivedDate,
        amount: paymentEntries[0].Amount
      });
    }

    // Combine entries
    const combinedEntries = [
      ...invoiceEntries.map(entry => ({
        id: entry.id,
        Date: entry.GeneratedOn, // Changed from InvoiceDate to GeneratedOn
        type: 'Invoice',
        InvoiceRaised: parseFloat(entry.TotalAmount) || 0, // Changed from Amount to TotalAmount based on your model
        PaymentReceived: null,
        Status: entry.Status
      })),
      ...paymentEntries.map(entry => ({
        id: entry.id,
        Date: entry.ReceivedDate,
        type: 'Payment',
        InvoiceRaised: null,
        PaymentReceived: parseFloat(entry.Amount) || 0,
        Remark: entry.Remark
      })),
    ];
   
    combinedEntries.sort((a, b) => new Date(a.Date) - new Date(b.Date));
   
    let balance = 0;
    const entriesWithBalance = combinedEntries.map(entry => {
      if (entry.type === 'Invoice') {
        balance += entry.InvoiceRaised;
      } else if (entry.type === 'Payment') {
        balance -= entry.PaymentReceived;
      }
      return { ...entry, BalancePayment: balance };
    });

    const result = {
      clientInfo: {
        id: client.id,
        name: client.ClientName,
        currencyCode: currencyCode,
        currencyName: currencyName,
        currencySymbol: currencySymbol
      },
      entries: entriesWithBalance,
      balance: balance,
    };


    return result;

  } catch (error) {
    
    logger.error(`Error fetching ledger entries: ${error.message}`, {
      clientId,
      startDate,
      endDate,
      stack: error.stack
    });
    
    throw new Error(`Error fetching ledger entries: ${error.message}`);
  }
};

module.exports = { getLedgerEntriesByClientAndDateRange };
