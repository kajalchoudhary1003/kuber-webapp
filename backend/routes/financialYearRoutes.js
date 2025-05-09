const express = require('express');
const router = express.Router();
const financialYearController = require('../controllers/financialYearController');

// GET /api/financial-years?page=1&limit=2
router.get('/', financialYearController.getFinancialYears);

// POST /api/financial-years
router.post('/', financialYearController.addFinancialYear);

module.exports = router;
