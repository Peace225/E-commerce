const OrderModel = (data) => {
  return {
    id: data.id || data.orderId, // 🔄 On standardise avec 'id' pour Supabase
    buyerId: data.buyerId,
    sellerId: data.sellerId,
    productId: data.productId,
    productName: data.productName,
    amount: parseFloat(data.amount) || 0,
    commissionAmount: parseFloat(data.commissionAmount) || 0, // Ce que gagne l'affilié
    referralCode: data.referralCode || null, // Code utilisé pour l'achat
    status: data.status || "pending", // pending, processing, completed, cancelled
    paymentMethod: data.paymentMethod || "Wave/OrangeMoney",
    
    // 📦 Dans Supabase, assure-toi que la colonne 'shippingAddress' est de type JSON ou JSONB
    shippingAddress: data.shippingAddress || {}, 
    
    // ⏱️ Conversion en format texte ISO pour que PostgreSQL comprenne la date parfaitement
    createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString()
  };
};

module.exports = OrderModel;