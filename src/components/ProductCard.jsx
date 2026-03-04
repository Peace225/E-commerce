// src/components/ProductCard.jsx
import React from "react";
import ShareButton from "./ShareButton";
import api from "../services/api";

export default function ProductCard({ product }) {
  const affiliateLink = `${process.env.REACT_APP_STORE_URL}/p/${product.slug}?ref=${product.affiliateToken}`;

  const handleAddToCart = async () => {
    // action locale, puis notification temps réel côté serveur après validation d'achat
    await api.post("/cart/add", { productId: product.id });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-4" />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 mb-3">{product.short}</p>
      <div className="flex items-center justify-between mt-4">
        <button onClick={handleAddToCart} className="bg-orange-500 text-white px-4 py-2 rounded">Ajouter</button>
        <ShareButton url={affiliateLink} product={product} />
      </div>
    </div>
  );
}
