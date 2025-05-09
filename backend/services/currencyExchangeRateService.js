const { Op } = require('sequelize');
const CurrencyExchangeRate = require('../models/currencyExchangeRateModel');
const Currency = require('../models/currencyModel');

const currencyExchangeRateService = {
  async getAllExchangeRates() {
    try {
      const rates = await CurrencyExchangeRate.findAll({
        include: [
          { model: Currency, as: 'CurrencyFrom' },
          { model: Currency, as: 'CurrencyTo' }
        ],
        order: [['Year', 'DESC'], ['Month', 'DESC']]
      });
      return rates;
    } catch (error) {
      throw new Error('Error fetching exchange rates: ' + error.message);
    }
  },

  async getExchangeRateById(id) {
    try {
      const rate = await CurrencyExchangeRate.findByPk(id, {
        include: [
          { model: Currency, as: 'CurrencyFrom' },
          { model: Currency, as: 'CurrencyTo' }
        ]
      });
      if (!rate) {
        throw new Error('Exchange rate not found');
      }
      return rate;
    } catch (error) {
      throw new Error('Error fetching exchange rate: ' + error.message);
    }
  },

  async createExchangeRate(rateData) {
    try {
      // Validate currencies exist
      const [fromCurrency, toCurrency] = await Promise.all([
        Currency.findByPk(rateData.CurrencyFromID),
        Currency.findByPk(rateData.CurrencyToID)
      ]);

      if (!fromCurrency || !toCurrency) {
        throw new Error('One or both currencies not found');
      }

      // Check for existing rate
      const existingRate = await CurrencyExchangeRate.findOne({
        where: {
          CurrencyFromID: rateData.CurrencyFromID,
          CurrencyToID: rateData.CurrencyToID,
          Year: rateData.Year,
          Month: rateData.Month
        }
      });

      if (existingRate) {
        throw new Error('Exchange rate already exists for this currency pair and period');
      }

      const rate = await CurrencyExchangeRate.create(rateData);
      return rate;
    } catch (error) {
      throw new Error('Error creating exchange rate: ' + error.message);
    }
  },

  async updateExchangeRate(id, rateData) {
    try {
      const rate = await CurrencyExchangeRate.findByPk(id);
      if (!rate) {
        throw new Error('Exchange rate not found');
      }

      // If currencies are being changed, validate they exist
      if (rateData.CurrencyFromID || rateData.CurrencyToID) {
        const [fromCurrency, toCurrency] = await Promise.all([
          Currency.findByPk(rateData.CurrencyFromID || rate.CurrencyFromID),
          Currency.findByPk(rateData.CurrencyToID || rate.CurrencyToID)
        ]);

        if (!fromCurrency || !toCurrency) {
          throw new Error('One or both currencies not found');
        }
      }

      // Check for duplicate if period or currencies are being changed
      if (rateData.Year || rateData.Month || rateData.CurrencyFromID || rateData.CurrencyToID) {
        const existingRate = await CurrencyExchangeRate.findOne({
          where: {
            CurrencyFromID: rateData.CurrencyFromID || rate.CurrencyFromID,
            CurrencyToID: rateData.CurrencyToID || rate.CurrencyToID,
            Year: rateData.Year || rate.Year,
            Month: rateData.Month || rate.Month,
            id: { [Op.ne]: id }
          }
        });

        if (existingRate) {
          throw new Error('Exchange rate already exists for this currency pair and period');
        }
      }

      await rate.update(rateData);
      return rate;
    } catch (error) {
      throw new Error('Error updating exchange rate: ' + error.message);
    }
  },

  async deleteExchangeRate(id) {
    try {
      const rate = await CurrencyExchangeRate.findByPk(id);
      if (!rate) {
        throw new Error('Exchange rate not found');
      }
      await rate.destroy();
      return { message: 'Exchange rate deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting exchange rate: ' + error.message);
    }
  },

  async searchExchangeRates(query) {
    try {
      const rates = await CurrencyExchangeRate.findAll({
        where: {
          [Op.or]: [
            { Year: { [Op.like]: `%${query}%` } },
            { Month: { [Op.like]: `%${query}%` } }
          ]
        },
        include: [
          { model: Currency, as: 'CurrencyFrom' },
          { model: Currency, as: 'CurrencyTo' }
        ],
        order: [['Year', 'DESC'], ['Month', 'DESC']]
      });
      return rates;
    } catch (error) {
      throw new Error('Error searching exchange rates: ' + error.message);
    }
  },

  async getExchangeRateByCurrencies(fromCurrencyId, toCurrencyId, year, month) {
    try {
      const rate = await CurrencyExchangeRate.findOne({
        where: {
          CurrencyFromID: fromCurrencyId,
          CurrencyToID: toCurrencyId,
          Year: year,
          Month: month
        },
        include: [
          { model: Currency, as: 'CurrencyFrom' },
          { model: Currency, as: 'CurrencyTo' }
        ]
      });
      if (!rate) {
        throw new Error('Exchange rate not found for the specified currencies and period');
      }
      return rate;
    } catch (error) {
      throw new Error('Error fetching exchange rate: ' + error.message);
    }
  }
};

module.exports = currencyExchangeRateService;
