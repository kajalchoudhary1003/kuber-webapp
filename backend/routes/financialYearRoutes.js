const express = require('express');
const router = express.Router();
const financialYearController = require('../controllers/financialYearController');

// Get all financial years
router.get('/', financialYearController.getAllFinancialYears);

// Get financial year by ID
router.get('/:id', financialYearController.getFinancialYearById);

// Create new financial year
router.post('/', financialYearController.createFinancialYear);

// Update financial year
router.put('/:id', financialYearController.updateFinancialYear);

// Delete financial year
router.delete('/:id', financialYearController.deleteFinancialYear);

// Search financial years
router.get('/search', financialYearController.searchFinancialYears);

// Get current financial year
router.get('/current', financialYearController.getCurrentFinancialYear);

module.exports = router;
