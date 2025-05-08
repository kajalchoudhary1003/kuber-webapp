const express = require('express');
const router = express.Router();
const financialYearController = require('../controllers/financialYearController');

// GET paginated financial years
router.get('/', financialYearController.getFinancialYears);

// POST new financial year
router.post('/', financialYearController.addFinancialYear);

module.exports = router;
