// models/billingDetailModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billingDetailSchema = new Schema({
  EmployeeID: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  ClientID: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  Year: { type: Number, required: true },
  Apr: { type: Number, default: 0 },
  May: { type: Number, default: 0 },
  Jun: { type: Number, default: 0 },
  Jul: { type: Number, default: 0 },
  Aug: { type: Number, default: 0 },
  Sep: { type: Number, default: 0 },
  Oct: { type: Number, default: 0 },
  Nov: { type: Number, default: 0 },
  Dec: { type: Number, default: 0 },
  Jan: { type: Number, default: 0 },
  Feb: { type: Number, default: 0 },
  Mar: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('BillingDetail', billingDetailSchema);
