const { supabase } = require('../config/supabaseClient');
const ProductModel = require('../models/Product');

/**
 * 🟢 RÉCUPÉRER TOUS LES PRODUITS
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
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
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !product) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🟡 CRÉER UN PRODUIT
 */
exports.createProduct = async (req, res) => {
  try {
    // 🛡️ Sécurité : On force le sellerId avec l'ID de l'utilisateur connecté (via protect)
    const productData = {
      ...req.body,
      sellerId: req.user.id 
    };

    const validatedData = ProductModel(productData);

    if (validatedData.price <= 0) {
      return res.status(400).json({ error: "Le prix doit être positif." });
    }

    const { data: newProduct, error } = await supabase
      .from('products')
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      message: "Produit ajouté !",
      product: newProduct 
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
    const productId = req.params.id;
    const userId = req.user.id; // L'utilisateur qui fait la demande

    // 1. On vérifie d'abord si le produit appartient bien à cet utilisateur
    const { data: product } = await supabase
      .from('products')
      .select('sellerId')
      .eq('id', productId)
      .single();

    if (!product || product.sellerId !== userId) {
      return res.status(403).json({ error: "Action interdite : ce n'est pas votre produit." });
    }

    // 2. Mise à jour (on exclut l'ID et le sellerId pour plus de sécurité)
    const { id, sellerId, ...allowedUpdates } = req.body;

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(allowedUpdates)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: "Produit mis à jour.", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔴 SUPPRIMER UN PRODUIT
 */
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    // 1. Vérification de propriété
    const { data: product } = await supabase
      .from('products')
      .select('sellerId')
      .eq('id', productId)
      .single();

    if (!product) return res.status(404).json({ error: "Produit introuvable." });
    if (product.sellerId !== userId) {
      return res.status(403).json({ error: "Interdit : vous n'êtes pas le propriétaire." });
    }

    // 2. Suppression
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (deleteError) throw deleteError;

    res.status(200).json({ message: "Produit supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};