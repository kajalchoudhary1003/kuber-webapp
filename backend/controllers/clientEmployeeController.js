const clientEmployeeService = require('../services/clientEmployeeService');
const logger = require('../utils/logger');

exports.assignEmployeeToClient = async (req, res) => {
  try {
    const result = await clientEmployeeService.assignEmployeeToClient(req.body);
    res.status(201).json(result);
  } catch (error) {
    logger.error(`Error assigning employee: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllClientEmployees = async (req, res) => {
  try {
    const { clientId } = req.params;
    const employees = await clientEmployeeService.getClientEmployees(clientId);
    res.json(employees);
  } catch (error) {
    logger.error(`Error fetching client employees: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getClientEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await clientEmployeeService.getClientEmployeeById(id);
    res.json(employee);
  } catch (error) {
    logger.error(`Error fetching employee: ${error.message}`);
    res.status(404).json({ error: error.message });
  }
};

exports.updateClientEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await clientEmployeeService.updateClientEmployee(id, req.body);
    res.json(updated);
  } catch (error) {
    logger.error(`Error updating employee: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteClientEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await clientEmployeeService.deleteClientEmployee(id);
    res.json(result);
  } catch (error) {
    logger.error(`Error deleting employee: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
