// userController.js
const User = require("../models/user");
const logger = require("../utils/logger");
const { body, validationResult } = require("express-validator");
const { sendDeletionNotifications } = require("../messaging/mailjet");

// Fonction de suppression d'un utilisateur
exports.deleteUser = async (req, res) => {
  const requestingUserId = req.user._id; // ID de l'utilisateur effectuant la demande
  const userIdToDelete = req.params.userId;

  try {
    // Valider l'ID de l'utilisateur
    if (!userIdToDelete.match(/^[0-9a-fA-F]{24}$/)) {
      logger.warn(
        `Utilisateur ${requestingUserId}: Tentative de suppression avec un ID utilisateur invalide: ${userIdToDelete}`
      );
      return res.status(400).json({ message: "Demande non valide" });
    }

    // Vérifier si l'utilisateur a le droit de supprimer le compte
    // L'utilisateur peut supprimer son propre compte ou, s'il est admin, le compte d'un autre utilisateur
    if (!req.user.isAdmin && requestingUserId !== userIdToDelete) {
      logger.warn(
        `Utilisateur ${requestingUserId}: Tentative de suppression sans autorisation adéquate`
      );
      return res.status(403).json({ message: "Action non autorisée" });
    }

    // Recherche de l'utilisateur à supprimer
    const user = await User.findById(userIdToDelete);
    // Vérification de l'existence de l'utilisateur
    if (!user) {
      logger.warn(
        `Utilisateur ${requestingUserId}: Tentative de suppression d'un utilisateur non trouvé: ${userIdToDelete}`
      );
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Suppression des liens associés à l'utilisateur
    await deleteAssociatedData(userIdToDelete);

    // Suppression de l'utilisateur
    await User.findByIdAndDelete(userIdToDelete);
    logger.info(
      `Utilisateur ${requestingUserId}: Utilisateur supprimé avec succès: ${userIdToDelete}`
    );

    // Envoi des notifications
    await sendDeletionNotifications(userIdToDelete, requestingUserId);

    // Réponse de succès
    res.status(200).json({ message: "Suppression réussie" });
  } catch (error) {
    logger.error(
      `Utilisateur ${requestingUserId}: Erreur lors de la suppression de l'utilisateur: ${userIdToDelete}`,
      error
    );
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Suppression des données associées à l'utilisateur
async function deleteAssociatedData(userId) {
  // Supprimez ici les messages, commentaires, abonnements, etc.
}

// Middleware pour valider les données d'entrée lors de la mise à jour du profil utilisateur
exports.validate = (method) => {
  switch (method) {
    case "updateUserProfile": {
      return [
        body("email", "Email invalide").exists().isEmail(),
        body("name", "Nom invalide").exists().isLength({ min: 2 }),
        // Ajoutez ici d'autres validations selon les champs que vous avez dans votre modèle User
      ];
    }
  }
};

// Récupérer le profil de l'utilisateur connecté
exports.getUserProfile = async (req, res) => {
  try {
    // Récupération de l'ID de l'utilisateur à partir de la session ou du token d'authentification
    const userId = req.user._id;

    // Valider l'ID de l'utilisateur
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      logger.warn(`ID utilisateur invalide : ${userId}`);
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    // Vérification de l'existence de l'utilisateur dans la base de données
    const user = await User.findById(userId).select("-password");
    if (!user) {
      logger.warn(`Profil non trouvé pour l'utilisateur : ${userId}`);
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier les rôles de l'utilisateur
    if (user.roles && !user.roles.includes("user")) {
      logger.warn(`Accès refusé pour l'utilisateur : ${userId}`);
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Vérifier si le compte de l'utilisateur est actif
    if (user.isActive === false) {
      logger.warn(`Compte utilisateur non actif : ${userId}`);
      return res.status(403).json({ message: "Compte utilisateur non actif" });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error(
      `Erreur lors de la récupération du profil pour l'utilisateur : ${userId}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération du profil." });
  }
};

// Fonction de mise à jour du profil utilisateur
exports.updateUserProfile = async (req, res) => {
  try {
    // Validation des données de la requête
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(
        `Erreurs de validation pour l'utilisateur : ${req.user._id}`,
        errors.array()
      );
      return res.status(422).json({ errors: errors.array() });
    }

    const updates = req.body;
    const allowedUpdates = ["nom", "email", "profilePicture", "status"]; // Ajoutez d'autres champs au besoin
    const userId = req.user._id;

    // Valider l'ID de l'utilisateur
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      logger.warn(`ID utilisateur invalide : ${userId}`);
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    // Vérifier si les champs à mettre à jour sont autorisés
    const isValidOperation = Object.keys(updates).every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      logger.warn(`Mise à jour invalide pour l'utilisateur : ${userId}`);
      return res.status(400).json({ message: "Mise à jour invalide" });
    }

    // Trouver l'utilisateur et mettre à jour les champs autorisés
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      logger.warn(`Utilisateur non trouvé pour mise à jour : ${userId}`);
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé pour mise à jour." });
    }

    logger.info(`Profil mis à jour pour l'utilisateur : ${userId}`);
    res.status(200).json({
      message: "Profil utilisateur mis à jour avec succès",
      user: user.toObject({ getters: true, virtuals: false }),
    });
  } catch (error) {
    logger.error(
      `Erreur lors de la mise à jour du profil pour l'utilisateur : ${userId}`,
      error
    );
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Données de mise à jour invalides." });
    }
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du profil." });
  }
};
