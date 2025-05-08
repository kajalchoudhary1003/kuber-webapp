const express = require('express');
const router = express.Router();
const currencyExchangeRateController = require('../controllers/currencyExchangeRateController');

// Create
router.post('/', currencyExchangeRateController.createCurrencyExchangeRate);

// Read (Get all for a specific year)
router.get('/:year', currencyExchangeRateController.getAllCurrencyExchangeRates);

// Update
router.put('/:id', currencyExchangeRateController.updateCurrencyExchangeRate);

// Delete
router.delete('/:id', currencyExchangeRateController.deleteCurrencyExchangeRate);

module.exports = router;
