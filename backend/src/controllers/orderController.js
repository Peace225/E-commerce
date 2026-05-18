const { supabase } = require('../config/supabaseClient'); // 🔄 ✅ IMPORTATION CORRIGÉE !
const crypto = require('crypto'); // Pour générer un ID unique natif si besoin

/**
 * 🛒 CRÉER UNE COMMANDE ET DISTRIBUER LES COMMISSIONS
 */
const createOrder = async (req, res) => {
  const { productId, buyerId, referralCode, shippingAddress, paymentMethod } = req.body;

  try {
    // 1. 📦 Vérifier le produit et le stock
    const { data: productData, error: productError } = await supabase
      .from('produits') // ✅ Aligné avec le nom de table français possible ou 'products'
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !productData) return res.status(404).json({ error: "Produit introuvable." });
    if (productData.stock <= 0) return res.status(400).json({ error: "Désolé, ce produit est en rupture de stock." });

    const totalAmount = productData.price;
    const commissionAmount = productData.commission || 0;
    const sellerId = productData.seller_id || productData.sellerId; // Gère les deux syntaxes

    // 2. 📉 Décrémenter le stock du produit
    const { error: stockError } = await supabase
      .from('produits')
      .update({ stock: productData.stock - 1 })
      .eq('id', productId);

    if (stockError) throw stockError;

    // 3. 💰 Mettre à jour la balance et les ventes du vendeur dans 'profiles' ou 'users'
    const { data: sellerData } = await supabase
      .from('profiles') // ✅ Dans Rynek, tes utilisateurs sont dans 'profiles' !
      .select('balance, total_sales')
      .eq('id', sellerId)
      .single();

    if (sellerData) {
      await supabase
        .from('profiles')
        .update({
          balance: (sellerData.balance || 0) + (totalAmount - commissionAmount),
          total_sales: (sellerData.total_sales || 0) + 1
        })
        .eq('id', sellerId);
    }

    // 4. 🤝 Gérer la commission du parrain (Affiliation)
    if (referralCode) {
      const { data: affiliateData } = await supabase
        .from('profiles')
        .select('id, balance, total_referrals')
        .eq('referral_code', referralCode)
        .maybeSingle(); 

      if (affiliateData) {
        await supabase
          .from('profiles')
          .update({
            balance: (affiliateData.balance || 0) + commissionAmount,
            total_referrals: (affiliateData.total_referrals || 0) + 1
          })
          .eq('id', affiliateData.id);
      }
    }

    // 5. 📝 Créer et sauvegarder la commande
    const newOrderId = crypto.randomUUID(); 
    
    // On formate l'objet directement en JS (Pas besoin de l'instancier via un modèle pour l'insérer dans Supabase)
    const orderData = {
      id: newOrderId, 
      user_id: buyerId, // La clé étrangère que nous avons ajoutée ensemble !
      vendeur_id: sellerId, // ✅ Aligné avec ta table 'commandes'
      produit_nom: productData.name || productData.nom, // ✅ Aligné avec ta table 'commandes'
      montant: totalAmount, // ✅ Aligné avec ta table 'commandes'
      client_nom: req.body.clientNom || "Client Rynek", // ✅ Aligné avec ta table 'commandes'
      statut: 'completed' // ✅ Aligné avec ta table 'commandes'
    };

    const { error: orderError } = await supabase
      .from('commandes') // ✅ IMPORTANT : Changé de 'orders' à 'commandes'
      .insert([orderData]);

    if (orderError) throw orderError;

    return res.status(201).json({ message: "Commande validée ! 💸", orderId: newOrderId });
  } catch (error) {
    console.error("🚨 Erreur CreateOrder:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * 📋 RÉCUPÉRER LES COMMANDES D'UN UTILISATEUR
 */
const getUserOrders = async (req, res) => {
  const { uid, role } = req.query; 

  try {
    // On cible la bonne colonne en s'alignant sur ton schéma Postgres réel
    const targetColumn = role === 'seller' ? 'vendeur_id' : 'user_id';

    const { data: orders, error } = await supabase
      .from('commandes') // ✅ Remplacé 'orders' par 'commandes'
      .select('*')
      .eq(targetColumn, uid)
      .order('created_at', { ascending: false }); // ✅ Réparé en 'created_at' snake_case

    if (error) throw error;
    return res.status(200).json(orders);
  } catch (error) {
    console.error("🚨 Erreur GetUserOrders:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * 🔍 DÉTAIL D'UNE COMMANDE
 */
const getOrderDetail = async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('commandes') // ✅ Remplacé 'orders' par 'commandes'
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !order) return res.status(404).json({ error: "Commande non trouvée" });
    
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * 📦 MISE À JOUR DU STATUT
 */
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  
  try {
    const { error } = await supabase
      .from('commandes') // ✅ Remplacé 'orders' par 'commandes'
      .update({ statut: status }) // ✅ Remplacé 'status' par 'statut'
      .eq('id', req.params.id);

    if (error) throw error;
    return res.status(200).json({ message: "Statut mis à jour" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ EXPORT GLOBAL CENTRALISÉ : Résout les soucis d'importation indéfinie !
module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetail,
  updateOrderStatus
};