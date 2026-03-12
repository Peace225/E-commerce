const admin = require('firebase-admin');
const db = admin.firestore();
const OrderModel = require('../models/Order');

/**
 * 🛒 CRÉER UNE COMMANDE ET DISTRIBUER LES COMMISSIONS
 */
exports.createOrder = async (req, res) => {
  const { productId, buyerId, referralCode, shippingAddress, paymentMethod } = req.body;

  try {
    await db.runTransaction(async (transaction) => {
      const productRef = db.collection('products').doc(productId);
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists) throw new Error("Produit introuvable.");
      const productData = productDoc.data();

      if (productData.stock <= 0) throw new Error("Désolé, ce produit est en rupture de stock.");

      const totalAmount = productData.price;
      const commissionAmount = productData.commission || 0;
      const sellerId = productData.sellerId;

      transaction.update(productRef, { 
        stock: admin.firestore.FieldValue.increment(-1) 
      });

      const sellerRef = db.collection('users').doc(sellerId);
      transaction.update(sellerRef, {
        balance: admin.firestore.FieldValue.increment(totalAmount - commissionAmount),
        totalSales: admin.firestore.FieldValue.increment(1)
      });

      if (referralCode) {
        const affiliateQuery = await db.collection('users')
          .where('referralCode', '==', referralCode)
          .limit(1).get();

        if (!affiliateQuery.empty) {
          const affiliateDoc = affiliateQuery.docs[0];
          transaction.update(affiliateDoc.ref, {
            balance: admin.firestore.FieldValue.increment(commissionAmount),
            totalReferrals: admin.firestore.FieldValue.increment(1)
          });
        }
      }

      const newOrderRef = db.collection('orders').doc();
      const orderData = OrderModel({
        orderId: newOrderRef.id,
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

      transaction.set(newOrderRef, orderData);
    });

    res.status(201).json({ message: "Commande validée ! 💸" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * 📋 RÉCUPÉRER LES COMMANDES D'UN UTILISATEUR
 */
exports.getUserOrders = async (req, res) => {
  const { uid, role } = req.query;
  try {
    let query = db.collection('orders');
    if (role === 'seller') {
      query = query.where('sellerId', '==', uid);
    } else {
      query = query.where('buyerId', '==', uid);
    }
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔍 DÉTAIL D'UNE COMMANDE (AJOUTÉ POUR ÉVITER LE CRASH)
 */
exports.getOrderDetail = async (req, res) => {
  try {
    const orderDoc = await db.collection('orders').doc(req.params.id).get();
    if (!orderDoc.exists) return res.status(404).json({ error: "Commande non trouvée" });
    res.status(200).json({ id: orderDoc.id, ...orderDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 📦 MISE À JOUR DU STATUT (AJOUTÉ POUR ÉVITER LE CRASH)
 */
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await db.collection('orders').doc(req.params.id).update({ status });
    res.status(200).json({ message: "Statut mis à jour" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};