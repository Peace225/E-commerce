const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Initialisation Firebase Admin (Singleton)
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("🔥 Firebase Admin initialisé");
}

const db = admin.firestore();

// 2. Middlewares globaux
app.use(cors()); // Autorise ton Frontend (port 3000) à parler au Backend (port 5000)
app.use(express.json()); // Permet de lire le JSON envoyé dans les requêtes POST

// 3. Import des Routes
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');

// 🔍 DEBUG SYSTEM (Garde-le, c'est ce qui nous a sauvé !)
console.log("--- Statut des Routes ---");
console.log("Products:", typeof productRoutes);
console.log("Orders:", typeof orderRoutes);
console.log("Users:", typeof userRoutes);
console.log("Auth:", typeof authRoutes);
console.log("------------------------");

// 4. Déclaration des endpoints API
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// 5. Route de secours (404)
app.use((req, res) => {
    res.status(404).json({ message: "Route introuvable sur le serveur Rynek" });
});

// 6. Port & Lancement
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur Rynek en ligne sur http://localhost:${PORT}`);
});

// Export pour usage interne si besoin
module.exports = { db, admin };