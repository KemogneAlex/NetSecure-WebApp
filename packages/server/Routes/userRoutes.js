const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");

// Route de récupération du profil utilisateur
router.get("/profile", userController.getUserProfile);

// Route de mise à jour du profil utilisateur
router.put("/profile", userController.updateUserProfile);

// Route de suppression d'un utilisateur
router.delete("/user/:userId", userController.deleteUser);

module.exports = router;
