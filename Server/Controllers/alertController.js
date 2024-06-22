/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 01/06/2024 - 03:24:09
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/06/2024
    * - Author          : kemogne
    * - Modification    : 
**/
const Alert = require('../models/Alert');

// Récupérer toutes les alertes
exports.getAllAlerts = async (req, res) => {
  try {
    // Vérifier si l'utilisateur a le droit de récupérer les alertes
    if (!userHasPermission(req.user, 'viewAlerts')) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Récupérer toutes les alertes de la base de données
    const alerts = await Alert.find();

    // Appliquer des filtres pour ne retourner que les informations nécessaires
    const filteredAlerts = alerts.map(filterAlertData);

    res.status(200).json(filteredAlerts);
  } catch (error) {
    // Gérer les erreurs
    res.status(500).send('Erreur serveur: ' + error.message);
  }
};

// Fonction pour vérifier si l'utilisateur a la permission de réaliser une action
function userHasPermission(user, action) {
 // Définissez un objet qui mappe les actions aux rôles autorisés
 const rolePermissions = {
    viewAlerts: ['admin', 'security_manager'],
    editDevice: ['admin', 'device_manager'],
    deleteDevice: ['admin'],
    addDevice: ['admin', 'device_manager'],
    viewDevices: ['admin', 'user', 'device_manager'],
    manageUsers: ['admin'],
    viewReports: ['admin', 'report_viewer'],
    generateReports: ['admin', 'report_generator'],
    // Continuez à ajouter d'autres actions et leurs rôles autorisés ici
  };

  // Vérifiez si l'utilisateur a un des rôles autorisés pour l'action demandée
  return rolePermissions[action] && rolePermissions[action].some(role => user.roles.includes(role));
}

// Fonction pour filtrer les données d'une alerte
function filterAlertData(alert) {
  // Sélectionnez et retournez uniquement les informations nécessaires de l'alerte
  // pour éviter de divulguer des données sensibles ou inutiles
  return {
    id: alert._id,
    type: alert.type,
    message: alert.message,
    date: alert.date,
    // Ajoutez d'autres champs nécessaires
  };
}
const Alert = require('../models/Alert');

// Ajouter une nouvelle alerte
exports.addAlert = async (req, res) => {
  try {
    // Vérifier si l'utilisateur a le droit d'ajouter une alerte
    if (!userHasPermission(req.user, 'addAlert')) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Valider les données de la nouvelle alerte avant de les sauvegarder
    const validationError = validateAlertData(req.body);
    if (validationError) {
      return res.status(400).json({ message: 'Données d\'alerte invalides', errors: validationError });
    }

    // Créer une nouvelle alerte avec les données validées
    const newAlert = new Alert(req.body);

    // Sauvegarder l'alerte dans la base de données
    const savedAlert = await newAlert.save();

    // Répondre avec l'alerte sauvegardée
    res.status(201).json(savedAlert);
  } catch (error) {
    // Gérer les erreurs
    res.status(500).send('Erreur serveur: ' + error.message);
  }
};

// Fonction pour vérifier si l'utilisateur a la permission de réaliser une action
function userHasPermission(user, action) {
  // Définissez un objet qui mappe les actions aux rôles autorisés
  const rolePermissions = {
    addAlert: ['admin', 'security_manager'],
    viewAlerts: ['admin', 'security_manager', 'user'],
    editAlert: ['admin', 'security_manager'],
    deleteAlert: ['admin', 'security_manager'],
    addDevice: ['admin', 'device_manager'],
    viewDevices: ['admin', 'device_manager', 'user'],
    editDevice: ['admin', 'device_manager'],
    deleteDevice: ['admin', 'device_manager'],
    addUser: ['admin'],
    viewUsers: ['admin', 'user_manager'],
    editUser: ['admin', 'user_manager'],
    deleteUser: ['admin', 'user_manager'],
    generateReports: ['admin', 'report_manager'],
    viewReports: ['admin', 'report_manager', 'user'],
    // Continuez à ajouter d'autres actions et leurs rôles autorisés ici
  };

  // Vérifiez si l'utilisateur a un des rôles autorisés pour l'action demandée
  return rolePermissions[action] && rolePermissions[action].some(role => user.roles.includes(role));
}
// Fonction pour valider les données d'une nouvelle alerte
function validateAlertData(data) {
    let errors = {};

    // Validation du type d'alerte
    if (!data.type || typeof data.type !== 'string') {
      errors.type = 'Le type d\'alerte est requis et doit être une chaîne de caractères.';
    }
  
    // Validation du message de l'alerte
    if (!data.message || typeof data.message !== 'string') {
      errors.message = 'Le message de l\'alerte est requis et doit être une chaîne de caractères.';
    }
  
    // Validation de la date de l'alerte
    if (data.date && isNaN(Date.parse(data.date))) {
      errors.date = 'La date de l\'alerte n\'est pas valide.';
    }
  
    // Validation de la gravité de l'alerte
    if (data.severity && !['faible', 'moyenne', 'élevée', 'critique'].includes(data.severity)) {
      errors.severity = 'La gravité spécifiée n\'est pas valide.';
    }
  
    // Validation de la source de l'alerte
    if (data.source && typeof data.source !== 'string') {
      errors.source = 'La source de l\'alerte doit être une chaîne de caractères.';
    }
  
    // Validation de l'état de l'alerte (si applicable)
    if (data.status && !['ouvert', 'en cours', 'fermé'].includes(data.status)) {
      errors.status = 'L\'état de l\'alerte spécifié n\'est pas valide.';
    }
  
    // Ajoutez ici d'autres validations selon les champs que vous avez dans votre modèle d'alerte
  
    // Si l'objet errors est vide, cela signifie qu'il n'y a pas d'erreur
    return Object.keys(errors).length === 0 ? null : errors;
  }
  // Récupérer une alerte par ID
exports.getAlertById = async (req, res) => {
    try {
      const alertId = req.params.alertId;
  
      // Valider l'ID de l'alerte
      if (!alertId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'ID d\'alerte invalide' });
      }
  
      // Vérifier si l'utilisateur a le droit de récupérer l'alerte
      if (!userHasPermission(req.user, 'viewAlert')) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      // Tenter de trouver l'alerte par son ID
      const alert = await Alert.findById(alertId);
      if (!alert) {
        return res.status(404).json({ message: 'Alerte non trouvée' });
      }
  
      // Appliquer des filtres pour ne retourner que les informations nécessaires
      const filteredAlert = filterAlertData(alert);
  
      res.status(200).json(filteredAlert);
    } catch (error) {
      // Gérer les erreurs
      res.status(500).send('Erreur serveur: ' + error.message);
    }
  };
  // Mettre à jour une alerte
exports.updateAlert = async (req, res) => {
    try {
      const alertId = req.params.alertId;
  
      // Valider l'ID de l'alerte
      if (!alertId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'ID d\'alerte invalide' });
      }
  
      // Vérifier si l'utilisateur a le droit de mettre à jour l'alerte
      if (!userHasPermission(req.user, 'editAlert')) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      // Valider les données de mise à jour avant de les appliquer
      const validationError = validateAlertUpdate(req.body);
      if (validationError) {
        return res.status(400).json({ message: 'Données de mise à jour invalides', errors: validationError });
      }
  
      // Mettre à jour l'alerte dans la base de données et retourner l'alerte mise à jour
      const updatedAlert = await Alert.findByIdAndUpdate(alertId, req.body, { new: true });
      if (!updatedAlert) {
        return res.status(404).json({ message: 'Alerte non trouvée' });
      }
  
      // Appliquer des filtres pour ne retourner que les informations nécessaires
      const filteredUpdatedAlert = filterAlertData(updatedAlert);
  
      res.status(200).json(filteredUpdatedAlert);
    } catch (error) {
      // Gérer les erreurs
      res.status(500).send('Erreur serveur: ' + error.message);
    }
  };
// Supprimer une alerte
exports.deleteAlert = async (req, res) => {
    try {
      const alertId = req.params.alertId;
  
      // Valider l'ID de l'alerte
      if (!alertId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'ID d\'alerte invalide' });
      }
  
      // Vérifier si l'utilisateur a le droit de supprimer l'alerte
      if (!userHasPermission(req.user, 'deleteAlert')) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      // Tenter de trouver et de supprimer l'alerte
      const deletedAlert = await Alert.findByIdAndDelete(alertId);
      if (!deletedAlert) {
        return res.status(404).json({ message: 'Alerte non trouvée' });
      }
  
      // Répondre avec un message de succès
      res.status(200).json({ message: 'Alerte supprimée avec succès' });
    } catch (error) {
      // Gérer les erreurs
      res.status(500).send('Erreur serveur: ' + error.message);
    }
  };  
