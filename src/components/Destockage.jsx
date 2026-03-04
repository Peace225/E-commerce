import { useState } from "react";
import { Package, Trash2, ArrowRight, Share2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CheckoutPopup from "../components/CheckoutPopup";
import { produitsDestockage } from "../data/productsData"; // ⚡ Import propre des données

export default function Destockage({ user }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const handleShare = (e, product) => {
    e.stopPropagation();
    if (!user) {
      alert("⚠️ Connectez-vous pour partager et gagner votre commission !");
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-12 relative">
      
      {/* 🔹 EN-TÊTE LIQUIDATION (Thème Jaune/Noir Impact) */}
      <div className="bg-[#FFD700] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        
        {/* Motifs "Danger/Travaux" en arrière-plan */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex rotate-12 scale-150">
           {[...Array(10)].map((_, i) => (
             <div key={i} className="w-20 h-full border-r-[40px] border-black border-dashed"></div>
           ))}
        </div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl rotate-3">
             <Trash2 className="text-[#FFD700]" size={32} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">
              DÉSTOC<span className="text-red-600">KAGE</span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-black text-[#FFD700] text-[9px] font-black px-2 py-0.5 rounded uppercase">Dernières unités</div>
              <p className="text-[10px] md:text-xs text-black font-bold uppercase tracking-widest">
                Prix sacrifiés • Tout doit disparaître
              </p>
            </div>
          </div>
        </div>

        {/* ⚡ Bouton fonctionnel vers la page dédiée */}
        <button 
          onClick={() => navigate('/destockage')} 
          className="group relative z-10 flex items-center gap-2 bg-black hover:bg-gray-800 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
        >
          <span className="text-xs font-black text-[#FFD700] uppercase tracking-wider">
            Voir les arrivages
          </span>
          <ArrowRight size={16} className="text-[#FFD700] group-hover:translate-x-1 transition-transform" />
        </button>
      </div> {/* ✅ Fermeture de la div d'en-tête corrigée ici */}

      {/* 🔹 GRILLE DE PRODUITS */}
      <div className="p-6 md:p-8 bg-gray-50/30">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {produitsDestockage.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="group cursor-pointer bg-white rounded-3xl border border-gray-100 hover:border-yellow-500 shadow-sm hover:shadow-[0_20px_40px_rgba(255,215,0,0.15)] transition-all duration-500 flex flex-col h-full overflow-hidden relative"
            >
              <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg animate-bounce uppercase">
                Liquidation
              </div>

              <div className="relative aspect-square w-full bg-white flex items-center justify-center p-6 overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-md" 
                />
              </div>

              <div className="p-4 pt-0 flex flex-col flex-1">
                <div className="inline-block bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-md w-fit mb-2">
                  {item.discount}
                </div>

                <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 mb-2 min-h-[38px]">
                  {item.name}
                </h3>
                
                <div className="mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-gray-900 tracking-tight">{item.price}</span>
                  </div>
                  <span className="text-[10px] line-through text-gray-400 font-bold block mb-3">{item.oldPrice}</span>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-2 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={12} className="text-yellow-700" strokeWidth={3} />
                      <span className="text-[9px] font-black text-yellow-800 uppercase tracking-tighter">Gain</span>
                    </div>
                    <span className="text-[11px] font-black text-yellow-700">{item.commission}</span>
                  </div>

                  <button
                    onClick={(e) => handleShare(e, item)}
                    className="w-full bg-black hover:bg-gray-800 text-white py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all group/btn relative overflow-hidden"
                  >
                    <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-30deg] -translate-x-full group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                    <Share2 size={14} className="relative z-10 text-yellow-400" />
                    <span className="relative z-10">Vendre</span>
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