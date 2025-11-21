// src/models/QRToken.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const qrTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true
  },
  prestation: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  usedAt: {
    type: Date
  }
});

module.exports = mongoose.model('QRToken', qrTokenSchema);
