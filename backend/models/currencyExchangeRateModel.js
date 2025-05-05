const mongoose = require('mongoose');

const currencyExchangeRateSchema = new mongoose.Schema({
  CurrencyFromID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Currency',
    required: true,
  },
  CurrencyToID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Currency',
    required: true,
  },
  ExchangeRate: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  Year: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

currencyExchangeRateSchema.index({ CurrencyFromID: 1, CurrencyToID: 1, Year: 1 }, { unique: true });

module.exports = mongoose.model('CurrencyExchangeRate', currencyExchangeRateSchema);
