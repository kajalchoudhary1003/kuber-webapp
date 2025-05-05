const Ledger = require('../models/ledgerModel');
const PaymentTracker = require('../models/paymentTrackerModel');
const Client = require('../models/clientModel');

const getClientBalanceReport = async () => {
  try {
    const clients = await Client.findAll();
    
    const report = await Promise.all(clients.map(async (client) => {
      const totalBill = await Ledger.sum('Amount', { where: { ClientID: client.id } }) || 0;
      const totalPaid = await PaymentTracker.sum('Amount', { where: { ClientID: client.id } }) || 0;
      const balance = totalBill - totalPaid;

      return {
        clientName: client.ClientName,
        totalBill,
        totalPaid,
        balance,
      };
    }));

    return report;
  } catch (error) {
    console.error('Error fetching client balance report:', error);
    throw new Error('Error fetching client balance report');
  }
};

module.exports = {
  getClientBalanceReport,
};
