// controllers/clientEmployeeController.js
const clientEmployeeService = require('../services/clientEmployeeService');

exports.assignEmployeeToClient = async (req, res) => {
  try {
    const data = await clientEmployeeService.assignEmployeeToClient(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getClientEmployees = async (req, res) => {
  try {
    const data = await clientEmployeeService.getClientEmployees(req.params.clientId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getClientEmployeeById = async (req, res) => {
  try {
    const data = await clientEmployeeService.getClientEmployeeById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateClientEmployee = async (req, res) => {
  try {
    const data = await clientEmployeeService.updateClientEmployee(req.params.id, req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteClientEmployee = async (req, res) => {
  try {
    const data = await clientEmployeeService.deleteClientEmployee(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
