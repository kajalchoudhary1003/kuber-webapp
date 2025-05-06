const express = require('express');
const router = express.Router();
const profitabilityController = require('../controllers/profitabilityController');

// Route to get the profitability report for a client
router.get('/get-profitability-report', profitabilityController.getProfitabilityReport);

// Route to get the employee profitability report
router.get('/get-employee-profitability-report', profitabilityController.getEmployeeProfitabilityReport);

// Route to get the client profitability report
router.get('/get-client-profitability-report', profitabilityController.getClientProfitabilityReport);

module.exports = router;
