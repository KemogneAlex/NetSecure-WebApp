const express = require("express");
const router = express.Router();
const messagingController = require("../Controllers/messagingController");

// Route pour envoyer une alerte
router.post("/alerts/send", messagingController.sendAlert);

module.exports = router;
