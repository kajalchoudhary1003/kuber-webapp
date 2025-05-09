const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerController');

// GET /api/ledger?clientId=...&startDate=...&endDate=...

router.post('/by-client-date-range', ledgerController);

module.exports = router;
