import { useState } from "react"; 
import { Link } from "react-router-dom"; // 🚀 NOUVEAU : Import de Link pour le SEO
import { Snowflake, ArrowRight, Share2, TrendingUp, BadgeCheck } from "lucide-react";
import CheckoutPopup from "../components/CheckoutPopup";

export const climatiseurs = [
  {
    id: 1,
    name: "Samsung Climatiseur Mural",
    price: 479900,
    oldPrice: 649900,
    commissionRate: 0.1,
    discount: "-26%",
    img: "/images/clim/samsung.jpg" 
  },
  {
    id: 2,
    name: "Unio Climatiseur 12000 BTU",
    price: 370000,
    oldPrice: null,
    commissionRate: 0.1,
    discount: "",
    img: "/images/clim/unio.jpg",
  },
  {
    id: 3,
    name: "Taurus AC 293 KT Mobile",
    price: 369900,
    oldPrice: 599900,
    commissionRate: 0.12,
    discount: "-38%",
    img: "/images/clim/taurus.jpg",
  },
  {
    id: 4,
    name: "TCL Climatiseur Mural 9000 BTU",
    price: 345500,
    oldPrice: 429000,
    commissionRate: 0.1,
    discount: "-18%",
    img: "/images/clim/tcl.jpg",
  },
  {
    id: 5,
    name: "Infinition Climatiseur Split",
    price: 419000,
    oldPrice: 499000,
    commissionRate: 0.08,
    discount: "-16%",
    img: "/images/clim/infinition.jpg",
  },
  {
    id: 6,
    name: "LG Climatiseur DUALCOOL",
    price: 499100,
    oldPrice: 675000,
    commissionRate: 0.15,
    discount: "-26%",
    img: "/images/clim/lg.jpg",
  },
];

export default function ClimatisationVentilateurs({ user }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShare = (e, product) => {
    e.preventDefault(); // 🚀 Empêche le déclenchement d'actions non voulues
    e.stopPropagation();
    if (!user) {
      alert("⚠️ Connectez-vous pour partager et gagner votre commission !");
      return;
    }
    setSelectedProduct(product);
  };

  return (
    // 🚀 RESPONSIVE : Marges et arrondis adaptés au mobile
    <section className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-6 sm:my-12 relative w-full">
      
      {/* 🔹 EN-TÊTE PREMIUM */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 p-5 sm:p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6 relative overflow-hidden">
        
        {/* Motifs de fond (Inclinés comme Adidas) */}
        <div className="absolute top-0 right-0 h-full w-1/2 opacity-10 flex gap-2 sm:gap-4 -skew-x-12 translate-x-10 sm:translate-x-20 pointer-events-none">
          <div className="w-8 sm:w-12 h-full bg-cyan-300"></div>
          <div className="w-6 sm:w-8 h-full bg-cyan-200"></div>
          <div className="w-2 sm:w-4 h-full bg-white"></div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg p-2 transition-transform hover:rotate-12 shrink-0">
             <Snowflake className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">
                Air Frais
              </h2>
              <BadgeCheck className="text-cyan-400 bg-white rounded-full w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-cyan-100 font-bold uppercase tracking-widest mt-1">
              Confort Thermique • Haute Performance
            </p>
          </div>
        </div>

        {/* 🚀 SEO : Utilisation de Link et Responsive (w-full sur mobile) */}
        <Link 
          to="/climatisation"
          className="group relative z-10 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 border border-white/10 w-full md:w-auto"
        >
          <span className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider">
            Explorer la gamme
          </span>
          <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* 🔹 GRILLE DE PRODUITS */}
      <div className="p-3 sm:p-4 md:p-8 bg-gray-50/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {climatiseurs.map((item) => {
             const commission = Math.round(item.price * item.commissionRate).toLocaleString();
             
             return (
            // 🚀 SÉMANTIQUE : article pour un produit
            <article
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full overflow-hidden relative"
            >
              {/* Badge réduction */}
              {item.discount && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 bg-blue-600 text-white text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                  {item.discount}
                </div>
              )}

              {/* 🚀 SEO : Vrai lien sur l'image et le texte uniquement */}
              <Link to={`/product-clim/${item.id}`} className="flex flex-col flex-1">
                {/* Image Produit */}
                <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden border-b border-gray-50">
                  <img 
                    src={item.img} 
                    alt={`Acheter ${item.name}`} 
                    loading="lazy" // 🚀 SEO & Perf
                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-sm" 
                  />
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>

                {/* Infos Produit */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white">
                  <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-800 line-clamp-2 group-hover:text-blue-700 transition-colors mb-2 sm:mb-3 min-h-[32px] sm:min-h-[36px]">
                    {item.name}
                  </h3>
                  
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-lg font-black text-gray-900 tracking-tight">
                          {item.price.toLocaleString()}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase">FCFA</span>
                    </div>
                    
                    <div className="h-3 sm:h-4 mb-2 sm:mb-3 mt-0.5">
                      {item.oldPrice && (
                          <span className="text-[9px] sm:text-[10px] line-through text-gray-400 font-bold">
                              {item.oldPrice.toLocaleString()} F
                          </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Zone d'actions (Partage & Commission) */}
              <div className="px-3 pb-3 sm:px-4 sm:pb-4 mt-auto bg-white">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg sm:rounded-xl p-1.5 sm:p-2 flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <TrendingUp size={12} className="text-emerald-600 sm:w-3 sm:h-3" strokeWidth={3} />
                    <span className="text-[8px] sm:text-[9px] font-black text-emerald-800 uppercase tracking-wider">Gagnez</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black text-emerald-600">{commission} F</span>
                </div>

                <button
                  onClick={(e) => handleShare(e, item)}
                  className="w-full bg-slate-900 hover:bg-black text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 shadow-md active:scale-95 transition-all group/btn relative overflow-hidden"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                  <Share2 size={12} className="relative z-10 text-cyan-400 sm:w-3.5 sm:h-3.5" />
                  <span className="relative z-10">Partager</span>
                </button>
              </div>
            </article>
          )})}
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