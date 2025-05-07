const mongoose = require('mongoose');

const clientEmployeeSchema = new mongoose.Schema({
  EmployeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  ClientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  StartDate: {
    type: Date,
    required: true
  },
  EndDate: {
    type: Date
  },
  MonthlyBilling: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  Status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('ClientEmployee', clientEmployeeSchema);
