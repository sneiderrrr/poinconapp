const mongoose = require("mongoose");

// 🔹 Permissions par défaut selon le rôle (issues de ton middleware)
const ROLE_DEFAULT_PERMISSIONS = {
  Administrateur: {
    users: ['create', 'read', 'update', 'delete'],
    produits: ['create', 'read', 'update', 'delete'],
    poincons: ['create', 'read', 'update', 'delete'],
    fournisseurs: ['create', 'read', 'update', 'delete'],
    marques: ['create', 'read', 'update', 'delete'],
    etatpoincons: ['create', 'read', 'update', 'delete'],
    formes: ['create', 'read', 'update', 'delete'],
    compromeuses: ['create', 'read', 'update', 'delete'],
    entretiens: ['create', 'read', 'update', 'delete'],
    utilisations: ['create', 'read', 'update', 'delete'],
  },
  Superviseur: {
    users: ['read'],
    produits: ['read'],
    poincons: ['read'],
    fournisseurs: ['read'],
    marques: ['read'],
    etatpoincons: ['read'],
    formes: ['read'],
    compromeuses: ['create', 'read', 'update'],
    entretiens: ['read'],
    utilisations: ['read'],
  },
  Agent: {
    users: ['read'],
    produits: ['read'],
    poincons: ['read'],
    fournisseurs: ['read'],
    marques: ['read'],
    etatpoincons: ['read'],
    formes: ['read'],
    compromeuses: ['read'],
    entretiens: ['read'],
    utilisations: ['create'],
  },
};

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    login: {
      type: String,
      required: true,
      unique: true,
    },
    motDePasse: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    statut: {
      type: String,
      enum: ["actif", "inactif"],
      default: "actif",
    },
    role: {
      type: String,
      enum: ["Administrateur", "Superviseur", "Agent"],
      default: "Agent",
    },
    // 🔹 Permissions dynamiques (Map module -> [actions])
    permissions: {
      type: Object,
      default: {},
    },
    nbErreursLogin: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt
  }
);

// 🧠 Récupérer les permissions par défaut d’un rôle
function getDefaultPermissionsForRole(role) {
  return ROLE_DEFAULT_PERMISSIONS[role] || {};
}

// 🪝 Pre-save : appliquer les permissions par défaut si aucune n’est définie
userSchema.pre("save", function (next) {
  if (!this.permissions || Object.keys(this.permissions).length === 0) {
    this.permissions = getDefaultPermissionsForRole(this.role);
  }
  next();
});

// 🪝 Pre-findOneAndUpdate : si on change de rôle et pas de permissions fournies → appliquer defaults
userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  const newRole = update.role || (update.$set && update.$set.role);

  const permissionsProvided =
    Object.prototype.hasOwnProperty.call(update, "permissions") ||
    (update.$set && Object.prototype.hasOwnProperty.call(update.$set, "permissions"));

  if (newRole && !permissionsProvided) {
  const defaults = getDefaultPermissionsForRole(newRole);
  if (update.$set) {
    update.$set.permissions = defaults;
  } else {
    update.permissions = defaults;
  }
  this.setUpdate(update);
}
  next();
});


// ✅ Méthode d’instance pratique pour vérifier une permission
userSchema.methods.hasPermission = function (module, action) {
  let actions;
  if (this.permissions instanceof Map) {
    actions = this.permissions.get(module);
  } else {
    actions = this.permissions[module];
  }
  return Array.isArray(actions) && actions.includes(action);
};

module.exports = mongoose.model("User", userSchema);
