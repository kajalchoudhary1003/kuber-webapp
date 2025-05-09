const profitabilityService = require('../services/profitabilityService');
const logger = require('../utils/logger');

const getProfitabilityReport = async (req, res) => {
  const { clientId, financialYear } = req.params;
  try {
    const report = await profitabilityService.getProfitabilityReport(clientId, financialYear);
    res.status(200).json(report);
  } catch (error) {
    logger.error(`Error fetching profitability report: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeProfitabilityReport = async (req, res) => {
  const { financialYear } = req.params;
  try {
    const report = await profitabilityService.getEmployeeProfitabilityReport(financialYear);
    res.status(200).json(report);
  } catch (error) {
    logger.error(`Error fetching employee profitability report: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getClientProfitabilityReport = async (req, res) => {
  const { financialYear } = req.params;
  try {
    const report = await profitabilityService.getClientProfitabilityReport(financialYear);
    res.status(200).json(report);
  } catch (error) {
    logger.error(`Error fetching client profitability report: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfitabilityReport,
  getEmployeeProfitabilityReport,
  getClientProfitabilityReport,
};
