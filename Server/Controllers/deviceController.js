const Device = require("../models/device");
const logger = require("../utils/logger");
const {
  validateDeviceData,
  validateDeviceUpdate,
  userHasPermission,
  filterDeviceData,
} = require("../utils/validation");

// Fonction pour récupérer tous les appareils
exports.getAllDevices = async (req, res) => {
  // Vérifie si l'utilisateur a la permission de voir tous les appareils
  if (!userHasPermission(req.user, "viewAllDevices")) {
    logger.warn("Tentative d'accès non autorisée à getAllDevices");
    return res.status(403).json({ message: "Accès refusé" });
  }

  try {
    // Récupère tous les appareils depuis la base de données
    const devices = await Device.find();
    logger.info("Appareils récupérés avec succès");
    // Filtre les données des appareils avant de les envoyer en réponse
    res.status(200).json(devices.map((device) => filterDeviceData(device)));
  } catch (error) {
    logger.error(
      "Erreur lors de la récupération des appareils: " + error.message
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour ajouter un nouvel appareil
exports.addDevice = async (req, res) => {
  // Vérifie si l'utilisateur a la permission d'ajouter un appareil
  if (!userHasPermission(req.user, "addDevice")) {
    logger.warn("Tentative d'accès non autorisée à addDevice");
    return res.status(403).json({ message: "Accès refusé" });
  }

  // Valide les données de l'appareil
  const validationError = validateDeviceData(req.body);
  if (validationError) {
    logger.warn(
      "Données d'appareil invalides lors de l'ajout: " +
        JSON.stringify(validationError)
    );
    return res.status(400).json({
      message: "Données d'appareil invalides",
      errors: validationError,
    });
  }

  try {
    // Crée et enregistre un nouvel appareil dans la base de données
    const newDevice = new Device(req.body);
    const savedDevice = await newDevice.save();
    logger.info(`Appareil ajouté avec l'ID: ${savedDevice._id}`);
    // Filtre les données de l'appareil avant de les envoyer en réponse
    res.status(201).json(filterDeviceData(savedDevice));
  } catch (error) {
    logger.error("Erreur lors de l'ajout d'un appareil: " + error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour récupérer un appareil par ID
exports.getDeviceById = async (req, res) => {
  // Vérifie si l'utilisateur a la permission de voir un appareil spécifique
  if (!userHasPermission(req.user, "viewDevice")) {
    logger.warn("Tentative d'accès non autorisée à getDeviceById");
    return res.status(403).json({ message: "Accès refusé" });
  }

  const deviceId = req.params.deviceId;
  // Vérifie si l'ID fourni est valide
  if (!deviceId.match(/^[0-9a-fA-F]{24}$/)) {
    logger.warn("ID d'appareil invalide: " + deviceId);
    return res.status(400).json({ message: "ID d'appareil invalide" });
  }

  try {
    // Récupère un appareil par ID depuis la base de données
    const device = await Device.findById(deviceId);
    if (!device) {
      logger.warn(`Appareil non trouvé avec l'ID: ${deviceId}`);
      return res.status(404).json({ message: "Appareil non trouvé" });
    }
    logger.info(`Appareil récupéré avec l'ID: ${deviceId}`);
    // Filtre les données de l'appareil avant de les envoyer en réponse
    res.status(200).json(filterDeviceData(device));
  } catch (error) {
    logger.error(
      "Erreur lors de la récupération d'un appareil: " + error.message
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour mettre à jour un appareil
exports.updateDevice = async (req, res) => {
  // Vérifie si l'utilisateur a la permission de modifier un appareil
  if (!userHasPermission(req.user, "editDevice")) {
    logger.warn("Tentative d'accès non autorisée à updateDevice");
    return res.status(403).json({ message: "Accès refusé" });
  }

  const deviceId = req.params.deviceId;
  // Vérifie si l'ID fourni est valide
  if (!deviceId.match(/^[0-9a-fA-F]{24}$/)) {
    logger.warn("ID d'appareil invalide lors de la mise à jour: " + deviceId);
    return res.status(400).json({ message: "ID d'appareil invalide" });
  }

  // Valide les données de mise à jour de l'appareil
  const validationError = validateDeviceUpdate(req.body);
  if (validationError) {
    logger.warn(
      "Données de mise à jour invalides: " + JSON.stringify(validationError)
    );
    return res.status(400).json({
      message: "Données de mise à jour invalides",
      errors: validationError,
    });
  }

  try {
    // Met à jour un appareil dans la base de données et retourne le nouvel état
    const updatedDevice = await Device.findByIdAndUpdate(deviceId, req.body, {
      new: true,
    });
    if (!updatedDevice) {
      logger.warn(
        `Appareil non trouvé lors de la mise à jour avec l'ID: ${deviceId}`
      );
      return res.status(404).json({ message: "Appareil non trouvé" });
    }
    logger.info(`Appareil mis à jour avec l'ID: ${updatedDevice._id}`);
    // Filtre les données de l'appareil avant de les envoyer en réponse
    res.status(200).json(filterDeviceData(updatedDevice));
  } catch (error) {
    logger.error(
      "Erreur lors de la mise à jour d'un appareil: " + error.message
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour supprimer un appareil
exports.deleteDevice = async (req, res) => {
  // Vérifie si l'utilisateur a la permission de supprimer un appareil
  if (!userHasPermission(req.user, "deleteDevice")) {
    logger.warn("Tentative d'accès non autorisée à deleteDevice");
    return res.status(403).json({ message: "Accès refusé" });
  }

  const deviceId = req.params.deviceId;
  // Vérifie si l'ID fourni est valide
  if (!deviceId.match(/^[0-9a-fA-F]{24}$/)) {
    logger.warn("ID d'appareil invalide lors de la suppression: " + deviceId);
    return res.status(400).json({ message: "ID d'appareil invalide" });
  }

  try {
    // Supprime un appareil par ID depuis la base de données
    const deletedDevice = await Device.findByIdAndDelete(deviceId);
    if (!deletedDevice) {
      logger.warn(
        `Appareil non trouvé lors de la suppression avec l'ID: ${deviceId}`
      );
      return res.status(404).json({ message: "Appareil non trouvé" });
    }
    logger.info(
      `Appareil supprimé avec succès avec l'ID: ${deletedDevice._id}`
    );
    res.status(200).json({ message: "Appareil supprimé avec succès" });
  } catch (error) {
    logger.error(
      "Erreur lors de la suppression d'un appareil: " + error.message
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};
