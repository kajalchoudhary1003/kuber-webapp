const financialYearService = require('../services/financialYearService');

const getFinancialYears = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const data = await financialYearService.getFinancialYears({ page, limit });
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching financial years: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const addFinancialYear = async (req, res) => {
  try {
    const year = await financialYearService.addFinancialYear();
    res.status(201).json(year);
  } catch (error) {
    console.error(`Error adding financial year: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFinancialYears,
  addFinancialYear,
};
