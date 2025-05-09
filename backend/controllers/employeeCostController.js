const employeeCostService = require('../services/employeeCostService');
const logger = require('../utils/logger');

const employeeCostController = {
  async getAllEmployeeCosts(req, res) {
    try {
      const costs = await employeeCostService.getAllEmployeeCosts();
      res.json(costs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEmployeeCostById(req, res) {
    try {
      const cost = await employeeCostService.getEmployeeCostById(req.params.id);
      res.json(cost);
    } catch (error) {
      if (error.message === 'Employee cost not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async createEmployeeCost(req, res) {
    try {
      const cost = await employeeCostService.createEmployeeCost(req.body);
      res.status(201).json(cost);
    } catch (error) {
      if (error.message === 'Employee not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'Cost record already exists for this employee and period') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async updateEmployeeCost(req, res) {
    try {
      const cost = await employeeCostService.updateEmployeeCost(req.params.id, req.body);
      res.json(cost);
    } catch (error) {
      if (error.message === 'Employee cost not found' || error.message === 'Employee not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'Cost record already exists for this employee and period') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async deleteEmployeeCost(req, res) {
    try {
      const result = await employeeCostService.deleteEmployeeCost(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Employee cost not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async searchEmployeeCosts(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const costs = await employeeCostService.searchEmployeeCosts(query);
      res.json(costs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEmployeeCostsByEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID is required' });
      }
      const costs = await employeeCostService.getEmployeeCostsByEmployee(employeeId);
      res.json(costs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEmployeeCostsByPeriod(req, res) {
    try {
      const { year, month } = req.query;
      if (!year || !month) {
        return res.status(400).json({ error: 'Both year and month are required' });
      }
      const costs = await employeeCostService.getEmployeeCostsByPeriod(year, month);
      res.json(costs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = employeeCostController;
