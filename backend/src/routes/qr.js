// src/routes/qr.js
const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');

// Routes protégées (nécessitent authentification)
router.post('/generate', auth, qrController.generateQR);

// Routes publiques
router.get('/validate/:token', qrController.validateToken);
router.post('/submit/:token', qrController.submitForm);


module.exports = router;

// ================================
