const financialYearService = require('../services/financialYearService');
const logger = require('../utils/logger');

const financialYearController = {
  async getAllFinancialYears(req, res) {
    try {
      const years = await financialYearService.getAllFinancialYears();
      res.json(years);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getFinancialYearById(req, res) {
    try {
      const year = await financialYearService.getFinancialYearById(req.params.id);
      res.json(year);
    } catch (error) {
      if (error.message === 'Financial year not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async createFinancialYear(req, res) {
    try {
      const year = await financialYearService.createFinancialYear(req.body);
      res.status(201).json(year);
    } catch (error) {
      if (error.message === 'Financial year overlaps with an existing period') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async updateFinancialYear(req, res) {
    try {
      const year = await financialYearService.updateFinancialYear(req.params.id, req.body);
      res.json(year);
    } catch (error) {
      if (error.message === 'Financial year not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'Financial year overlaps with an existing period') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async deleteFinancialYear(req, res) {
    try {
      const result = await financialYearService.deleteFinancialYear(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Financial year not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async searchFinancialYears(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const years = await financialYearService.searchFinancialYears(query);
      res.json(years);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getCurrentFinancialYear(req, res) {
    try {
      const year = await financialYearService.getCurrentFinancialYear();
      res.json(year);
    } catch (error) {
      if (error.message === 'No active financial year found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

module.exports = financialYearController;
