import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Trash2, ArrowRight, Share2, TrendingUp } from "lucide-react";
import { supabase } from "../utils/supabaseClient"; 
import CheckoutPopup from "./CheckoutPopup"; 

export default function Destockage({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchDestockageProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('produits')
          .select('*')
          .eq('type', 'destockage')
          .limit(6);

        if (error) throw error;
        setProducts(data);
      } catch (err) {
        console.error("Erreur Section Déstockage:", err.message);
      }
      setLoading(false);
    };

    fetchDestockageProducts();
  }, []);

  const handleShare = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("⚠️ Connectez-vous pour partager et gagner votre commission !");
      return;
    }
    setSelectedProduct(product);
  };

  // 🛠️ FONCTION DE SÉCURITÉ POUR LE CHEMIN DE L'IMAGE
  const getImageUrl = (imgString) => {
    if (!imgString) return "https://placehold.co/400x400/eeeeee/999999?text=Image+Introuvable";
    // Si le chemin commence par un slash, on l'enlève pour éviter les bugs locaux
    return imgString.startsWith('/') ? imgString.substring(1) : imgString;
  };

  if (loading) return <div className="p-10 text-center font-bold text-yellow-600 animate-pulse">Chargement de la zone de liquidation...</div>;

  return (
    <section className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-6 sm:my-12 relative">
      
      <div className="bg-[#FFD700] p-5 sm:p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6 relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-10 pointer-events-none flex rotate-12 scale-150">
           {[...Array(10)].map((_, i) => (
             <div key={i} className="w-12 sm:w-20 h-full border-r-[20px] sm:border-r-[40px] border-black border-dashed"></div>
           ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-5 relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl rotate-3 shrink-0">
             <Trash2 className="text-[#FFD700] w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">
              DÉSTOC<span className="text-red-600">KAGE</span>
            </h2>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mt-1.5 sm:mt-2">
              <div className="bg-black text-[#FFD700] text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 rounded uppercase">Dernières unités</div>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-black font-bold uppercase tracking-widest whitespace-nowrap">
                Prix sacrifiés • Tout doit disparaître
              </p>
            </div>
          </div>
        </div>

        <Link 
          to="/destockage" 
          className="group relative z-10 flex items-center justify-center w-full md:w-auto gap-2 bg-black hover:bg-gray-800 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 shadow-lg"
        >
          <span className="text-[11px] sm:text-xs font-black text-[#FFD700] uppercase tracking-wider">
            Voir les arrivages
          </span>
          <ArrowRight size={16} className="text-[#FFD700] group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
        </Link>
      </div>

      <div className="p-3 sm:p-6 md:p-8 bg-gray-50/30">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {products.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-yellow-500 shadow-sm hover:shadow-[0_20px_40px_rgba(255,215,0,0.15)] transition-all duration-500 flex flex-col h-full overflow-hidden relative"
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 bg-red-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg shadow-lg animate-bounce uppercase pointer-events-none">
                Liquidation
              </div>

              <Link to={`/product/${item.id}`} className="flex flex-col flex-1">
                <div className="relative aspect-square w-full bg-white flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                  {/* 🚀 UTILISATION DE LA FONCTION SÉCURISÉE ICI */}
                  <img 
                    src={getImageUrl(item.img)} 
                    alt={`Acheter ${item.nom}`} 
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-md" 
                    onError={(e) => { e.target.src = "https://placehold.co/400x400/eeeeee/999999?text=Image+Destockage" }} 
                  />
                </div>

                <div className="p-3 pt-0 sm:p-4 sm:pt-0 flex flex-col flex-1">
                  {item.discount && (
                    <div className="inline-block bg-red-100 text-red-700 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded w-fit mb-1.5 sm:mb-2 mt-2">
                      {item.discount}
                    </div>
                  )}

                  <h3 className="text-[11px] sm:text-[13px] font-bold text-gray-800 line-clamp-2 mb-1.5 sm:mb-2 min-h-[32px] sm:min-h-[38px] group-hover:text-yellow-600 transition-colors mt-1">
                    {item.nom}
                  </h3>
                  
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-lg font-black text-gray-900 tracking-tight leading-none">
                        {item.prix?.toLocaleString('fr-FR')} <span className="text-[10px]">FCFA</span>
                      </span>
                    </div>
                    {item.old_price && (
                      <span className="text-[9px] sm:text-[10px] line-through text-gray-400 font-bold block mb-2 sm:mb-3 mt-0.5">
                        {item.old_price?.toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="px-3 pb-3 sm:px-4 sm:pb-4 mt-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-1.5 sm:p-2 flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <TrendingUp size={12} className="text-yellow-700 sm:w-3 sm:h-3" strokeWidth={3} />
                    <span className="text-[8px] sm:text-[9px] font-black text-yellow-800 uppercase tracking-tighter">Gain</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black text-yellow-700">
                    {item.commission?.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <button
                  onClick={(e) => handleShare(e, item)}
                  className="w-full bg-black hover:bg-gray-800 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-2xl font-bold text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 shadow-md active:scale-95 transition-all group/btn relative overflow-hidden"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-30deg] -translate-x-full group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                  <Share2 size={12} className="relative z-10 text-yellow-400 sm:w-3.5 sm:h-3.5" />
                  <span className="relative z-10">Vendre</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <CheckoutPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}