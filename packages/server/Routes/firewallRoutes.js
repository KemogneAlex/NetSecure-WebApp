const express = require("express");
const router = express.Router();
const firewallController = require("../Controllers/firewallController");

// Route pour obtenir les règles du pare-feu
router.get("/firewall/rules", firewallController.getFirewallRules);

// Route pour mettre à jour les règles du pare-feu
router.put("/firewall/rules", firewallController.updateFirewallRules);

module.exports = router;
