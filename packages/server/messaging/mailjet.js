const mailjet = require("node-mailjet").connect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

require("dotenv").config();
const logger = require("..utils/logger");

const sendEmail = async (
  to,
  subject,
  text,
  name,
  customID = "AppNotification"
) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_EMAIL_ADDRESS,
          Name: process.env.MAILJET_SENDER_NAME,
        },
        To: [
          {
            Email: to,
            Name: name,
          },
        ],
        Subject: subject,
        TextPart: text,
        CustomID: customID,
      },
    ],
  });

  try {
    const result = await request;
    logger.info(`Email envoyé à ${to} avec le sujet : ${subject}`, result.body);
  } catch (error) {
    logger.error("Erreur d'envoi d'email", {
      statusCode: error.statusCode,
      message: error.message,
    });
    if (error.statusCode >= 500) {
      // Si l'erreur est liée au serveur, réessayez l'envoi
      try {
        const retryResult = await request;
        console.log(
          `Email envoyé à ${to} après une nouvelle tentative avec le sujet : ${subject}`
        );
        logger.info(
          `Email envoyé à ${to} après une nouvelle tentative avec le sujet : ${subject}`,
          retryResult.body
        );
      } catch (retryError) {
        logger.error("Nouvelle tentative échouée", {
          statusCode: retryError.statusCode,
          message: retryError.message,
        });
        // Notifications ou autres actions peuvent être implémentées ici
      }
    } else {
      // Gestion des erreurs pour d'autres statuts (par exemple, 400, 401)
      logger.error("Erreur permanente, l'email n'a pas pu être envoyé", {
        statusCode: error.statusCode,
        message: error.message,
      });
      // Implémentez d'autres actions ici, comme les notifications
    }
  }
};
// Envoi des notifications de suppression
async function sendDeletionNotifications(deletedUserId, requestingUserId) {
  try {
    // Logique pour récupérer les emails des utilisateurs concernés
    const deletedUser = await getUserById(deletedUserId);
    const requestingUser = await getUserById(requestingUserId);

    if (deletedUser) {
      await sendEmail(
        deletedUser.email,
        "Votre compte a été supprimé",
        "Votre compte utilisateur a été supprimé.",
        deletedUser.name
      );
    }

    if (requestingUser) {
      await sendEmail(
        requestingUser.email,
        "Suppression de compte réussie",
        "Vous avez supprimé un compte utilisateur avec succès.",
        requestingUser.name
      );
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi des notifications de suppression:",
      error
    );
  }
}

// Fonction pour récupérer un utilisateur par son ID
async function getUserById(userId) {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'utilisateur avec l'ID ${userId}:`,
      error
    );
    return null;
  }
}

module.exports = { sendEmail, sendDeletionNotifications };
