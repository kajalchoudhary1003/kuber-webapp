const express = require('express');
const profitabilityController = require('../controllers/profitabilityController');

const router = express.Router();

// Define routes
router.get('/profitability/:clientId/:financialYear', profitabilityController.getProfitabilityReport);
router.get('/employee-profitability/:financialYear', profitabilityController.getEmployeeProfitabilityReport);
router.get('/client-profitability/:financialYear', profitabilityController.getClientProfitabilityReport);

module.exports = router;
