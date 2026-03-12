// src/components/ShareButton.jsx
import React from "react";
import { Share2 } from "lucide-react";
import api from "../services/api";

export default function ShareButton({ url, product }) {
  const handleShare = async () => {
    try {
      await api.post("/affiliate/share", { productId: product.id, url });
      if (navigator.share) {
        navigator.share({ title: product.name, text: product.short, url });
      } else {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
      }
    } catch (err) {
      console.error("Erreur partage", err);
    }
  };

  return (
    <button onClick={handleShare} className="flex items-center gap-2 text-orange-500">
      <Share2 className="w-5 h-5" /> Partager
    </button>
  );
}
