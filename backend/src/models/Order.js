const OrderModel = (data) => {
  return {
    orderId: data.orderId,
    buyerId: data.buyerId,
    sellerId: data.sellerId,
    productId: data.productId,
    productName: data.productName,
    amount: parseFloat(data.amount),
    commissionAmount: parseFloat(data.commissionAmount), // Ce que gagne l'affilié
    referralCode: data.referralCode || null, // Code utilisé pour l'achat
    status: data.status || "pending", // pending, processing, completed, cancelled
    paymentMethod: data.paymentMethod || "Wave/OrangeMoney",
    shippingAddress: data.shippingAddress || {},
    createdAt: new Date()
  };
};

module.exports = OrderModel;