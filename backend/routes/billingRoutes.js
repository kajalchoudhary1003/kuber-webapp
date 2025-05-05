// routes/billingRoutes.js
const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

// Route to get billing data for a specific client and year
router.get('/get-billing-data', billingController.getBillingData);

// Route to update billing data for a specific billing record
router.put('/update-billing-data', billingController.updateBillingData);

// Route to get clients for a specific year
router.get('/get-clients-for-year', billingController.getClientsForYear);

module.exports = router;
