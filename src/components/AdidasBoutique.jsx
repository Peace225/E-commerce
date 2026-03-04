import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, BadgeCheck, ArrowRight, TrendingUp } from "lucide-react";
import CheckoutPopup from "../components/CheckoutPopup"; // 🔥 import du Popup

// 🔹 Ajout d'ID pour chaque produit
export const produitsAdidas = [
  {
    id: 1,
    name: "Adidas Claquette Eezay",
    price: "119.00 Euro",
    oldPrice: "300.00 Euro",
    commission: "1000 FCFA",
    discount: "-60%",
    img: "/images/adidas/claquette.jpg",
  },
  {
    id: 2,
    name: "Adidas Chaussure Litecourt",
    price: "495.00 Euro",
    oldPrice: "810.00 Euro",
    commission: "1000 FCFA",
    discount: "-39%",
    img: "/images/adidas/Litecourt.jpg",
  },
  {
    id: 3,
    name: "Adidas Chaussure Lite Rose",
    price: "385.00 Euro",
    oldPrice: "630.00 Euro",
    commission: "1000 FCFA",
    discount: "-39%",
    img: "/images/adidas/lite-rose.jpg",
  },
  {
    id: 4,
    name: "Adidas Chaussure Tensas",
    price: "329.00 Euro",
    oldPrice: "540.00 Euro",
    commission: "1000 FCFA",
    discount: "-39%",
    img: "/images/adidas/tensas.jpg",
  },
  {
    id: 5,
    name: "Adidas Chaussure Response",
    price: "635.00 Euro",
    oldPrice: "1,040.00 Euro",
    commission: "1000 FCFA",
    discount: "-39%",
    img: "/images/adidas/response.jpg",
  },
  {
    id: 6,
    name: "Adidas Chaussure Zero",
    price: "459.00 Euro",
    oldPrice: "860.00 Euro",
    commission: "1000 FCFA",
    discount: "-47%",
    img: "/images/adidas/zero.jpg",
  },
];

export default function AdidasBoutique({ user }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const handleShare = (e, product) => {
    e.stopPropagation(); // Empêche le clic de déclencher la navigation vers le produit
    if (!user) {
      alert("⚠️ Connectez-vous pour partager et gagner votre commission !");
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-12 relative">
      
      {/* 🔹 EN-TÊTE MARQUE PREMIUM (Thème Adidas) */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        
        {/* Motifs de fond (les 3 bandes Adidas stylisées en arrière-plan) */}
        <div className="absolute top-0 right-0 h-full w-1/2 opacity-10 flex gap-4 -skew-x-12 translate-x-20">
          <div className="w-12 h-full bg-white"></div>
          <div className="w-12 h-full bg-white"></div>
          <div className="w-12 h-full bg-white"></div>
        </div>

        <div className="flex items-center gap-5 relative z-10">
          {/* Faux Logo Adidas (Remplacer par une vraie image de logo si besoin) */}
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
             <img src="/images/boutiques/adidas.jpg" alt="Adidas Logo" className="w-full h-full object-contain mix-blend-multiply" onError={(e) => e.target.style.display = 'none'} />
             <span className="font-black text-2xl tracking-tighter text-gray-900 absolute">adi</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">
                Adidas
              </h2>
              <BadgeCheck className="text-blue-400 bg-white rounded-full" size={18} />
            </div>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              Boutique Officielle • Nouvelle Collection
            </p>
          </div>
        </div>

        {/* Bouton Voir la boutique */}
        <button 
          onClick={() => navigate('/boutique/Adidas')}
          className="group relative z-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl transition-all duration-300 border border-white/10"
        >
          <span className="text-xs font-black text-white uppercase tracking-wider">
            Voir la boutique
          </span>
          <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 🔹 GRILLE DE PRODUITS ADIDAS */}
      <div className="p-6 md:p-8 bg-gray-50/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {produitsAdidas.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product-adidas/${item.id}`)}
              className="group cursor-pointer bg-white rounded-2xl border border-gray-100 hover:border-gray-900 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full overflow-hidden relative"
            >
              {/* Badge réduction */}
              {item.discount && (
                <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                  {item.discount}
                </div>
              )}

              {/* Image Produit */}
              <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-md" 
                />
                {/* Overlay discret au survol */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Infos Produit */}
              <div className="p-4 flex flex-col flex-1 bg-white">
                <h3 className="text-[12px] font-bold text-gray-800 line-clamp-2 group-hover:text-black transition-colors mb-2 min-h-[36px]">
                  {item.name}
                </h3>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-black text-gray-900 tracking-tight">{item.price}</span>
                  </div>
                  {item.oldPrice && (
                    <span className="text-[10px] line-through text-gray-400 font-bold block mb-2">{item.oldPrice}</span>
                  )}

                  {/* Badge Commission */}
                  <div className="bg-green-50 border border-green-100 rounded-xl p-2 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={12} className="text-green-600" strokeWidth={3} />
                      <span className="text-[9px] font-black text-green-800 uppercase tracking-wider">Com.</span>
                    </div>
                    <span className="text-[11px] font-black text-green-600">{item.commission}</span>
                  </div>

                  {/* Bouton Partager */}
                  <button
                    onClick={(e) => handleShare(e, item)}
                    className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all group/btn relative overflow-hidden"
                  >
                    <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                    <Share2 size={14} className="relative z-10" />
                    <span className="relative z-10">Partager</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Checkout */}
      {selectedProduct && (
        <CheckoutPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}