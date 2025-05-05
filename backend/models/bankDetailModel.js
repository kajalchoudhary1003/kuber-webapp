const mongoose = require('mongoose');

const bankDetailSchema = new mongoose.Schema({
  BankName: {
    type: String,
    required: true,
  },
  AccountNumber: {
    type: String,
    required: true,
  },
  SwiftCode: {
    type: String,
    required: true,
  },
  IfscCode: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const BankDetail = mongoose.model('BankDetail', bankDetailSchema);

module.exports = BankDetail;
