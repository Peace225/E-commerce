const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. 🔄 Initialisation de Supabase (qui remplace Firebase Admin)
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Clé secrète (Role Service)

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ ERREUR : Les variables SUPABASE_URL et SUPABASE_SERVICE_KEY manquent dans le fichier .env");
    process.exit(1);
}

// On crée un client Supabase avec les droits administrateur (bypass RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);
console.log("🟢 Supabase Admin initialisé avec succès");

const app = express();

// 2. Middlewares globaux
app.use(cors()); 
app.use(express.json()); 

// 3. Import des Routes
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');

// 🔍 DEBUG SYSTEM 
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

// 📤 On exporte supabase pour pouvoir l'utiliser dans tes controllers !
module.exports = { supabase };