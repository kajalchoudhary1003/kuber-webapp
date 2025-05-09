const Ledger = require('../models/ledgerModel');
const PaymentTracker = require('../models/paymentTrackerModel');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

const getLedgerEntriesByClientAndDateRange = async (clientId, startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const ledgerEntries = await Ledger.findAll({
      where: {
        ClientID: clientId,
        Date: { [Op.lte]: end },
      },
      order: [['Date', 'ASC']],
    });

    const paymentEntries = await PaymentTracker.findAll({
      where: {
        ClientID: clientId,
        ReceivedDate: { [Op.lte]: end },
      },
      order: [['ReceivedDate', 'ASC']],
    });

    const combinedEntries = [
      ...ledgerEntries.map(entry => ({
        id: entry.id,
        Date: entry.Date,
        type: 'Invoice',
        InvoiceRaised: entry.Amount,
        PaymentReceived: null,
      })),
      ...paymentEntries.map(entry => ({
        id: entry.id,
        Date: entry.ReceivedDate,
        type: 'Payment',
        InvoiceRaised: null,
        PaymentReceived: entry.Amount,
      })),
    ];

    combinedEntries.sort((a, b) => new Date(a.Date) - new Date(b.Date));

    let balance = 0;
    const entriesWithBalance = combinedEntries.map(entry => {
      if (entry.type === 'Invoice') {
        balance += parseFloat(entry.InvoiceRaised);
      } else if (entry.type === 'Payment') {
        balance -= parseFloat(entry.PaymentReceived);
      }
      return { ...entry, BalancePayment: balance };
    });

    const filteredEntries = entriesWithBalance.filter(entry => 
      new Date(entry.Date) >= start && new Date(entry.Date) <= end
    );

    return {
      entries: filteredEntries,
      balance,
    };
  } catch (error) {
    logger.error(`Error fetching ledger entries: ${error.message}`);
    throw new Error(`Error fetching ledger entries: ${error.message}`);
  }
};

module.exports = { getLedgerEntriesByClientAndDateRange };
