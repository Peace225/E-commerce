const { supabase } = require('../../index'); // 🔄 Client Supabase
const OrderModel = require('../models/Order');
const crypto = require('crypto'); // Pour générer un ID unique manuellement si besoin

/**
 * 🛒 CRÉER UNE COMMANDE ET DISTRIBUER LES COMMISSIONS
 */
exports.createOrder = async (req, res) => {
  const { productId, buyerId, referralCode, shippingAddress, paymentMethod } = req.body;

  try {
    // 1. 📦 Vérifier le produit et le stock
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !productData) throw new Error("Produit introuvable.");
    if (productData.stock <= 0) throw new Error("Désolé, ce produit est en rupture de stock.");

    const totalAmount = productData.price;
    const commissionAmount = productData.commission || 0;
    const sellerId = productData.sellerId;

    // 2. 📉 Décrémenter le stock du produit
    const { error: stockError } = await supabase
      .from('products')
      .update({ stock: productData.stock - 1 })
      .eq('id', productId);

    if (stockError) throw stockError;

    // 3. 💰 Mettre à jour la balance et les ventes du vendeur
    const { data: sellerData } = await supabase
      .from('users')
      .select('balance, totalSales')
      .eq('id', sellerId)
      .single();

    if (sellerData) {
      await supabase
        .from('users')
        .update({
          balance: (sellerData.balance || 0) + (totalAmount - commissionAmount),
          totalSales: (sellerData.totalSales || 0) + 1
        })
        .eq('id', sellerId);
    }

    // 4. 🤝 Gérer la commission du parrain (Affiliation)
    if (referralCode) {
      const { data: affiliateData } = await supabase
        .from('users')
        .select('id, balance, totalReferrals')
        .eq('referralCode', referralCode)
        .maybeSingle(); // maybeSingle évite une erreur si le code n'existe pas

      if (affiliateData) {
        await supabase
          .from('users')
          .update({
            balance: (affiliateData.balance || 0) + commissionAmount,
            totalReferrals: (affiliateData.totalReferrals || 0) + 1
          })
          .eq('id', affiliateData.id);
      }
    }

    // 5. 📝 Créer et sauvegarder la commande
    const newOrderId = crypto.randomUUID(); // Génère un ID unique natif à Node.js
    const orderData = OrderModel({
      orderId: newOrderId, // Ou 'id' selon comment ton OrderModel est fait
      buyerId,
      sellerId,
      productId,
      productName: productData.name,
      amount: totalAmount,
      commissionAmount: referralCode ? commissionAmount : 0,
      referralCode: referralCode || null,
      status: 'completed',
      shippingAddress,
      paymentMethod
    });

    const { error: orderError } = await supabase
      .from('orders')
      .insert([orderData]);

    if (orderError) throw orderError;

    res.status(201).json({ message: "Commande validée ! 💸" });
  } catch (error) {
    console.error("Erreur CreateOrder:", error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * 📋 RÉCUPÉRER LES COMMANDES D'UN UTILISATEUR
 */
exports.getUserOrders = async (req, res) => {
  const { uid, role } = req.query; 

  try {
    // On cible la bonne colonne selon le rôle
    const targetColumn = role === 'seller' ? 'sellerId' : 'buyerId';

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq(targetColumn, uid)
      .order('createdAt', { ascending: false }); // ascending: false = 'desc'

    if (error) throw error;
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔍 DÉTAIL D'UNE COMMANDE
 */
exports.getOrderDetail = async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !order) return res.status(404).json({ error: "Commande non trouvée" });
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 📦 MISE À JOUR DU STATUT
 */
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(200).json({ message: "Statut mis à jour" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};