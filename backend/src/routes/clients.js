
// src/routes/clients.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const auth = require('../middleware/auth');

// Toutes les routes nécessitent authentification
router.get('/', auth, clientController.getAllClients);
router.get('/stats', auth, clientController.getStats);
router.get('/:id', auth, clientController.getClientById);
router.delete('/:id', auth, clientController.deleteClient);

module.exports = router;