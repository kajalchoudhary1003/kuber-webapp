const profitabilityService = require('../services/profitabilityService');
const logger = require('../utils/logger');

const getProfitabilityReport = async (req, res) => {
  try {
    const { clientId, financialYear } = req.params;

    if (!clientId || !financialYear) {
      return res.status(400).json({ error: 'Client ID and Financial Year are required.' });
    }

    logger.info(`Get profitability report service called for clientId: ${clientId}, financialYear: ${financialYear}`);

    const reportData = await profitabilityService.getProfitabilityReport(clientId, financialYear);
    return res.status(200).json(reportData);
  } catch (error) {
    logger.error(`Error fetching profitability report: ${error.message}`);
    return res.status(500).json({ error: `Error fetching profitability report: ${error.message}` });
  }
};

const getEmployeeProfitabilityReport = async (req, res) => {
  try {
    const { financialYear } = req.params;

    if (!financialYear) {
      return res.status(400).json({ error: 'Financial Year is required.' });
    }

    logger.info(`Get employee profitability report service called for financialYear: ${financialYear}`);

    const reportData = await profitabilityService.getEmployeeProfitabilityReport(financialYear);
    return res.status(200).json(reportData);
  } catch (error) {
    logger.error(`Error fetching employee profitability report: ${error.message}`);
    return res.status(500).json({ error: `Error fetching employee profitability report: ${error.message}` });
  }
};

const getClientProfitabilityReport = async (req, res) => {
  try {
    const { financialYear } = req.params;

    if (!financialYear) {
      return res.status(400).json({ error: 'Financial Year is required.' });
    }

    logger.info(`Get client profitability report service called for financialYear: ${financialYear}`);

    const reportData = await profitabilityService.getClientProfitabilityReport(financialYear);
    return res.status(200).json(reportData);
  } catch (error) {
    logger.error(`Error fetching client profitability report: ${error.message}`);
    return res.status(500).json({ error: `Error fetching client profitability report: ${error.message}` });
  }
};

module.exports = {
  getProfitabilityReport,
  getEmployeeProfitabilityReport,
  getClientProfitabilityReport,
};
