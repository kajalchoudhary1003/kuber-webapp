// models/employeeCostModel.js
const mongoose = require('mongoose');
const Employee = require('./employeeModel');

// Define the schema for EmployeeCost
const employeeCostSchema = new mongoose.Schema({
  EmployeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  Year: {
    type: Number,
    required: true,
  },
  Apr: {
    type: mongoose.Decimal128,
    default: 0,
  },
  May: {
    type: mongoose.Decimal128,
    default: 0,
  },
  Jun: {
    type: mongoose.Decimal128,
    default: 0,
  },
  Jul: {
    type: mongoose.Decimal128,
    default: 0,
  },
  Aug: {
    type: mongoose.Decimal128,
    default: 0,
  },
  Sep: {
    type: mongoose.Decimal128,
    default: 0,
  },
  Oct: {
    type: mongoose.Decimal128,
    default: 0,
  },
  Nov: {
    type: mongoose.Decimal128,
    default: 0,
  },
  Dec: {
    type: mongoose.Decimal128,
    default: 0,
  },
  Jan: {
    type: mongoose.Decimal128,
    default: 0,
  },
  Feb: {
    type: mongoose.Decimal128,
    default: 0,
  },
  Mar: {
    type: mongoose.Decimal128,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create a unique index on EmployeeID and Year to prevent duplicates
employeeCostSchema.index({ EmployeeID: 1, Year: 1 }, { unique: true });

// Create the model from the schema
const EmployeeCost = mongoose.model('EmployeeCost', employeeCostSchema);

module.exports = EmployeeCost;
