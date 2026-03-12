const UserModel = (data) => {
  return {
    uid: data.uid,
    email: data.email,
    displayName: data.displayName || "",
    role: data.role || "client", // client, vendeur, admin
    balance: parseFloat(data.balance) || 0, // Solde actuel du portefeuille
    referralCode: data.referralCode || "", // Son propre code pour parrainer
    totalEarnings: parseFloat(data.totalEarnings) || 0, // Gains cumulés historiques
    whatsapp: data.whatsapp || "",
    isVerified: data.isVerified || false,
    createdAt: data.createdAt || new Date()
  };
};

module.exports = UserModel;