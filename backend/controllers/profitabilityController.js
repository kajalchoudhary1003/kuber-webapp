const profitabilityService = require('../services/profitabilityService');
const logger = require('../utils/logger');

module.exports = {
  // Controller for client profitability report
  getProfitabilityReport: async (req, res) => {
    try {
      const { clientId, financialYear } = req.query;

      if (!clientId || !financialYear) {
        return res.status(400).send('Client ID and Financial Year are required.');
      }

      logger.info(`Get profitability report service called for clientId: ${clientId}, financialYear: ${financialYear}`);

      const reportData = await profitabilityService.getProfitabilityReport(clientId, financialYear);
      
      res.json(reportData);
    } catch (error) {
      logger.error(`Error fetching profitability report: ${error.message}`);
      res.status(500).send(`Error fetching profitability report: ${error.message}`);
    }
  },

  // Controller for employee profitability report
  getEmployeeProfitabilityReport: async (req, res) => {
    try {
      const { financialYear } = req.query;

      if (!financialYear) {
        return res.status(400).send('Financial Year is required.');
      }

      logger.info(`Get employee profitability report service called for financialYear: ${financialYear}`);
      
      const reportData = await profitabilityService.getEmployeeProfitabilityReport(financialYear);
      
      res.json(reportData);
    } catch (error) {
      logger.error(`Error fetching employee profitability report: ${error.message}`);
      res.status(500).send(`Error fetching employee profitability report: ${error.message}`);
    }
  },

  // Controller for client profitability report
  getClientProfitabilityReport: async (req, res) => {
    try {
      const { financialYear } = req.query;

      if (!financialYear) {
        return res.status(400).send('Financial Year is required.');
      }

      logger.info(`Get client profitability report service called for financialYear: ${financialYear}`);

      const reportData = await profitabilityService.getClientProfitabilityReport(financialYear);
      
      res.json(reportData);
    } catch (error) {
      logger.error(`Error fetching client profitability report: ${error.message}`);
      res.status(500).send(`Error fetching client profitability report: ${error.message}`);
    }
  }
};
