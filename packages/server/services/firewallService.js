require("dotenv").config();
const logger = require("../utils/logger");

class FirewallService {
  // Récupère les règles du pare-feu de la base de données
  static async getFirewallRules() {
    try {
      await client.connect();
      const database = client.db("networkSecurityDB");
      const collection = database.collection("firewallRules");
      const rules = await collection.findOne({});
      logger.info("Règles du pare-feu récupérées avec succès.");
      return rules;
    } catch (error) {
      logger.error(
        `Erreur lors de la récupération des règles du pare-feu : ${error}`
      );
      throw new Error("Impossible de récupérer les règles du pare-feu.");
    } finally {
      await client.close();
    }
  }

  // Met à jour les règles du pare-feu dans la base de données
  static async updateFirewallRules(newRules) {
    try {
      await client.connect();
      const database = client.db("networkSecurityDB");
      const collection = database.collection("firewallRules");
      await collection.updateOne({}, { $set: newRules });
      logger.info("Règles du pare-feu mises à jour avec succès.");
    } catch (error) {
      logger.error(
        `Erreur lors de la mise à jour des règles du pare-feu : ${error}`
      );
      throw new Error("Impossible de mettre à jour les règles du pare-feu.");
    } finally {
      await client.close();
    }
  }
}

module.exports = FirewallService;
