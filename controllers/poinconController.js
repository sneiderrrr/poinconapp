const Poincon = require('../models/Poincon');
const AuditTrail = require('../models/AuditTrail');
const Marque = require('../models/Marque');
const logAuditTrail = require('../middleware/auditLogger');  // Vérifie que le chemin est correct
const DetailPoincon = require('../models/DetailPoincon');


exports.createPoincon = async (req, res) => {
  try {
    const {
      codeFormat,
      forme,
      fournisseur,
      marque,
      nbrComposants,
      statut,
      etat
    } = req.body;

    const ficheTechnique = req.file ? req.file.filename : null;


    // Vérification de l'unicité du codeFormat
    const existing = await Poincon.findOne({ codeFormat });
    if (existing) {
      return res.status(400).json({ message: 'Code format déjà utilisé.' });
    }

    // Création du poinçon
    const poincon = new Poincon({
      codeFormat,
      forme,
      fournisseur,
      marque,
      nbrComposants,
      ficheTechnique,
      statut: statut || 'actif',
      etat,
      createdBy: req.user.id
    });

    // Sauvegarde du poinçon
    const savedPoincon = await poincon.save();

    // Création automatique des détails du poinçon
    const detailList = [];
    for (let i = 1; i <= nbrComposants; i++) {
      detailList.push({
        poincon: savedPoincon._id,
        reference: i,
        description: "" // par défaut vide
      });
    }

    // Insertion en masse des détails
    await DetailPoincon.insertMany(detailList);

    // Audit
    await logAuditTrail(req, "CREATE", savedPoincon._id.toString(), `Création du poinçon ${savedPoincon.codeFormat}`);

    res.status(201).json({ message: 'Poinçon créé avec succès', poincon: savedPoincon });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Lister tous les poinçons
exports.getPoincons = async (req, res) => {
  try {
    const poincons = await Poincon.find()
      .populate('createdBy', 'nom prenom email role')
      .populate('fournisseur', 'designation pays statut')
      .populate('marque', 'designation statut')
      .populate('etat', 'code designation'); // 👈 Nouvelle population de l’état

    res.status(200).json(poincons);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un poinçon par ID
exports.getPoinconById = async (req, res) => {
  try {
    const poincon = await Poincon.findById(req.params.id)
      .populate('createdBy', 'nom prenom email role')
      .populate('fournisseur', 'designation pays statut')
      .populate('marque', 'designation statut')
      .populate('etat', 'code designation'); // 👈 Ajout ici aussi

    if (!poincon) return res.status(404).json({ message: 'Poinçon non trouvé' });
    res.status(200).json(poincon);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour un poinçon
exports.updatePoincon = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();

    const poincon = await Poincon.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!poincon) return res.status(404).json({ message: 'Poinçon non trouvé' });

    // Enregistrer l'action dans AuditTrail (mise à jour)
    await logAuditTrail(req, "UPDATE", poincon._id.toString(), `Mise à jour du poinçon ${poincon.codeFormat}`);

    res.status(200).json({ message: 'Poinçon mis à jour', poincon });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un poinçon
exports.deletePoincon = async (req, res) => {
  try {
    const poincon = await Poincon.findByIdAndDelete(req.params.id);
    if (!poincon) return res.status(404).json({ message: 'Poinçon non trouvé' });

    // Enregistrer l'action dans AuditTrail (suppression)
    await logAuditTrail(req, "DELETE", poincon._id.toString(), `Suppression du poinçon ${poincon.codeFormat}`);

    res.status(200).json({ message: 'Poinçon supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
