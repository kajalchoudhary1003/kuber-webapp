const currencyExchangeRateService = require('../services/currencyExchangeRateService');
const logger = require('../utils/logger');

exports.createCurrencyExchangeRate = async (req, res) => {
  try {
    logger.info('Create currency exchange rate service called');
    const exchangeRate = await currencyExchangeRateService.createCurrencyExchangeRate(req.body);
    res.status(201).json(exchangeRate);
  } catch (error) {
    logger.error(`Error creating currency exchange rate: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCurrencyExchangeRates = async (req, res) => {
  try {
    const { year } = req.params;
    logger.info(`Get all currency exchange rates service called for year: ${year}`);
    const exchangeRates = await currencyExchangeRateService.getAllCurrencyExchangeRates(year);
    res.status(200).json(exchangeRates);
  } catch (error) {
    logger.error(`Error fetching currency exchange rates for year ${req.params.year}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCurrencyExchangeRate = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Update currency exchange rate service called for ID: ${id}`);
    const updatedExchangeRate = await currencyExchangeRateService.updateCurrencyExchangeRate(id, req.body);
    res.status(200).json(updatedExchangeRate);
  } catch (error) {
    logger.error(`Error updating currency exchange rate with ID ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCurrencyExchangeRate = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Delete currency exchange rate service called for ID: ${id}`);
    const result = await currencyExchangeRateService.deleteCurrencyExchangeRate(id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error deleting currency exchange rate with ID ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
