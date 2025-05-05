const Currency = require('../models/currencyModel');
const logger = require('../utils/logger');

const createCurrency = async (currencyData) => {
  try {
    const currency = await Currency.create(currencyData);
    return currency;
  } catch (error) {
    logger.error(`Error creating currency: ${error.message}`);
    throw new Error(`Error creating currency: ${error.message}`);
  }
};

const getAllCurrencies = async () => {
  try {
    const currencies = await Currency.find();
    return currencies;
  } catch (error) {
    logger.error(`Error fetching currencies: ${error.message}`);
    throw new Error(`Error fetching currencies: ${error.message}`);
  }
};

const updateCurrency = async (currencyId, updates) => {
  try {
    const currency = await Currency.findById(currencyId);
    if (!currency) {
      throw new Error(`Currency with id ${currencyId} not found`);
    }
    Object.assign(currency, updates);
    return await currency.save();
  } catch (error) {
    logger.error(`Error updating currency: ${error.message}`);
    throw new Error(`Error updating currency: ${error.message}`);
  }
};

const deleteCurrency = async (currencyId) => {
  try {
    const currency = await Currency.findById(currencyId);
    if (!currency) {
      throw new Error(`Currency with id ${currencyId} not found`);
    }
    await currency.remove();
    return { message: 'Currency deleted successfully' };
  } catch (error) {
    logger.error(`Error deleting currency: ${error.message}`);
    throw new Error(`Error deleting currency: ${error.message}`);
  }
};

module.exports = {
  createCurrency,
  getAllCurrencies,
  updateCurrency,
  deleteCurrency,
};
