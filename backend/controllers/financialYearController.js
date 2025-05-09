const financialYearService = require('../services/financialYearService');
const logger = require('../utils/logger');

// Get paginated financial years
const getFinancialYears = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    logger.info('Get financial years service called');
    const years = await financialYearService.getFinancialYears({ page, limit });
    res.json(years);
  } catch (error) {
    logger.error(`Error fetching financial years: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch financial years' });
  }
};

// Add a new financial year
const addFinancialYear = async (req, res) => {
  try {
    logger.info('Add financial year service called');
    const newYear = await financialYearService.addFinancialYear();
    res.status(201).json(newYear);
  } catch (error) {
    logger.error(`Error adding financial year: ${error.message}`);
    res.status(500).json({ error: 'Failed to add financial year' });
  }
};

module.exports = {
  getFinancialYears,
  addFinancialYear,
};
