// models/currencyModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currencySchema = new Schema({
  CurrencyCode: { type: String, unique: true, required: true },
  CurrencyName: { type: String, required: true },
});

module.exports = mongoose.model('Currency', currencySchema);
