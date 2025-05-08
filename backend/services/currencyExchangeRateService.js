const CurrencyExchangeRate = require('../models/currencyExchangeRateModel');
const logger = require('../utils/logger');

const createCurrencyExchangeRate = async (data) => {
  const { CurrencyFromID, CurrencyToID, Year } = data;

  const existingRate = await CurrencyExchangeRate.findOne({
    CurrencyFromID,
    CurrencyToID,
    Year,
  });

  if (existingRate) {
    throw new Error(`Exchange rate already exists for year ${Year}`);
  }

  const exchangeRate = new CurrencyExchangeRate(data);
  return await exchangeRate.save();
};

const getAllCurrencyExchangeRates = async (year) => {
  const rates = await CurrencyExchangeRate.find({ Year: year })
    .populate('CurrencyFromID')
    .populate('CurrencyToID');

  return rates.map(rate => ({
    ...rate.toObject(),
    ExchangeRate: parseFloat(rate.ExchangeRate.toString()),
  }));
};

const updateCurrencyExchangeRate = async (id, updates) => {
  const existing = await CurrencyExchangeRate.findById(id);
  if (!existing) throw new Error(`Exchange rate with ID ${id} not found`);

  const duplicateCheck = await CurrencyExchangeRate.findOne({
    _id: { $ne: id },
    CurrencyFromID: updates.CurrencyFromID || existing.CurrencyFromID,
    CurrencyToID: updates.CurrencyToID || existing.CurrencyToID,
    Year: updates.Year || existing.Year,
  });

  if (duplicateCheck) {
    throw new Error('Updated exchange rate already exists');
  }

  Object.assign(existing, updates);
  return await existing.save();
};

const deleteCurrencyExchangeRate = async (id) => {
  const rate = await CurrencyExchangeRate.findById(id);
  if (!rate) throw new Error(`Exchange rate with ID ${id} not found`);
  await rate.deleteOne();
  return { message: 'Exchange rate deleted successfully' };
};

module.exports = {
  createCurrencyExchangeRate,
  getAllCurrencyExchangeRates,
  updateCurrencyExchangeRate,
  deleteCurrencyExchangeRate,
};
