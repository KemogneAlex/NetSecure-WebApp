const express = require("express");
const router = express.Router();
const dashboardController = require("../Controllers/dashboardController");

// Route pour obtenir les données du tableau de bord
router.get("/dashboard/data", dashboardController.getDashboardData);

module.exports = router;
