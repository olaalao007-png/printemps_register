// src/controllers/qrController.js
const QRToken = require('../models/QRToken');
const Client = require('../models/Client');

// Générer des QR codes
exports.generateQR = async (req, res) => {
  try {
    const { prestation, date, quantity } = req.body;

    // Validation
    if (!prestation || !date || !quantity) {
      return res.status(400).json({ 
        message: 'Prestation, date et quantity sont requis' 
      });
    }

    if (quantity < 1 || quantity > 100) {
      return res.status(400).json({ 
        message: 'La quantité doit être entre 1 et 100' 
      });
    }

    // Créer les tokens
    const tokens = [];
    for (let i = 0; i < quantity; i++) {
      const qrToken = new QRToken({
        prestation,
        date: new Date(date)
      });
      await qrToken.save();
      tokens.push(qrToken.token);
    }

    res.status(201).json({
      message: `${quantity} code(s) QR généré(s) avec succès`,
      tokens
    });
  } catch (error) {
    console.error('Erreur génération QR:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la génération des QR codes' 
    });
  }
};

// Valider un token QR
exports.validateToken = async (req, res) => {
  try {
    const { token } = req.params;

    const qrToken = await QRToken.findOne({ token });

    if (!qrToken) {
      return res.status(404).json({ 
        message: 'Code QR invalide' 
      });
    }

    if (qrToken.isUsed) {
      return res.status(400).json({ 
        message: 'Ce code QR a déjà été utilisé' 
      });
    }

    res.json({
      prestation: qrToken.prestation,
      date: qrToken.date
    });
  } catch (error) {
    console.error('Erreur validation token:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la validation du token' 
    });
  }
};

// Soumettre le formulaire client
exports.submitForm = async (req, res) => {
  try {
    const { token } = req.params;
    const { nom, prenom, contact } = req.body;

    // Validation
    if (!nom || !prenom || !contact) {
      return res.status(400).json({ 
        message: 'Nom, prénom et contact sont requis' 
      });
    }

    // Vérifier le token
    const qrToken = await QRToken.findOne({ token });

    if (!qrToken) {
      return res.status(404).json({ 
        message: 'Code QR invalide' 
      });
    }

    if (qrToken.isUsed) {
      return res.status(400).json({ 
        message: 'Ce code QR a déjà été utilisé' 
      });
    }

    // Créer le client
    const client = new Client({
      nom,
      prenom,
      contact,
      prestation: qrToken.prestation,
      date: qrToken.date,
      qrToken: qrToken._id
    });

    await client.save();

    // Marquer le token comme utilisé
    qrToken.isUsed = true;
    qrToken.usedAt = new Date();
    await qrToken.save();

    res.status(201).json({
      message: 'Formulaire soumis avec succès',
      client: {
        id: client._id,
        nom: client.nom,
        prenom: client.prenom
      }
    });
  } catch (error) {
    console.error('Erreur soumission formulaire:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la soumission du formulaire' 
    });
  }
};