import { useEffect, useState } from "react";
import { Zap, Flame, Timer, ShoppingCart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom"; // 🚀 NOUVEAU : Import de Link pour le SEO
import CheckoutPopup from "./CheckoutPopup";

// 🔥 Export du tableau
export const ventesFlash = [
  {
    id: 1,
    name: "Voiture Nissan Qashqai",
    description: "Four compact 36L avec minuterie et chaleur tournante.",
    price: 449,
    oldPrice: 718.4,
    commission: 1000,
    discount: "-38%",
    remaining: 4,
    total: 10,
    img: "/images/ventesflash/voiture.jpg",
  },
  {
    id: 2,
    name: "Terrain à vendre à Abidjan",
    description: "Revêtement antiadhésif haute résistance.",
    price: 449,
    oldPrice: 718.4,
    commission: 1000,
    discount: "-38%",
    remaining: 1,
    total: 10,
    img: "/images/ventesflash/1.jpg",
  },
  {
    id: 3,
    name: "Logitech G305 Souris Gaming",
    description: "Design moderne en acier inoxydable durable.",
    price: 449,
    oldPrice: 718.4,
    commission: 1000,
    discount: "-38%",
    remaining: 1,
    total: 10,
    img: "/images/ventesflash/sourir.jpg",
  },
  {
    id: 4,
    name: "Logitech MK270 Combo",
    description: "Idéal pour conserver aliments et épices.",
    price: 239,
    oldPrice: 399,
    commission: 1000,
    discount: "-40%",
    remaining: 18,
    total: 30,
    img: "/images/ventesflash/log.jpg",
  },
  {
    id: 5,
    name: "Logitech Signature M650",
    description: "Écran HD, suivi santé et notifications.",
    price: 369,
    oldPrice: 590.4,
    commission: 1000,
    discount: "-38%",
    remaining: 2,
    total: 10,
    img: "/images/ventesflash/m650.jpg",
  },
  {
    id: 6,
    name: "Logitech MK120 Combo",
    description: "Confortable et résistant pour extérieur.",
    price: 89,
    oldPrice: 142.4,
    commission: 1000,
    discount: "-38%",
    remaining: 42,
    total: 80,
    img: "/images/ventesflash/logitech.jpg",
  },
  {
    id: 7,
    name: "Logitech M171 Wireless",
    description: "Puissance élevée avec contrôle thermique.",
    price: 99,
    oldPrice: 158.4,
    commission: 1000,
    discount: "-38%",
    remaining: 3,
    total: 10,
    img: "/images/ventesflash/clavier.jpg",
  },
];

export default function VentesFlash({ user }) {
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Système de compte à rebours découpé pour un affichage "Bloc par Bloc"
  useEffect(() => {
    const target = new Date().getTime() + 60 * 60 * 1000; // 1h
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      
      const h = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0");
      const m = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0");
      const s = String(Math.floor((distance / 1000) % 60)).padStart(2, "0");
      
      setTimeLeft({ h, m, s });
      
      if (distance < 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = (e, product) => {
    e.preventDefault(); // 🚀 NOUVEAU : Sécurité par rapport au comportement par défaut
    e.stopPropagation();
    if (!user) {
      alert("⚠️ Connectez-vous pour acheter et valider cette offre !");
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <section className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-red-700 via-red-900 to-black shadow-2xl overflow-hidden my-6 sm:my-12 border border-red-500/20">
      
      {/* --- HEADER VENTES FLASH (Thème Urgence & Premium) --- */}
      <div className="flex flex-col md:flex-row justify-between items-center p-5 md:p-8 gap-4 md:gap-6 relative z-10">
        
        {/* Titre et icône */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="bg-red-500/20 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-md border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.4)] shrink-0">
            <Flame className="text-yellow-400 fill-yellow-400 animate-pulse w-6 h-6 sm:w-9 sm:h-9" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tighter flex items-center gap-2 sm:gap-3 leading-none">
              Ventes <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Flash</span>
            </h2>
            <div className="flex items-center gap-2 mt-1.5 sm:mt-1">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <p className="text-red-200 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap">Jusqu'à -80% • Stock Limité</p>
            </div>
          </div>
        </div>

        {/* Compteur Digital Ultra Pro */}
        <div className="flex items-center gap-3 bg-black/40 p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-white/10 backdrop-blur-sm w-full md:w-auto justify-center">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl">
            <Timer className="text-red-400 w-4 h-4 sm:w-4 sm:h-4" />
            <p className="text-white/80 font-bold text-[10px] sm:text-xs uppercase tracking-wider">Fin dans</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 font-mono">
            <div className="bg-white text-red-700 text-lg sm:text-xl font-black p-1 sm:p-2 rounded-lg sm:rounded-xl min-w-[35px] sm:min-w-[45px] text-center shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)]">{timeLeft.h}</div>
            <span className="text-red-500 font-black text-xl sm:text-2xl animate-pulse">:</span>
            <div className="bg-white text-red-700 text-lg sm:text-xl font-black p-1 sm:p-2 rounded-lg sm:rounded-xl min-w-[35px] sm:min-w-[45px] text-center shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)]">{timeLeft.m}</div>
            <span className="text-red-500 font-black text-xl sm:text-2xl animate-pulse">:</span>
            <div className="bg-red-500 text-white text-lg sm:text-xl font-black p-1 sm:p-2 rounded-lg sm:rounded-xl min-w-[35px] sm:min-w-[45px] text-center shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)]">{timeLeft.s}</div>
          </div>
        </div>
      </div>

      {/* --- GRILLE DE PRODUITS (Zone d'achat) --- */}
      <div className="bg-gray-50/95 backdrop-blur-xl rounded-t-[2rem] sm:rounded-t-[2.5rem] p-3 sm:p-5 md:p-8 relative z-10">
        {/* 🚀 NOUVEAU : Grille optimisée pour tous les écrans */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {ventesFlash.map((item) => {
            // Calcul du pourcentage de stock
            const percent = Math.round(((item.total - item.remaining) / item.total) * 100);
            
            // Calcul prix promo exact
            let promoPrice = item.price;
            if (item.oldPrice && item.discount) {
              const discountPercent = parseFloat(item.discount.replace("-", "").replace("%", ""));
              promoPrice = (item.oldPrice * (1 - discountPercent / 100)).toFixed(2);
            }

            return (
              <article
                key={item.id}
                className="group bg-white rounded-2xl sm:rounded-[2rem] p-2.5 sm:p-4 border border-gray-100 hover:border-red-300 shadow-sm hover:shadow-[0_20px_40px_rgba(220,38,38,0.12)] transition-all duration-500 flex flex-col relative overflow-hidden"
              >
                {/* 🚀 SEO : Image wrappée dans un vrai lien */}
                <Link 
                  to={`/product-flash/${item.id}`}
                  className="block relative aspect-square w-full bg-gray-50 rounded-xl sm:rounded-[1.5rem] overflow-hidden mb-3 sm:mb-4 group-hover:bg-red-50/50 transition-colors duration-500"
                >
                  <img
                    src={item.img}
                    alt={`Acheter ${item.name} en vente flash`}
                    loading="lazy"
                    className="object-contain w-full h-full p-2 transition-transform duration-700 group-hover:scale-110"
                  />
                  {item.discount && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-600 text-white text-[10px] sm:text-[11px] font-black px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg flex items-center gap-1 transform -rotate-3 group-hover:rotate-0 transition-transform">
                      <Zap size={10} className="fill-white" /> {item.discount}
                    </div>
                  )}
                  {/* Survol "Aperçu Rapide" (Masqué sur petit mobile pour éviter la surcharge) */}
                  <div className="hidden sm:flex absolute bottom-3 left-0 w-full justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1.5 shadow-xl text-gray-900">
                      Voir l'offre <ArrowUpRight size={14} className="text-red-500" />
                    </div>
                  </div>
                </Link>

                {/* Infos Produit */}
                <div className="flex flex-col flex-1">
                  {/* 🚀 SEO : Titre cliquable en tant que lien */}
                  <Link to={`/product-flash/${item.id}`}>
                    <h3 className="text-[13px] sm:text-sm font-black text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="hidden sm:block text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
                    {item.description}
                  </p>
                  
                  {/* Prix */}
                  <div className="mt-2 sm:mt-3 flex items-end gap-1.5 sm:gap-2">
                    <span className="font-black text-lg sm:text-2xl text-red-600 tracking-tight leading-none">{promoPrice}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-red-600 mb-0.5 sm:mb-1">FCFA</span>
                  </div>
                  {item.oldPrice && <p className="text-[10px] sm:text-xs text-gray-400 font-bold line-through mt-0.5">{item.oldPrice} FCFA</p>}

                  <div className="h-px w-8 bg-gray-200 my-2 sm:my-3 group-hover:w-full transition-all duration-500"></div>

                  {/* 🟢 BARRE DE PROGRESSION DU STOCK */}
                  <div className="mt-auto bg-gray-50 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-gray-100 mb-3 sm:mb-4">
                    <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black uppercase mb-1.5">
                      <span className={`${item.remaining < 5 ? 'text-red-600 flex items-center gap-1 animate-pulse' : 'text-gray-700'}`}>
                        {item.remaining < 5 && <Flame size={10} className="fill-red-500 sm:w-3 sm:h-3" />}
                        Vite, plus que {item.remaining} !
                      </span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full relative" 
                        style={{ width: `${percent}%` }}
                      >
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-t-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton PAYER immersif */}
                  <button
                    onClick={(e) => handleBuy(e, item)}
                    className="group/btn relative overflow-hidden w-full bg-gray-900 hover:bg-black text-white py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-red-500/25 active:scale-95"
                  >
                    <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-30deg] -translate-x-full group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                    <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                      <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                      <span>PAYER</span>
                    </div>
                  </button>
                </div>
              </article>
            );
          })}
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