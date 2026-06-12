/**
 * @description      :
 * @author           : kemogne
 * @group            :
 * @created          : 31/05/2024 - 03:09:15
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 31/05/2024
 * - Author          : kemogne
 * - Modification    :
 **/
const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

// Route de connexion des utilisateurs
router.post("/login", authController.login);

// Route de déconnexion des utilisateurs
router.post("/logout", authController.logout);

// Route d'enregistrement des utilisateurs
router.post("/register", authController.register);

// Route pour la demande de réinitialisation de mot de passe
router.post("/reset-password-request", authController.resetPasswordRequest);

// Route de réinitialisation de mot de passe
router.post("/reset-password", authController.resetPassword);

// Route de configuration de l'authentification à deux facteurs
router.post("/setup-2fa", authController.setup2FA);

// Route de vérification de l'authentification à deux facteurs
router.post("/verify-2fa", authController.verify2FA);
// Route pour l'authentification des utilisateurs (peut être utilisée pour vérifier le token d'authentification)
router.get("/authenticate", authController.authenticateUser);

module.exports = router;
