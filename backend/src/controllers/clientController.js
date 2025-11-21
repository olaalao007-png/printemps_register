// src/controllers/clientController.js
const Client = require('../models/Client');

// Récupérer tous les clients
exports.getAllClients = async (req, res) => {
  try {
    const { limit, sort } = req.query;

    let query = Client.find();

    // Tri
    if (sort === 'desc') {
      query = query.sort({ createdAt: -1 });
    } else {
      query = query.sort({ createdAt: 1 });
    }

    // Limite
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const clients = await query;

    res.json(clients);
  } catch (error) {
    console.error('Erreur récupération clients:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des clients' 
    });
  }
};

// Récupérer un client par ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ 
        message: 'Client non trouvé' 
      });
    }

    res.json(client);
  } catch (error) {
    console.error('Erreur récupération client:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du client' 
    });
  }
};

// Supprimer un client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return res.status(404).json({ 
        message: 'Client non trouvé' 
      });
    }

    res.json({ 
      message: 'Client supprimé avec succès' 
    });
  } catch (error) {
    console.error('Erreur suppression client:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du client' 
    });
  }
};

// Statistiques
exports.getStats = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();

    res.json({
      totalClients
    });
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques' 
    });
  }
};