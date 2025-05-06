// models/financialYearModel.js
const mongoose = require('mongoose');

// Define the schema for FinancialYear
const financialYearSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true,
  },
}, {
  timestamps: false, // Disable automatic creation of timestamps
});

// Create the model from the schema
const FinancialYear = mongoose.model('FinancialYear', financialYearSchema);

module.exports = FinancialYear;
