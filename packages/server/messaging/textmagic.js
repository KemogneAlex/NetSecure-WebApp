const TextMagicClient = require("textmagic-rest-client");
const logger = require("../utils/logger");

require("dotenv").config();

// Création d'une instance du client TextMagic avec les identifiants d'authentification
const client = new TextMagicClient(
  process.env.TEXTMAGIC_USERNAME,
  process.env.TEXTMAGIC_API_KEY
);

// Fonction asynchrone pour envoyer un SMS
const sendSMS = async (to, message) => {
  try {
    // Envoi du SMS en utilisant la méthode 'send' du client TextMagic
    const response = await client.Messages.send({ text: message, phones: to });
    logger.info(`SMS envoyé à ${to} : ${response.id}`);
  } catch (error) {
    logger.error("Erreur d'envoi de SMS", { message: error.message });
    // Implémenter la gestion des erreurs supplémentaire ici (par exemple, nouvelle tentative, notifications)
  }
};

module.exports = { sendSMS };
