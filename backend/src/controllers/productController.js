// 💡 On importe 'db' et 'admin' depuis ton fichier de configuration principal
// ou directement depuis l'initialisation pour éviter les doublons.
const admin = require('firebase-admin');
const db = admin.firestore();
const ProductModel = require('../models/Product');

/**
 * 🟢 RÉCUPÉRER TOUS LES PRODUITS
 */
exports.getAllProducts = async (req, res) => {
  try {
    const snapshot = await db.collection('products')
      .orderBy('createdAt', 'desc')
      .get();

    // On transforme les données Firestore en un tableau JSON propre
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // 💡 Petit fix : Conversion des Timestamps Firebase en format ISO pour le frontend
      createdAt: doc.data().createdAt?.toDate() || null 
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("Erreur getAllProducts:", error.message);
    res.status(500).json({ error: "Impossible de récupérer les produits." });
  }
};

/**
 * 🔵 RÉCUPÉRER UN PRODUIT SPÉCIFIQUE
 */
exports.getOneProduct = async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🟡 CRÉER UN PRODUIT
 */
exports.createProduct = async (req, res) => {
  try {
    // 1. Validation/Nettoyage via le modèle
    // On s'assure que les types sont corrects (nombres, dates)
    const rawData = {
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const validatedData = ProductModel(rawData);

    // 2. Sécurité : Empêcher les prix invalides
    if (validatedData.price <= 0) {
      return res.status(400).json({ error: "Le prix doit être un nombre positif." });
    }

    // 3. Ajout à Firestore
    const docRef = await db.collection('products').add(validatedData);

    res.status(201).json({ 
      id: docRef.id, 
      message: "Produit ajouté avec succès !",
      product: validatedData 
    });
  } catch (error) {
    console.error("Erreur création produit:", error);
    res.status(500).json({ error: "Erreur serveur lors de la création." });
  }
};

/**
 * 🟠 METTRE À JOUR UN PRODUIT
 */
exports.updateProduct = async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Produit introuvable." });
    }

    // On prépare les données de mise à jour
    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // 💡 Optionnel : Tu pourrais ici repasser updateData dans le ProductModel 
    // pour valider que les modifications ne cassent pas la structure.

    await productRef.update(updateData);
    res.status(200).json({ message: "Produit mis à jour avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔴 SUPPRIMER UN PRODUIT
 */
exports.deleteProduct = async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Produit introuvable." });
    }

    await productRef.delete();
    res.status(200).json({ message: "Produit supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};