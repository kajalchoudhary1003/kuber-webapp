const express = require('express');
const router = express.Router();
const paymentTrackerController = require('../controllers/paymentTrackerController');

router.post('/payment', paymentTrackerController.createPayment);
router.get('/payment/last-three/:clientId', paymentTrackerController.getLastThreePaymentsByClient);
router.get('/reconciliation-note', paymentTrackerController.getReconciliationNote);
router.put('/reconciliation-note', paymentTrackerController.updateReconciliationNote);

module.exports = router;
