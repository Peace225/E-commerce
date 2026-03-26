import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Share2, BadgeCheck, ArrowRight, TrendingUp } from "lucide-react";
import { supabase } from "../utils/supabaseClient"; 
import CheckoutPopup from "./CheckoutPopup";

export default function AdidasBoutique({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🔄 FETCH DES DONNÉES DEPUIS SUPABASE (AVEC LE BON FILTRE)
  useEffect(() => {
    const fetchAdidasProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('produits')
          .select('*')
          .eq('marque', 'Adidas')
          .eq('type', 'boutique') // 🚀 LE FILTRE MAGIQUE : Ignore les faux produits de test
          .limit(6);

        if (error) throw error;
        setProducts(data);
      } catch (err) {
        console.error("Erreur Boutique Adidas:", err.message);
      }
      setLoading(false);
    };

    fetchAdidasProducts();
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

  if (loading) return <div className="p-10 text-center font-bold text-gray-500 animate-pulse">Chargement de la boutique Adidas...</div>;

  return (
    <section className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-8 sm:my-12 relative">
      
      {/* 🔹 EN-TÊTE MARQUE PREMIUM (Thème Adidas) */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black p-5 sm:p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 h-full w-1/2 opacity-10 flex gap-2 sm:gap-4 -skew-x-12 translate-x-10 sm:translate-x-20 pointer-events-none">
          <div className="w-8 sm:w-12 h-full bg-white"></div>
          <div className="w-8 sm:w-12 h-full bg-white"></div>
          <div className="w-8 sm:w-12 h-full bg-white"></div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg p-1.5 sm:p-2 shrink-0">
             <img src="/images/boutiques/adidas.jpg" alt="Logo Adidas Officiel" className="w-full h-full object-contain mix-blend-multiply" onError={(e) => e.target.style.display = 'none'} />
             <span className="font-black text-lg sm:text-2xl tracking-tighter text-gray-900 absolute">adi</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">
                Adidas
              </h2>
              <BadgeCheck className="text-blue-400 bg-white rounded-full w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              Boutique Officielle • Nouvelle Collection
            </p>
          </div>
        </div>

        <Link 
          to="/boutique/Adidas"
          className="group relative z-10 flex items-center justify-center gap-2 w-full md:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 border border-white/10"
        >
          <span className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider">
            Voir la boutique
          </span>
          <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* 🔹 GRILLE DE PRODUITS ADIDAS */}
      <div className="p-3 sm:p-6 md:p-8 bg-gray-50/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {products.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-900 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full overflow-hidden relative"
            >
              {item.discount && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                  {item.discount}
                </div>
              )}

              <Link to={`/product/${item.id}`} className="flex flex-col flex-1">
                <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={`Acheter ${item.nom}`} 
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-md" 
                    onError={(e) => { e.target.src = "https://placehold.co/400x400/eeeeee/999999?text=Image+Indisponible" }} 
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white">
                  <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-800 line-clamp-2 group-hover:text-black transition-colors mb-2 min-h-[32px] sm:min-h-[36px]">
                    {item.nom}
                  </h3>
                  
                  <div className="mt-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mb-2 sm:mb-3">
                      <span className="text-sm sm:text-lg font-black text-gray-900 tracking-tight leading-none">
                        {item.prix?.toLocaleString('fr-FR')} FCFA
                      </span>
                      {item.old_price && (
                        <span className="text-[9px] sm:text-[10px] line-through text-gray-400 font-bold">
                          {item.old_price?.toLocaleString('fr-FR')} FCFA
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              <div className="px-3 pb-3 sm:px-4 sm:pb-4 mt-auto bg-white">
                <div className="bg-green-50 border border-green-100 rounded-lg sm:rounded-xl p-1.5 sm:p-2 flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <TrendingUp size={12} className="text-green-600 sm:w-3 sm:h-3" strokeWidth={3} />
                    <span className="text-[8px] sm:text-[9px] font-black text-green-800 uppercase tracking-wider">Com.</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black text-green-600">{item.commission} FCFA</span>
                </div>

                <button
                  onClick={(e) => handleShare(e, item)}
                  className="w-full bg-gray-900 hover:bg-black text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 shadow-md active:scale-95 transition-all group/btn relative overflow-hidden"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                  <Share2 size={12} className="relative z-10 sm:w-3.5 sm:h-3.5" />
                  <span className="relative z-10">Partager</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedProduct && <CheckoutPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}