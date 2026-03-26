const ProductModel = (data) => {
  // 🛡️ Sécurité : On s'assure que le produit appartient forcément à quelqu'un
  if (!data.sellerId) {
    console.error("⚠️ Attention : Tentative de création d'un produit sans sellerId");
  }

  return {
    name: data.name?.trim() || "Produit sans nom",
    description: data.description || "",
    price: parseFloat(data.price) || 0,
    oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : null,
    stock: Math.max(0, parseInt(data.stock) || 0), // 👈 Empêche les stocks négatifs
    category: data.category || "Autres",
    img: data.img || "",
    sellerId: data.sellerId || "unknown", 
    shopName: data.shopName || "Boutique Rynek",
    commission: parseFloat(data.commission) || 0,
    status: data.status || "active",
    
    // 🕒 Conversion automatique en format texte (ISO) pour que PostgreSQL le lise sans planter
    createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

module.exports = ProductModel;