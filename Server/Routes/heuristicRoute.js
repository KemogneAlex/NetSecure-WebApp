const express = require("express");
const router = express.Router();
const heuristicController = require("../Controllers/heuristicController");

// Route pour appliquer les règles heuristiques
router.post("/heuristics/apply", heuristicController.applyHeuristicRules);

module.exports = router;
