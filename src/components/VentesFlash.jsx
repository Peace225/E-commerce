import { useEffect, useState } from "react";
import { Zap, Flame, Timer, ShoppingCart, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    e.stopPropagation(); // Empêche le clic de rediriger vers la page produit
    if (!user) {
      alert("⚠️ Connectez-vous pour acheter et valider cette offre !");
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <section className="relative rounded-[2.5rem] bg-gradient-to-br from-red-700 via-red-900 to-black shadow-2xl overflow-hidden my-12 border border-red-500/20">
      
      {/* --- HEADER VENTES FLASH (Thème Urgence & Premium) --- */}
      <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-8 gap-6 relative z-10">
        
        {/* Titre et icône */}
        <div className="flex items-center gap-4">
          <div className="bg-red-500/20 p-3.5 rounded-2xl backdrop-blur-md border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <Flame className="text-yellow-400 fill-yellow-400 animate-pulse" size={36} />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              Ventes <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Flash</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <p className="text-red-200 text-[10px] md:text-xs font-bold uppercase tracking-widest">Jusqu'à -80% • Stock Limité</p>
            </div>
          </div>
        </div>

        {/* Compteur Digital Ultra Pro */}
        <div className="flex items-center gap-4 bg-black/40 p-3 rounded-3xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-2xl">
            <Timer className="text-red-400" size={16} />
            <p className="text-white/80 font-bold text-xs uppercase tracking-wider hidden sm:block">Se termine dans</p>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <div className="bg-white text-red-700 text-xl font-black p-2 rounded-xl min-w-[45px] text-center shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)]">{timeLeft.h}</div>
            <span className="text-red-500 font-black text-2xl animate-pulse">:</span>
            <div className="bg-white text-red-700 text-xl font-black p-2 rounded-xl min-w-[45px] text-center shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)]">{timeLeft.m}</div>
            <span className="text-red-500 font-black text-2xl animate-pulse">:</span>
            <div className="bg-red-500 text-white text-xl font-black p-2 rounded-xl min-w-[45px] text-center shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)]">{timeLeft.s}</div>
          </div>
        </div>
      </div>

      {/* --- GRILLE DE PRODUITS (Zone d'achat) --- */}
      <div className="bg-gray-50/95 backdrop-blur-xl rounded-t-[2.5rem] p-5 md:p-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
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
              <div
                key={item.id}
                className="group bg-white rounded-[2rem] p-4 border border-gray-100 hover:border-red-300 shadow-sm hover:shadow-[0_20px_40px_rgba(220,38,38,0.12)] transition-all duration-500 flex flex-col relative overflow-hidden"
              >
                {/* Image & Badge */}
                <div 
                  className="relative aspect-square w-full flex items-center justify-center bg-gray-50 rounded-[1.5rem] overflow-hidden cursor-pointer mb-4 group-hover:bg-red-50/50 transition-colors duration-500"
                  onClick={() => navigate(`/product-flash/${item.id}`)}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="object-contain h-[85%] w-[85%] transition-transform duration-700 group-hover:scale-110"
                  />
                  {item.discount && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 transform -rotate-3 group-hover:rotate-0 transition-transform">
                      <Zap size={10} className="fill-white" /> {item.discount}
                    </div>
                  )}
                  {/* Survol "Aperçu Rapide" */}
                  <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1.5 shadow-xl text-gray-900">
                      Voir l'offre <ArrowUpRight size={14} className="text-red-500" />
                    </div>
                  </div>
                </div>

                {/* Infos Produit */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-sm font-black text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
                    {item.description}
                  </p>
                  
                  {/* Prix */}
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-black text-2xl text-red-600 tracking-tight leading-none">{promoPrice}</span>
                    <span className="text-[10px] font-bold text-red-600 mb-1">FCFA</span>
                  </div>
                  {item.oldPrice && <p className="text-xs text-gray-400 font-bold line-through mt-0.5">{item.oldPrice} FCFA</p>}

                  <div className="h-px w-8 bg-gray-200 my-3 group-hover:w-full transition-all duration-500"></div>

                  {/* 🟢 BARRE DE PROGRESSION DU STOCK (Style Premium) */}
                  <div className="mt-auto bg-gray-50 p-2.5 rounded-2xl border border-gray-100 mb-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase mb-1.5">
                      <span className={`${item.remaining < 5 ? 'text-red-600 flex items-center gap-1 animate-pulse' : 'text-gray-700'}`}>
                        {item.remaining < 5 && <Flame size={12} className="fill-red-500" />}
                        Vite, plus que {item.remaining} !
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full relative" 
                        style={{ width: `${percent}%` }}
                      >
                        {/* Brillance sur la barre */}
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-t-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton PAYER immersif */}
                  <button
                    onClick={(e) => handleBuy(e, item)}
                    className="group/btn relative overflow-hidden w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-red-500/25 active:scale-95"
                  >
                    <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-30deg] -translate-x-full group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <ShoppingCart size={16} />
                      <span>PAYER</span>
                    </div>
                  </button>
                </div>
              </div>
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