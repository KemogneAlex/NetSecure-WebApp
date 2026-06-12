const express = require("express");
const router = express.Router();
const securityAlertController = require("../controllers/securityAlertController");

// Route pour obtenir les alertes de sécurité
router.get("/alerts/security", securityAlertController.getSecurityAlerts);

// Route pour créer une alerte de sécurité
router.post("/alerts/security", securityAlertController.createSecurityAlert);

module.exports = router;
