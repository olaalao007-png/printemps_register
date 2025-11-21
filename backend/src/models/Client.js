
// src/models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  prestation: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  qrToken: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRToken'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Client', clientSchema);