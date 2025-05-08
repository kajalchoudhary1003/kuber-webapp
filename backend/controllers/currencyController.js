const currencyService = require('../services/currencyService');

const createCurrency = async (req, res) => {
  try {
    const currency = await currencyService.createCurrency(req.body);
    res.status(201).json(currency);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await currencyService.getAllCurrencies();
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCurrency = await currencyService.updateCurrency(id, req.body);
    res.status(200).json(updatedCurrency);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await currencyService.deleteCurrency(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCurrency,
  getAllCurrencies,
  updateCurrency,
  deleteCurrency,
};
