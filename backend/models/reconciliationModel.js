// models/reconciliationNoteModel.js
const mongoose = require('mongoose');

// Define the schema for ReconciliationNote
const reconciliationNoteSchema = new mongoose.Schema({
  note: {
    type: String,
    required: true, // Ensure that the note is provided
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date/time
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date/time
  },
}, {
  timestamps: false, // We will manage timestamps manually
});

// Middleware to update `updatedAt` before saving
reconciliationNoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model from the schema
const ReconciliationNote = mongoose.model('ReconciliationNote', reconciliationNoteSchema);

module.exports = ReconciliationNote;
