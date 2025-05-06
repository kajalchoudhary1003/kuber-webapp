const employeeService = require('../services/employeeService');
const logger = require('../utils/logger');

exports.createEmployee = async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    logger.error(`Error creating employee: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, query = '' } = req.query;
    const result = await employeeService.getAllEmployees(Number(page), Number(limit), query);
    res.json(result);
  } catch (error) {
    logger.error(`Error fetching employees: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.json(employee);
  } catch (error) {
    logger.error(`Error fetching employee: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await employeeService.updateEmployee(req.params.id, req.body);
    res.json(updatedEmployee);
  } catch (error) {
    logger.error(`Error updating employee: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const result = await employeeService.deleteEmployee(req.params.id);
    res.json(result);
  } catch (error) {
    logger.error(`Error deleting employee: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.searchEmployees = async (req, res) => {
  try {
    const employees = await employeeService.searchEmployees(req.params.query);
    res.json(employees);
  } catch (error) {
    logger.error(`Error searching employees: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
