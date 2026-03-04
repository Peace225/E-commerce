import { useState } from "react";
import { Home, Sofa, ArrowRight, Share2, TrendingUp, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CheckoutPopup from "../components/CheckoutPopup";
import { produitsMaison } from "../data/productsData"; // ⚡ Importation propre

export default function MaisonElectromenager({ user }) {
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
      
      {/* 🔹 EN-TÊTE PREMIUM (Thème Émeraude / Maison) */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-gray-900 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg">
             <Home className="text-emerald-400" size={32} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">
              Maison <span className="text-emerald-400">&</span> Électro
            </h2>
            <p className="text-[10px] md:text-xs text-emerald-100/60 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              Équipement Premium • Jusqu'à -80%
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/categories/maison')}
          className="group relative z-10 flex items-center gap-2 bg-white text-[#064e3b] hover:bg-emerald-50 px-6 py-3 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-widest shadow-md"
        >
          <span>Aménager</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 🔹 GRILLE DE PRODUITS */}
      <div className="p-6 md:p-8 bg-gray-50/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {produitsMaison.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedProduct(item)}
              className="group cursor-pointer bg-white rounded-3xl border border-gray-100 hover:border-emerald-500 shadow-sm hover:shadow-[0_20px_40px_rgba(6,78,59,0.1)] transition-all duration-500 flex flex-col h-full overflow-hidden relative"
            >
              <div className="absolute top-3 right-3 z-10 bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded-lg">
                {item.discount}
              </div>

              <div className="relative aspect-square w-full flex items-center justify-center p-6 bg-white">
                <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110" />
              </div>

              <div className="p-4 pt-0 flex flex-col flex-1">
                <h3 className="text-[12px] font-bold text-gray-700 line-clamp-2 mb-2 min-h-[36px]">{item.name}</h3>
                <div className="mt-auto">
                  <span className="text-lg font-black text-gray-900 leading-none block">{item.price}</span>
                  <span className="text-[10px] line-through text-gray-300 font-bold block mb-3">{item.oldPrice}</span>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2 flex items-center justify-between mb-4">
                    <TrendingUp size={12} className="text-emerald-600" />
                    <span className="text-[10px] font-black text-emerald-700">+{item.commission}</span>
                  </div>

                  <button className="w-full bg-gray-900 hover:bg-emerald-700 text-white py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-md">
                    Commander
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <CheckoutPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}