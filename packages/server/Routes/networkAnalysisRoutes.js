const express = require("express");
const router = express.Router();
const networkAnalysisController = require("../Controllers/networkAnalysisController");

// Route pour exécuter une analyse de réseau
router.post(
  "/network/analysis/run",
  networkAnalysisController.runNetworkAnalysis
);

module.exports = router;
