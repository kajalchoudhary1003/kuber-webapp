const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  EmpCode: { type: String, unique: true, required: true },
  RoleID: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  LevelID: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true },
  OrganisationID: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  CTCAnnual: { type: Number, required: true },
  CTCMonthly: { type: Number, required: true },
  ContactNumber: { type: String, required: true },
  Email: { type: String, required: true },
  Status: { type: String, default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
