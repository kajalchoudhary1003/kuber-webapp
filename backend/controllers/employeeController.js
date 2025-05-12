const employeeService = require('../services/employeeService');
const logger = require('../utils/logger');

const employeeController = {
  async getAllEmployees(req, res) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEmployeeById(req, res) {
    try {
      const employee = await employeeService.getEmployeeById(req.params.id);
      res.json(employee);
    } catch (error) {
      if (error.message === 'Employee not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async createEmployee(req, res) {
    try {
      const { year, ...employeeData } = req.body;
      const employee = await employeeService.createEmployee(employeeData, year);
      res.status(201).json(employee);
    } catch (error) {
      if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async updateEmployee(req, res) {
    try {
      const employee = await employeeService.updateEmployee(req.params.id, req.body);
      res.json(employee);
    } catch (error) {
      if (error.message === 'Employee not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async deleteEmployee(req, res) {
    try {
      const result = await employeeService.deleteEmployee(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Employee not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('active client assignments')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async searchEmployees(req, res) {
    try {
      const employees = await employeeService.searchEmployees(req.query.q);
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEmployeeClients(req, res) {
    try {
      const clients = await employeeService.getEmployeeClients(req.params.id);
      res.json(clients);
    } catch (error) {
      if (error.message === 'Employee not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

module.exports = employeeController;
