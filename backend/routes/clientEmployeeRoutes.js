// routes/clientEmployeeRoutes.js
const express = require('express');
const router = express.Router();
const clientEmployeeController = require('../controllers/clientEmployeeController');

// Log to verify controller import
console.log('clientEmployeeController:', clientEmployeeController);

// Create new client employee
router.post('/', clientEmployeeController.createClientEmployee);

// Get client employees by client
router.get('/client/:clientId', clientEmployeeController.getClientEmployeesByClient);

// Get client employee by ID
router.get('/:id', clientEmployeeController.getClientEmployeeById);

// Update client employee
router.put('/:id', clientEmployeeController.updateClientEmployee);

// Delete client employee
router.delete('/:id', clientEmployeeController.deleteClientEmployee);

module.exports = router;