const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
  OrganisationName: { type: String, required: true, maxlength: 50 },
  Abbreviation: { type: String, required: true, maxlength: 10 },
  RegNumber: { type: String, required: true, maxlength: 30 },
});

module.exports = mongoose.model('Organisation', organisationSchema);
