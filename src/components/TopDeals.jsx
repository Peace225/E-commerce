import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Share2, TrendingUp, Zap, Eye, Users, CheckCircle, 
  Truck, ShieldCheck, Headphones, RefreshCw, Award, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import CheckoutPopup from "./CheckoutPopup";

// 📦 Données des produits
const topDeals = [
  {
    id: 1,
    name: "Four électrique Royal FEB 36",
    description: "Four compact 36L avec minuterie et chaleur tournante.",
    price: "599 FCFA",
    oldPrice: "799 FCFA",
    commission: "1000 FCFA",
    discount: "-25%",
    img: "/images/topdeals/four.jpg",
  },
  {
    id: 2,
    name: "Tajine 30cm GRANITE",
    description: "Revêtement antiadhésif haute résistance.",
    price: "144 FCFA",
    oldPrice: "210 FCFA",
    commission: "1000 FCFA",
    discount: "-31%",
    img: "/images/topdeals/tajine.jpg",
  },
  {
    id: 3,
    name: "Égouttoir Vaisselle",
    description: "Design moderne en acier inoxydable durable.",
    price: "316 FCFA",
    oldPrice: "550 FCFA",
    commission: "1000 FCFA",
    discount: "-43%",
    img: "/images/topdeals/1.jpg",
  },
  {
    id: 4,
    name: "Lot de 6 bocaux en verre",
    description: "Idéal pour conserver aliments et épices.",
    price: "87 FCFA",
    oldPrice: "139 FCFA",
    commission: "1000 FCFA",
    discount: "-37%",
    img: "/images/topdeals/egouttoir.jpg",
  },
  {
    id: 5,
    name: "Montre Tactile Oraimo HD",
    description: "Écran HD, suivi santé et notifications.",
    price: "328 FCFA",
    oldPrice: "450 FCFA",
    commission: "1000 FCFA",
    discount: "-27%",
    img: "/images/topdeals/montre.jpg",
  },
  {
    id: 6,
    name: "Hamac en coton multicolore",
    description: "Confortable et résistant pour extérieur.",
    price: "96 FCFA",
    oldPrice: "109 FCFA",
    commission: "1000 FCFA",
    discount: "-12%",
    img: "/images/topdeals/hamac.jpg",
  },
  {
    id: 7,
    name: "Sèche-cheveux professionnel 3000W",
    description: "Puissance élevée avec contrôle thermique.",
    price: "195 FCFA",
    oldPrice: "299 FCFA",
    commission: "1000 FCFA",
    discount: "-35%",
    img: "/images/topdeals/seche.jpg",
  },
  {
    id: 8,
    name: "Machine à café portable USB",
    description: "Prépare votre café partout, rechargeable.",
    price: "199 FCFA",
    oldPrice: "289 FCFA",
    commission: "1000 FCFA",
    discount: "-31%",
    img: "/images/topdeals/machine.jpg",
  },
  {
    id: 9,
    name: "Balance électronique cuisine",
    description: "Mesure précise jusqu'à 5kg.",
    price: "79 FCFA",
    oldPrice: "110 FCFA",
    commission: "1000 FCFA",
    discount: "-28%",
    img: "/images/topdeals/balance.jpg",
  },
  {
    id: 10,
    name: "Brosse lissante chauffante",
    description: "Lissage rapide et sans frisottis.",
    price: "149 FCFA",
    oldPrice: "239 FCFA",
    commission: "1000 FCFA",
    discount: "-38%",
    img: "/images/topdeals/brosse.jpg",
  },
];

// 👥 Données de Preuve Sociale (Noms)
const prenoms = ["Moussa", "Awa", "Koffi", "Fatou", "Bakary", "Saliou", "Amadou", "Khady"];

// 🛡️ Badges de Confiance
const trustBadges = [
  { icon: Truck, title: "Livraison Rapide", desc: "Partout dans le pays" },
  { icon: ShieldCheck, title: "Paiement Sécurisé", desc: "Transactions 100% protégées" },
  { icon: RefreshCw, title: "Retours Faciles", desc: "Sous 10 jours ouvrés" },
  { icon: Award, title: "Qualité Garantie", desc: "Produits vérifiés & certifiés" },
  { icon: Headphones, title: "Support 7j/7", desc: "Service client à votre écoute" },
];

// 🟢 Profils des utilisateurs connectés (Avec les photos de profil)
const connectedUsers = [
  { id: 1, name: "Kevin", img: "https://i.pravatar.cc/100?img=11", role: "Vendeur Top" },
  { id: 2, name: "Awa", img: "https://i.pravatar.cc/100?img=5", role: "Acheteur Vérifié" },
  { id: 3, name: "Moussa", img: "https://i.pravatar.cc/100?img=12", role: "Nouveau Membre" },
  { id: 4, name: "Fatou", img: "https://i.pravatar.cc/100?img=9", role: "Vendeur Pro" },
  { id: 5, name: "Koffi", img: "https://i.pravatar.cc/100?img=15", role: "Affilié" },
  { id: 6, name: "Saliou", img: "https://i.pravatar.cc/100?img=14", role: "Acheteur" },
  { id: 7, name: "Khady", img: "https://i.pravatar.cc/100?img=10", role: "Partenaire" },
];

export default function TopDeals({ user }) {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeUsersCount, setActiveUsersCount] = useState(1240);

  // Systèmes dynamiques (Toast & Compteur de membres en ligne)
  useEffect(() => {
    const showNotification = () => {
      const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
      const montant = [1000, 500, 2000, 1500][Math.floor(Math.random() * 4)];
      setNotification({ prenom, montant });
      setTimeout(() => setNotification(null), 5000);
    };

    const updateUsersCount = () => {
      setActiveUsersCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    };

    const interval = setInterval(showNotification, Math.random() * (25000 - 15000) + 15000);
    const countInterval = setInterval(updateUsersCount, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(countInterval);
    };
  }, []);

  const handleShare = (e, product) => {
    e.stopPropagation();
    if (!user) {
      alert("⚠️ Connectez-vous pour partager et gagner votre commission !");
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden my-8 relative">
      
      {/* 1. ✨ NOTIFICATION FLASH (Toast) */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 20, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            className="fixed bottom-10 left-5 z-[100] bg-white/80 backdrop-blur-xl border-2 border-green-300 shadow-[0_10px_40px_rgba(74,222,128,0.3)] p-4 rounded-2xl flex items-center gap-4 min-w-[300px]"
          >
            <div className="bg-green-100 p-2 rounded-full relative">
              <span className="animate-ping absolute inset-0 rounded-full bg-green-300 opacity-75"></span>
              <CheckCircle className="text-green-600 relative z-10" size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gain en direct</p>
              <p className="text-sm font-bold text-gray-900 leading-snug">
                <span className="text-blue-700 font-extrabold">{notification.prenom}</span> vient de gagner <span className="text-green-600 font-extrabold">{notification.montant} FCFA</span>
              </p>
              <p className="text-[9px] text-gray-400 italic">Il y a quelques secondes sur Rynek</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. 🔥 HEADER AVEC SOCIAL PROOF DÉFILANT */}
      <div className="py-4 shadow-inner relative overflow-hidden bg-[#e96711]">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -inset-[100%] bg-[radial-gradient(45%_50%_at_50%_50%,#ff8c42_0%,rgba(233,103,17,0)_100%)] animate-pulse"></div>
          <div className="absolute -inset-[100%] bg-[radial-gradient(35%_40%_at_20%_30%,#ffd700_0%,rgba(233,103,17,0)_100%)] animate-pulse delay-75"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4 relative z-10">
          <div className="flex items-center gap-3 px-6 shrink-0 border-r border-white/10 max-lg:border-none">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-lg border border-white/20 shadow-md">
              <Zap className="text-white fill-white" size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                Top Deals <span className="text-yellow-300">Rynek</span>
              </h2>
              <p className="text-[9px] text-orange-100 font-bold uppercase tracking-widest mt-1">Plateforme Business Élite</p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <motion.div 
              className="flex items-center gap-12 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
              style={{ width: "fit-content" }}
            >
              {[1, 2].map((group) => (
                <div key={group} className="flex items-center gap-12 py-1">
                  
                  {/* Bloc 1: Membres Actifs */}
                  <div className="flex items-center gap-3 bg-black/10 backdrop-blur-md p-2.5 px-5 rounded-full border border-white/5 shadow-inner transition-transform hover:scale-105">
                    <div className="flex -space-x-2.5">
                      {[1, 2, 3, 4].map((i) => (
                        <img key={i} className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-lg" src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" />
                      ))}
                    </div>
                    <p className="text-[13px] font-extrabold text-white italic tracking-tight">Rejoignez la communauté</p>
                  </div>

                  {/* Bloc 2: 450 personnes consultent avec avatars */}
                  <div className="flex items-center gap-3 bg-green-500/15 backdrop-blur-md p-2 px-5 rounded-full border border-green-300/30 shadow-inner group">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <div className="flex -space-x-2">
                      {[5, 6, 7].map((i) => (
                        <img 
                          key={i} 
                          className="w-6 h-6 rounded-full border border-green-400/50 object-cover shadow-sm" 
                          src={`https://i.pravatar.cc/100?img=${i+30}`} 
                          alt="viewer" 
                        />
                      ))}
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest group-hover:text-green-100">450 personnes consultent les offres</p>
                  </div>

                  {/* Bloc 3: Dernière commission */}
                  <div className="flex items-center gap-2.5 text-white bg-white/5 backdrop-blur-sm p-2.5 px-5 rounded-full border border-white/5">
                    <TrendingUp size={16} className="text-yellow-300" />
                    <span className="text-xs font-bold">Dernière commission : <span className="font-extrabold text-green-200">2,500 FCFA</span></span>
                  </div>
                </div>
              ))}
            </motion.div>
            
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#e96711] via-[#e96711]/50 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#e96711] via-[#e96711]/50 to-transparent z-10"></div>
          </div>
        </div>
      </div>

      {/* 3. 🛡️ BADGES DE CONFIANCE (HAUTEUR RÉDUITE) */}
      <div className="bg-gray-50/50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between min-w-max gap-8 px-8 py-3">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className="bg-white p-2 rounded-lg text-[#e96711] transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.05)] group-hover:bg-[#e96711] group-hover:text-white group-hover:shadow-md group-hover:-translate-y-0.5">
                <badge.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[11px] font-black text-gray-950 uppercase tracking-widest group-hover:text-[#e96711] transition-colors leading-none">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 🟢 UTILISATEURS CONNECTÉS EN DIRECT (SLIDE AVEC PHOTOS) */}
      <div className="bg-white border-b border-gray-100 py-3 px-6 flex items-center overflow-hidden relative">
        
        {/* Compteur Fixe à gauche */}
        <div className="flex items-center gap-2 shrink-0 border-r border-gray-200 pr-4 mr-4 bg-white z-10">
          <Activity size={18} className="text-green-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">
            {activeUsersCount} <span className="text-green-600 font-black">En Ligne</span>
          </span>
        </div>
        
        {/* Zone de slide infinie pour les profils */}
        <div className="flex-1 overflow-hidden relative">
           <motion.div 
              className="flex items-center gap-4 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              style={{ width: "fit-content" }}
            >
              {/* On double la liste (group 1 et 2) pour l'effet de boucle sans fin */}
              {[1, 2].map((groupIndex) => (
                <div key={`group-${groupIndex}`} className="flex items-center gap-4 px-2">
                  {connectedUsers.map((u) => (
                    <div key={`${groupIndex}-${u.id}`} className="flex items-center gap-2 group cursor-pointer bg-gray-50 py-1.5 px-3 rounded-full shadow-sm border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all">
                      
                      {/* --- PHOTO DE PROFIL --- */}
                      <div className="relative">
                        <img src={u.img} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-900 leading-tight group-hover:text-green-700 transition-colors">{u.name}</span>
                        <span className="text-[8px] text-gray-500 font-semibold leading-tight">{u.role}</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-[11px] text-blue-600 font-bold ml-2 mr-4 cursor-pointer hover:underline">
                    Voir tout ({activeUsersCount})
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Fondus sur les bords pour adoucir l'entrée/sortie des profils */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>

      {/* 5. 🛍️ GRILLE DE PRODUITS */}
      <div className="p-5 bg-gray-50/20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {topDeals.map((deal) => (
            <div
              key={deal.id}
              onClick={() => navigate(`/product/${deal.id}`)}
              className="group cursor-pointer bg-white rounded-2xl border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden relative"
            >
              <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                {deal.discount}
              </div>
              
              <div className="relative aspect-square bg-white p-6 overflow-hidden flex items-center justify-center">
                <img src={deal.img} alt={deal.name} className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-4 flex flex-col flex-1 bg-white">
                <h3 className="text-[13px] font-bold text-gray-800 line-clamp-1 group-hover:text-[#e96711] transition-colors mb-1">{deal.name}</h3>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed min-h-[32px]">{deal.description}</p>
                
                <div className="h-px w-8 bg-orange-200 my-3 group-hover:w-full transition-all duration-500"></div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-black text-gray-900">{deal.price}</span>
                  <span className="text-xs line-through text-gray-400 font-medium decoration-red-400">{deal.oldPrice}</span>
                </div>
                
                <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 flex items-center justify-between group/comm mb-4 hover:bg-green-100/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-500" strokeWidth={3} />
                    <span className="text-[10px] font-bold text-green-800 uppercase">Commission</span>
                  </div>
                  <span className="text-xs font-black text-green-600 group-hover/comm:scale-110 transition-transform">{deal.commission}</span>
                </div>
                
                <button
                  onClick={(e) => handleShare(e, deal)}
                  className="mt-auto group/btn relative overflow-hidden w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                  <Share2 size={16} strokeWidth={2.5} className="relative z-10" />
                  <span className="relative z-10">Partager le lien</span>
                </button>
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