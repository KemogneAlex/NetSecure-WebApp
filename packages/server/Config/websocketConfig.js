/**
 * @description      :
 * @author           : kemogne
 * @group            :
 * @created          : 14/06/2024 - 19:17:04
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 14/06/2024
 * - Author          : kemogne
 * - Modification    :
 **/
const WebSocket = require("ws");
const http = require("http");

const websocketConfig = (app) => {
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  // Gestion des erreurs pour la création du serveur
  server.on("error", (err) => {
    console.error("Error creating WebSocket server:", err.message);
    // Implémenter la notification ou le système d'alerte ici
    process.exit(1); // Quitter le processus en cas d'erreur critique
  });

  wss.on("connection", (ws) => {
    console.log("Nouveau client connecté");

    // Gestion des erreurs pour le traitement des messages entrants
    ws.on("message", (message) => {
      try {
        console.log(`Message reçu : ${message}`);
        // Ajouter la logique de traitement des messages ici
      } catch (err) {
        console.error("Error processing message:", err.message);
        // Implémenter la gestion des erreurs de traitement des messages ici
      }
    });

    ws.on("close", () => {
      console.log("Client déconnecté");
    });
  });

  // Gestion des erreurs pour l'écoute du serveur
  server.listen(process.env.WS_PORT || 3000, () => {
    console.log(
      `WebSocket server is running on port ${process.env.WS_PORT || 3000}`
    );
  });
};

module.exports = websocketConfig;
