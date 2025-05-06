const mongoose = require('mongoose');
const PaymentTracker = require('../models/paymentTrackerModel');
const Ledger = require('../models/ledgerModel');
const Client = require('../models/clientModel');
const Currency = require('../models/currencyModel');
const ReconciliationNote = require('../models/reconciliationModel');

const recalculateBalanceFromStart = async (clientId, session) => {
  const ledgerEntries = await Ledger.find({ ClientID: clientId }).sort({ Date: 1 }).session(session);
  const paymentEntries = await PaymentTracker.find({ ClientID: clientId }).sort({ ReceivedDate: 1 }).session(session);

  const combinedEntries = [
    ...ledgerEntries.map(entry => ({
      type: 'Invoice',
      date: entry.Date,
      amount: entry.Amount,
    })),
    ...paymentEntries.map(entry => ({
      type: 'Payment',
      date: entry.ReceivedDate,
      amount: entry.Amount,
    })),
  ];

  combinedEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

  let balance = 0;
  for (const entry of combinedEntries) {
    if (entry.type === 'Invoice') {
      balance += parseFloat(entry.amount);
    } else if (entry.type === 'Payment') {
      balance -= parseFloat(entry.amount);
    }

    if (entry.type === 'Invoice') {
      await Ledger.updateMany(
        { ClientID: clientId, Date: entry.date },
        { $set: { Balance: balance } },
        { session }
      );
    }
  }
};

const createPayment = async (clientId, receivedDate, amount, remark) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payment = await PaymentTracker.create([{
      ClientID: clientId,
      ReceivedDate: receivedDate,
      Amount: amount,
      Remark: remark,
    }], { session });

    await Client.updateOne(
      { _id: clientId },
      { $set: { paymentLastUpdated: new Date() } },
      { session }
    );

    await recalculateBalanceFromStart(clientId, session);
    await session.commitTransaction();
    session.endSession();

    return payment[0].toJSON();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Error creating payment: ${error.message}`);
  }
};

const getLastThreePaymentsByClient = async (clientId) => {
  const payments = await PaymentTracker.find({ ClientID: clientId })
    .populate({
      path: 'ClientID',
      select: 'ClientName paymentLastUpdated',
      populate: {
        path: 'BillingCurrency',
        select: 'CurrencyCode'
      }
    })
    .sort({ ReceivedDate: -1, createdAt: -1 })
    .limit(3);

  const currency = payments.length > 0 && payments[0].ClientID.BillingCurrency;
  return {
    paymentLastUpdated: payments.length > 0 ? payments[0].ClientID.paymentLastUpdated : null,
    currency: currency ? currency.CurrencyCode : null,
    payments: payments.map(p => p.toJSON()),
  };
};

const getReconciliationNote = async () => {
  const note = await ReconciliationNote.findOne().sort({ createdAt: -1 });
  return note ? note.toJSON() : null;
};

const createOrUpdateReconciliationNote = async (noteContent) => {
  const existingNote = await ReconciliationNote.findOne();

  if (existingNote) {
    existingNote.note = noteContent;
    await existingNote.save();
    return existingNote.toJSON();
  } else {
    const newNote = await ReconciliationNote.create({ note: noteContent });
    return newNote.toJSON();
  }
};

module.exports = {
  createPayment,
  getLastThreePaymentsByClient,
  getReconciliationNote,
  createOrUpdateReconciliationNote,
};
