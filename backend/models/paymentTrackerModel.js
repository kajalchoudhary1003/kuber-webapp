const mongoose = require('mongoose');

const paymentTrackerSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  receivedDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  remark: {
    type: String,
    default: null,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

const PaymentTracker = mongoose.model('PaymentTracker', paymentTrackerSchema);
module.exports = PaymentTracker;
