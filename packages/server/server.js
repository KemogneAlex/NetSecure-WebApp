/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 28/05/2024 - 21:56:07
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 28/05/2024
    * - Author          : kemogne
    * - Modification    : 
**/
// server.js
require('dotenv').config({ path: __dirname + '/Config/.env' });
const express = require('express');
const userRoutes = require(__dirname + '/Routes/userRoute')
const connectDB = require(__dirname + '/Config/db');

const app = express();

// Connexion à la base de données
connectDB();

// Middleware pour parser le JSON
app.use(express.json());

// Routes (à définir dans le dossier routes/)
app.use('/api/user', userRoutes);












const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
