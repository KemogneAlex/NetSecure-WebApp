const express = require("express");
const router = express.Router();
const reportController = require("../Controllers/reportController");

// Route pour obtenir tous les rapports
router.get("/reports", reportController.getAllReports);

// Route pour générer un rapport
router.post("/reports/generate", reportController.generateReport);

// Route pour obtenir un rapport par son ID
router.get("/reports/:id", reportController.getReportById);

// Route pour mettre à jour un rapport
router.put("/reports/:id", reportController.updateReport);

// Route pour supprimer un rapport
router.delete("/reports/:id", reportController.deleteReport);

// Route pour obtenir des rapports (potentiellement avec des filtres)
router.get("/reports/filter", reportController.getReports);

// Route pour exporter un rapport
router.get("/reports/export/:id", reportController.exportReport);

module.exports = router;
