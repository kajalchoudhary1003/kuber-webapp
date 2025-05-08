// models/levelModel.js
const mongoose = require('mongoose');

// Define the schema for Level
const levelSchema = new mongoose.Schema({
  LevelName: {
    type: String,
    required: true,
    maxlength: 50, // Ensure that LevelName doesn't exceed 50 characters
  },
}, {
  timestamps: false, // Disable timestamps if not needed
});

// Create the model from the schema
const Level = mongoose.model('Level', levelSchema);

module.exports = Level;
