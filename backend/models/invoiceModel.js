// models/invoiceModel.js
const mongoose = require('mongoose');
const Client = require('./clientModel');

// Define the schema for Invoice
const invoiceSchema = new mongoose.Schema({
  ClientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  Year: {
    type: Number,
    required: true,
  },
  Month: {
    type: Number,
    required: true,
  },
  TotalAmount: {
    type: mongoose.Decimal128,
    required: true,
  },
  OrganisationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organisation',
    required: true,
  },
  BankDetailID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BankDetail',
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  PdfPath: {
    type: String,
    default: null, // default to null if not provided
  },
  InvoicedOn: {
    type: Date,
    default: null, // or set a default value if required
  },
  GeneratedOn: {
    type: Date,
    required: true,
    default: Date.now, // default to current time if not provided
  },
}, {
  timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
});

// Create the model from the schema
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
