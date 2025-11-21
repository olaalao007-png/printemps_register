// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Générer un token JWT
const generateToken = (userId, username) => {
  return jwt.sign(
    { userId, username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username et password sont requis' 
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        message: 'Identifiants incorrects' 
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Identifiants incorrects' 
      });
    }

    // Générer le token
    const token = generateToken(user._id, user.username);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la connexion' 
    });
  }
};

// Créer un utilisateur (pour l'installation initiale)
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
console.log("BODY =", req.body);

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username et password sont requis' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Le mot de passe doit contenir au moins 6 caractères' 
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Cet utilisateur existe déjà' 
      });
    }

    // Créer l'utilisateur
    const user = new User({ username, password });
    await user.save();

    // Générer le token
    const token = generateToken(user._id, user.username);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'inscription' 
    });
  }
};