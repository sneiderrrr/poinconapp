const Produit = require('../models/Produit');

// Créer un produit
exports.createProduit = async (req, res) => {
  try {
    const { code, designation, statut, codeFormatParDefaut } = req.body;
    const createdBy = req.user.id; // L'ID de l'utilisateur connecté

    // Vérifier si le code existe déjà
    const existingProduit = await Produit.findOne({ code });
    if (existingProduit) {
      return res.status(400).json({ message: 'Code produit déjà utilisé.' });
    }

    const produit = new Produit({
      code,
      designation,
      statut: statut || 'actif',
      codeFormatParDefaut, // Si ce champ est passé dans la requête, il sera enregistré
      createdBy,
    });

    await produit.save();
    res.status(201).json({ message: 'Produit créé avec succès.', produit });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Lister tous les produits ou les produits actifs
exports.getProduits = async (req, res) => {
  try {
    const query = req.query.statut === 'actif' ? { statut: 'actif' } : {}; // Si un statut actif est demandé, on filtre
    const produits = await Produit.find(query)
      .populate('createdBy', 'nom prenom email role')
      .populate('codeFormatParDefaut', 'codeFormat forme marque statut'); // 🔗 poinçon lié

    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un produit par ID
exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id)
      .populate('createdBy', 'nom prenom email role')
      .populate('codeFormatParDefaut', 'codeFormat forme marque statut'); // 🔗 poinçon lié

    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });

    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour un produit
exports.updateProduit = async (req, res) => {
  try {
    const { code, designation, statut, codeFormatParDefaut } = req.body;

    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Mettez à jour les champs du produit
    produit.code = code || produit.code;
    produit.designation = designation || produit.designation;
    produit.statut = statut || produit.statut;
    produit.codeFormatParDefaut = codeFormatParDefaut || produit.codeFormatParDefaut;
    produit.updatedAt = new Date(); // Mettre à jour la date de modification

    // Sauvegardez les modifications dans la base de données
    await produit.save();

    res.status(200).json({ message: 'Produit mis à jour avec succès', produit });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// Récupérer le nombre de produits ajoutés par mois pour les 12 derniers mois
exports.getProduitsParMois = async (req, res) => {
  try {
    const currentDate = new Date();
    const twelveMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 12));

    // Récupérer les produits créés au cours des 12 derniers mois
    const produits = await Produit.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          count: { $sum: 1 }
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Organiser les données par mois (12 derniers mois)
    const result = [];
    for (let i = 0; i < 12; i++) {
      const monthData = produits.find(item => item._id.month === i + 1);
      result.push({
        month: i + 1,
        count: monthData ? monthData.count : 0,
      });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


// Supprimer un produit
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
