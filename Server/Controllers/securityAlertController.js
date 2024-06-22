// Logique pour la gestion des alertes de sécurité

const SecurityAlertService = require("../services/SecurityAlertService");
const logger = require("../utils/logger");

// Récupérer les alertes de sécurité
exports.getSecurityAlerts = async (req, res) => {
  try {
    if (!req.user) {
      logger.warn(
        "Tentative de récupération des alertes sans authentification."
      );
      return res.status(401).json({ message: "Authentification requise." });
    }

    // Récupérez les alertes de sécurité à partir du service dédié
    const alerts = await SecurityAlertService.fetchAlerts(req.user.id);

    res.status(200).json({ alerts });
  } catch (error) {
    logger.error("Erreur lors de la récupération des alertes de sécurité", {
      error: error.message,
    });
    res.status(500).json({
      message:
        "Un problème est survenu lors de la récupération des alertes de sécurité.",
    });
  }
};

// Créer une nouvelle alerte de sécurité
exports.createSecurityAlert = async (req, res) => {
  try {
    if (!req.body || !req.body.alertDetails) {
      logger.warn(
        "Tentative de création d’alerte avec des données insuffisantes."
      );
      return res.status(400).json({ message: "Données d’alerte requises." });
    }

    // Créez une nouvelle alerte de sécurité en utilisant le service dédié
    const alert = await SecurityAlertService.createAlert(req.body.alertDetails);

    logger.info("Nouvelle alerte de sécurité créée.");

    res.status(201).json({ message: "Alerte de sécurité créée", alert });
  } catch (error) {
    logger.error("Erreur lors de la création de l’alerte de sécurité", {
      error: error.message,
    });
    res.status(500).json({
      message:
        "Un problème est survenu lors de la création de l’alerte de sécurité.",
    });
  }
};
