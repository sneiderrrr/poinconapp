// models/HistoriqueConnexion.js
const mongoose = require('mongoose');

const historiqueConnexionSchema = new mongoose.Schema({
  login: String,
  nom: String,
  prenom: String,
  dateConnexion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HistoriqueConnexion', historiqueConnexionSchema);
