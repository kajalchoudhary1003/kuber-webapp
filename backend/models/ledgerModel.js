const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  balance: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

const Ledger = mongoose.model('Ledger', ledgerSchema);
module.exports = Ledger;
