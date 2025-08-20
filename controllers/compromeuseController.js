const Compromeuse = require('../models/Compromeuse');

// Créer une compromeuse
exports.createCompromeuse = async (req, res) => {
  try {
    const { code, designation, statut } = req.body;

    // Vérifier unicité du code
    const existing = await Compromeuse.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Code compromeuse déjà utilisé.' });
    }

    const compromeuse = new Compromeuse({
      code,
      designation,
      statut: statut || 'actif',
      createdBy: req.user.id // ou req.user? selon ton auth
    });

    await compromeuse.save();
    res.status(201).json({ message: 'Compromeuse créée avec succès.', compromeuse });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Lister toutes les compromeuses
exports.getCompromeuses = async (req, res) => {
  try {
    const compromeuses = await Compromeuse.find().populate('createdBy', 'nom prenom email');
    res.status(200).json(compromeuses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer une compromeuse par ID
exports.getCompromeuseById = async (req, res) => {
  try {
    const compromeuse = await Compromeuse.findById(req.params.id);
    if (!compromeuse) return res.status(404).json({ message: 'Compromeuse non trouvée' });
    res.status(200).json(compromeuse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour une compromeuse
exports.updateCompromeuse = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();

    const compromeuse = await Compromeuse.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!compromeuse) return res.status(404).json({ message: 'Compromeuse non trouvée' });

    res.status(200).json({ message: 'Compromeuse mise à jour', compromeuse });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une compromeuse
exports.deleteCompromeuse = async (req, res) => {
  try {
    const compromeuse = await Compromeuse.findByIdAndDelete(req.params.id);
    if (!compromeuse) return res.status(404).json({ message: 'Compromeuse non trouvée' });

    res.status(200).json({ message: 'Compromeuse supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
