import { useState } from "react";
import { Link } from "react-router-dom"; // 🚀 NOUVEAU : Import de Link pour le SEO
import { Home, ArrowRight, Share2, TrendingUp } from "lucide-react";
import CheckoutPopup from "../components/CheckoutPopup";
import { produitsMaison } from "../data/productsData"; 

export default function MaisonElectromenager({ user }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShare = (e, product) => {
    e.preventDefault(); // 🚀 Sécurité pour ne pas ouvrir la modale produit en même temps
    e.stopPropagation();
    if (!user) {
      alert("⚠️ Connectez-vous pour partager et gagner votre commission !");
      return;
    }
    // Logique de partage (ex: copie du lien)
    alert(`Lien copié pour : ${product.name}`);
  };

  return (
    // 🚀 RESPONSIVE : Ajustement des marges et arrondis
    <section className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-6 sm:my-12 relative">
      
      {/* 🔹 EN-TÊTE PREMIUM (Thème Émeraude / Maison) */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-gray-900 p-5 sm:p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6 relative overflow-hidden">
        
        <div className="flex items-center gap-3 sm:gap-5 relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shrink-0">
             <Home className="text-emerald-400 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
              Maison <span className="text-emerald-400">&</span> Électro
            </h2>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-emerald-100/60 font-bold uppercase tracking-widest mt-1.5 sm:mt-2 flex items-center gap-2">
              Équipement Premium • Jusqu'à -80%
            </p>
          </div>
        </div>

        {/* 🚀 SEO : Vrai lien et 100% largeur sur mobile */}
        <Link 
          to="/categories/maison"
          className="group relative z-10 flex items-center justify-center w-full md:w-auto gap-2 bg-white text-[#064e3b] hover:bg-emerald-50 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 font-black text-[11px] sm:text-xs uppercase tracking-widest shadow-md"
        >
          <span>Aménager</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* 🔹 GRILLE DE PRODUITS */}
      <div className="p-3 sm:p-6 md:p-8 bg-gray-50/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {produitsMaison.map((item) => (
            // 🚀 SÉMANTIQUE : Balise Article
            <article
              key={item.id}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-emerald-500 shadow-sm hover:shadow-[0_20px_40px_rgba(6,78,59,0.1)] transition-all duration-500 flex flex-col h-full overflow-hidden relative"
            >
              {item.discount && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 bg-emerald-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg pointer-events-none">
                  {item.discount}
                </div>
              )}

              {/* 🚀 ASTUCE SEO HYBRIDE : Lien + Ouverture Modale */}
              <Link 
                to={`/product-maison/${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedProduct(item);
                }}
                className="flex flex-col flex-1 outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label={`Voir les détails de ${item.name}`}
              >
                <div className="relative aspect-square w-full flex items-center justify-center p-3 sm:p-6 bg-white overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-sm" 
                  />
                </div>

                <div className="p-3 pt-0 sm:p-4 sm:pt-0 flex flex-col flex-1 pointer-events-none">
                  <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-700 line-clamp-2 mb-1.5 sm:mb-2 min-h-[32px] sm:min-h-[36px]">{item.name}</h3>
                  <div className="mt-auto">
                    <span className="text-sm sm:text-lg font-black text-gray-900 leading-none block">{item.price}</span>
                    <span className="text-[9px] sm:text-[10px] line-through text-gray-300 font-bold block mb-2 sm:mb-3 mt-0.5 min-h-[14px]">
                      {item.oldPrice || ""}
                    </span>

                    {/* Badge Commission */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg sm:rounded-xl p-1.5 sm:p-2 flex items-center justify-between mb-3 sm:mb-4">
                      <TrendingUp size={12} className="text-emerald-600 sm:w-3.5 sm:h-3.5" />
                      <span className="text-[9px] sm:text-[10px] font-black text-emerald-700">+{item.commission}</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Zone Boutons (Commander & Partager) */}
              <div className="px-3 pb-3 sm:px-4 sm:pb-4 flex gap-2 mt-auto bg-white">
                <button 
                  onClick={() => setSelectedProduct(item)}
                  className="flex-[2] bg-gray-900 hover:bg-emerald-800 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-[11px] uppercase tracking-widest transition-all shadow-md active:scale-95"
                >
                  Commander
                </button>
                <button
                  onClick={(e) => handleShare(e, item)}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-2 sm:py-2.5 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="Partager ce produit"
                >
                  <Share2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <CheckoutPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}