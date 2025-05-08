// models/roleModel.js
const mongoose = require('mongoose');

// Define the schema for Role
const roleSchema = new mongoose.Schema({
  RoleName: {
    type: String,
    required: true, // Ensure that RoleName is provided
    maxlength: 50,  // Maximum length for RoleName
  },
}, {
  timestamps: false, // We will handle timestamps manually if required
});

// Create the model from the schema
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
