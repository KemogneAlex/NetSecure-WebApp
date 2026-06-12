const Joi = require("joi");

// Schéma de validation pour les données d'un appareil
const deviceSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  status: Joi.string().valid("active", "inactive", "maintenance").required(),
  // Ajoutez d'autres champs selon votre modèle Device
});

// Schéma de validation pour la mise à jour des données d'un appareil
const deviceUpdateSchema = Joi.object({
  name: Joi.string(),
  type: Joi.string(),
  status: Joi.string().valid("active", "inactive", "maintenance"),
  // Ajoutez d'autres champs selon votre modèle Device
}).min(1); // Au moins un champ doit être fourni pour la mise à jour

// Fonction pour valider les données d'un nouvel appareil
exports.validateDeviceData = (data) => {
  const { error } = deviceSchema.validate(data);
  return error ? error.details : null;
};

// Fonction pour valider les données de mise à jour d'un appareil
exports.validateDeviceUpdate = (data) => {
  const { error } = deviceUpdateSchema.validate(data);
  return error ? error.details : null;
};

// Fonction pour vérifier les permissions d'un utilisateur
exports.userHasPermission = (user, action) => {
  // Exemple simple de gestion des rôles et permissions
  const rolesPermissions = {
    admin: [
      "viewAllDevices",
      "addDevice",
      "viewDevice",
      "editDevice",
      "deleteDevice",
    ],
    user: ["viewDevice"],
    // Ajoutez d'autres rôles et permissions selon vos besoins
  };

  if (!user || !user.role || !rolesPermissions[user.role]) {
    return false;
  }

  return rolesPermissions[user.role].includes(action);
};

// Fonction pour filtrer les données d'un appareil
exports.filterDeviceData = (device) => {
  // Filtrer et retourner uniquement les données nécessaires et sécurisées
  const { _id, name, type, status } = device;
  return { _id, name, type, status };
};
