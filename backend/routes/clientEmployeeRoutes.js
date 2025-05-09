const express = require('express');
const router = express.Router();
const clientEmployeeController = require('../controllers/clientEmployeeController');

// Get all client employees
router.get('/', clientEmployeeController.getAllClientEmployees);

// Get client employee by ID
router.get('/:id', clientEmployeeController.getClientEmployeeById);

// Create new client employee
router.post('/', clientEmployeeController.createClientEmployee);

// Update client employee
router.put('/:id', clientEmployeeController.updateClientEmployee);

// Delete client employee
router.delete('/:id', clientEmployeeController.deleteClientEmployee);

// Search client employees
router.get('/search', clientEmployeeController.searchClientEmployees);

// Get client employees by client
router.get('/client/:clientId', clientEmployeeController.getClientEmployeesByClient);

// Get client employees by employee
router.get('/employee/:employeeId', clientEmployeeController.getClientEmployeesByEmployee);

// Get client employees by status
router.get('/status/:status', clientEmployeeController.getClientEmployeesByStatus);

// Get client employee summary
router.get('/summary', clientEmployeeController.getClientEmployeeSummary);

module.exports = router;
