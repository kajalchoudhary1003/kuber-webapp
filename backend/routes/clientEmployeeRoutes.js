const express = require('express');
const router = express.Router();
const clientEmployeeController = require('../controllers/clientEmployeeController');

// Assign employee to client
router.post('/assign', clientEmployeeController.assignEmployeeToClient);

// Get all client employees for a client
router.get('/:clientId/employees', clientEmployeeController.getAllClientEmployees);

// Get one client employee by ID
router.get('/employee/:id', clientEmployeeController.getClientEmployeeById);

// Update a client employee
router.put('/employee/:id', clientEmployeeController.updateClientEmployee);

// Delete a client employee
router.delete('/employee/:id', clientEmployeeController.deleteClientEmployee);

module.exports = router;
