const Entretien = require('../models/Entretien');

// Créer un entretien
exports.createEntretien = async (req, res) => {
  try {
    const {
      reference,
      date,
      referenceUtilisation,
      produit,
      nettoyage,
      lubrification
    } = req.body;

    // Si tu utilises un middleware d'auth, récupère l'id utilisateur connecté
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Utilisateur non authentifié' });

    const utilisateurs = [userId]; // tableau avec un seul utilisateur

    const existing = await Entretien.findOne({ reference });
    if (existing) {
      return res.status(400).json({ message: 'Référence déjà utilisée.' });
    }

    const entretien = new Entretien({
      reference,
      date,
      utilisateurs,
      referenceUtilisation,
      produit,
      nettoyage,
      lubrification
    });

    await entretien.save();
    res.status(201).json(entretien);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Obtenir tous les entretiens
exports.getEntretiens = async (req, res) => {
  try {
    const entretiens = await Entretien.find()
      .populate('utilisateurs', 'nom prenom email role')
      .populate('produit', 'code designation statut')
      .populate('referenceUtilisation', 'reference date'); // adapte selon ton modèle Utilisation

    res.status(200).json(entretiens);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir un entretien par ID
exports.getEntretienById = async (req, res) => {
  try {
    const entretien = await Entretien.findById(req.params.id)
      .populate('utilisateurs', 'nom prenom email role')
      .populate('produit', 'code designation statut')
      .populate('referenceUtilisation', 'reference date');

    if (!entretien) return res.status(404).json({ message: 'Entretien non trouvé' });

    res.status(200).json(entretien);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour un entretien
exports.updateEntretien = async (req, res) => {
  try {
    const {
      reference,
      date,
      utilisateurs,
      referenceUtilisation,
      produit,
      nettoyage,
      lubrification
    } = req.body;

    const entretien = await Entretien.findById(req.params.id);
    if (!entretien) {
      return res.status(404).json({ message: 'Entretien non trouvé' });
    }

    // Mise à jour des champs
    entretien.reference = reference || entretien.reference;
    entretien.date = date || entretien.date;
    entretien.utilisateurs = utilisateurs || entretien.utilisateurs;
    entretien.referenceUtilisation = referenceUtilisation || entretien.referenceUtilisation;
    entretien.produit = produit || entretien.produit;
    entretien.nettoyage = nettoyage || entretien.nettoyage;
    entretien.lubrification = lubrification || entretien.lubrification;
    entretien.updatedAt = new Date();

    await entretien.save();
    res.status(200).json({ message: 'Entretien mis à jour avec succès.', entretien });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un entretien
exports.deleteEntretien = async (req, res) => {
  try {
    const entretien = await Entretien.findByIdAndDelete(req.params.id);
    if (!entretien) return res.status(404).json({ message: 'Entretien non trouvé' });

    res.status(200).json({ message: 'Entretien supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
