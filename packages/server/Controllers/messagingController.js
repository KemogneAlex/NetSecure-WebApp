// messagingController.js
const { sendEmail } = require("../messaging/mailjet");
const { sendSMS } = require("../messaging/textmagic");
const logger = require("../utils/logger");

/**
 * Contrôleur pour envoyer des alertes de sécurité par email ou SMS.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.sendAlert = async (req, res) => {
  const { type, recipient, message } = req.body;

  // Validation des données d'entrée
  if (!recipient || !message) {
    logger.warn("Données d'alerte manquantes");
    return res
      .status(400)
      .json({ message: "Destinataire et message sont requis" });
  }

  try {
    switch (type) {
      case "email":
        // Envoi d'une alerte par email
        await sendEmail(
          recipient,
          "Alerte de sécurité",
          message,
          "Équipe de sécurité"
        );
        logger.info(`Alerte email envoyée à ${recipient}`);
        break;
      case "sms":
        // Envoi d'une alerte par SMS
        await sendSMS(recipient, message);
        logger.info(`Alerte SMS envoyée à ${recipient}`);
        break;
      default:
        logger.warn(`Type d'alerte invalide : ${type}`);
        return res.status(400).json({ message: "Type d'alerte invalide" });
    }

    // Réponse de succès
    res.status(200).json({ message: "Alerte envoyée avec succès" });
  } catch (error) {
    // Journalisation et gestion des erreurs
    logger.error("Erreur lors de l'envoi de l'alerte", error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'alerte" });
  }
};
