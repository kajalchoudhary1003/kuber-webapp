const express = require('express');
const router = express.Router();
const employeeCostController = require('../controllers/employeeCostController');

// Get all employee costs
router.get('/', employeeCostController.getAllEmployeeCosts);

// Get employee cost by ID
router.get('/:id', employeeCostController.getEmployeeCostById);

// Create new employee cost
router.post('/', employeeCostController.createEmployeeCost);

// Update employee cost
router.put('/:id', employeeCostController.updateEmployeeCost);

// Delete employee cost
router.delete('/:id', employeeCostController.deleteEmployeeCost);

// Search employee costs
router.get('/search', employeeCostController.searchEmployeeCosts);

// Get employee costs by employee
router.get('/employee/:employeeId', employeeCostController.getEmployeeCostsByEmployee);

// Get employee costs by period
router.get('/period', employeeCostController.getEmployeeCostsByPeriod);

module.exports = router;
