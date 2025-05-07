// models/clientModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  ClientName: { type: String, required: true },
  Abbreviation: { type: String, required: true },
  ContactPerson: { type: String, required: true },
  Email: { type: String, required: true },
  RegisteredAddress: { type: String, required: true },
  BillingCurrencyID: { type: Schema.Types.ObjectId, ref: 'Currency', required: true }, 
  OrganisationID: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true }, 
  BankDetailID: { type: Schema.Types.ObjectId, ref: 'BankDetail', required: true },
  paymentLastUpdated: { type: Date },
}, { timestamps: true });


module.exports = mongoose.model('Client', clientSchema);
