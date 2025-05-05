// controllers/billingController.js
const billingService = require('../services/billingService');

// Controller method to get billing data for a specific client and year
exports.getBillingData = async (req, res) => {
  const { clientId, year } = req.query;
  try {
    const billingData = await billingService.getBillingData(clientId, year);
    res.json(billingData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller method to update billing data for a specific record
exports.updateBillingData = async (req, res) => {
  const { id, month, amount } = req.body;
  try {
    await billingService.updateBillingData(id, month, amount);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller method to get clients for a specific year
exports.getClientsForYear = async (req, res) => {
  const { year } = req.query;
  try {
    const clients = await billingService.getClientsForYear(year);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
