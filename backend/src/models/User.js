const UserModel = (data) => {
  return {
    id: data.id || data.uid, // 🔄 On passe à 'id' pour Supabase (on garde uid en secours au cas où)
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