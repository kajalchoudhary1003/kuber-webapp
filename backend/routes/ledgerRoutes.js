const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerController');

// GET /api/ledger?clientId=...&startDate=...&endDate=...
router.get('/', ledgerController.getLedgerByClientAndDateRange);

module.exports = router;
