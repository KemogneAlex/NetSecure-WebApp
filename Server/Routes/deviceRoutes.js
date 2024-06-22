const express = require("express");
const router = express.Router();
const deviceController = require("../Controllers/deviceController");

// Obtenir la liste de tous les périphériques
router.get("/devices", deviceController.getAllDevices);

// Ajouter un nouveau périphérique
router.post("/devices", deviceController.addDevice);

// Obtenir un périphérique par son ID
router.get("/devices/:id", deviceController.getDeviceById);

// Mettre à jour un périphérique par son ID
router.put("/devices/:id", deviceController.updateDevice);

// Supprimer un périphérique par son ID
router.delete("/devices/:id", deviceController.deleteDevice);

module.exports = router;
