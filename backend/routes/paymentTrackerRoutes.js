const express = require('express');
const router = express.Router();
const paymentTrackerController = require('../controllers/paymentTrackerController');

// Get all payments
router.get('/', paymentTrackerController.getAllPayments);

// Get payment by ID
router.get('/:id', paymentTrackerController.getPaymentById);

// Create new payment
router.post('/', paymentTrackerController.createPayment);

// Update payment
router.put('/:id', paymentTrackerController.updatePayment);

// Delete payment
router.delete('/:id', paymentTrackerController.deletePayment);

// Search payments
router.get('/search', paymentTrackerController.searchPayments);

// Get client payments
router.get('/client/:clientId', paymentTrackerController.getClientPayments);

// Get payments by date range
router.get('/date-range', paymentTrackerController.getPaymentsByDateRange);

// Get payments by status
router.get('/status/:status', paymentTrackerController.getPaymentsByStatus);

// Get payments summary
router.get('/summary', paymentTrackerController.getPaymentsSummary);

// Get payments by invoice
router.get('/invoice/:invoiceId', paymentTrackerController.getPaymentsByInvoice);

module.exports = router;
