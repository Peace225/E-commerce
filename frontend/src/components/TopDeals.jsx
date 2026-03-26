import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Share2, TrendingUp, Zap, CheckCircle, 
  Truck, ShieldCheck, Headphones, RefreshCw, Award, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { supabase } from "../utils/supabaseClient"; // 🔄 Import du moteur Supabase
import CheckoutPopup from "./CheckoutPopup";

// 👥 Données de Preuve Sociale (Gardées pour le design)
const prenoms = ["Moussa", "Awa", "Koffi", "Fatou", "Bakary", "Saliou", "Amadou", "Khady"];

const trustBadges = [
  { icon: Truck, title: "Livraison Rapide", desc: "Partout dans le pays" },
  { icon: ShieldCheck, title: "Paiement Sécurisé", desc: "Transactions 100% protégées" },
  { icon: RefreshCw, title: "Retours Faciles", desc: "Sous 10 jours ouvrés" },
  { icon: Award, title: "Qualité Garantie", desc: "Produits vérifiés & certifiés" },
  { icon: Headphones, title: "Support 7j/7", desc: "Service client à votre écoute" },
];

const connectedUsers = [
  { id: 1, name: "Kevin", img: "https://i.pravatar.cc/100?img=11", role: "Vendeur Top" },
  { id: 2, name: "Awa", img: "https://i.pravatar.cc/100?img=5", role: "Acheteur Vérifié" },
  { id: 3, name: "Moussa", img: "https://i.pravatar.cc/100?img=12", role: "Nouveau Membre" },
  { id: 4, name: "Fatou", img: "https://i.pravatar.cc/100?img=9", role: "Vendeur Pro" },
  { id: 5, name: "Koffi", img: "https://i.pravatar.cc/100?img=15", role: "Affilié" },
];

export default function TopDeals({ user }) {
  const [products, setProducts] = useState([]); // 🔥 On utilise les données de la base
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeUsersCount, setActiveUsersCount] = useState(1240);

  // 🔄 1. CHARGEMENT DYNAMIQUE DEPUIS SUPABASE
  useEffect(() => {
    const fetchTopDeals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('produits')
          .select('*')
          .eq('type', 'top-deal') // On récupère les 10 produits marqués "top-deal"
          .limit(10);

        if (error) throw error;
        setProducts(data);
      } catch (err) {
        console.error("Erreur chargement Supabase:", err.message);
      }
      setLoading(false);
    };

    fetchTopDeals();
  }, []);

  // 🔄 2. SYSTÈMES DYNAMIQUES (Notifications & Compteur)
  useEffect(() => {
    const showNotification = () => {
      const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
      const montant = [1000, 500, 2000, 1500][Math.floor(Math.random() * 4)];
      setNotification({ prenom, montant });
      setTimeout(() => setNotification(null), 5000);
    };
    const updateUsersCount = () => setActiveUsersCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    
    const interval = setInterval(showNotification, 20000);
    const countInterval = setInterval(updateUsersCount, 8000);
    return () => { clearInterval(interval); clearInterval(countInterval); };
  }, []);

  const handleShare = (e, product) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { alert("⚠️ Connectez-vous pour gagner votre commission !"); return; }
    setSelectedProduct(product);
  };

  if (loading) return (
    <div className="p-20 text-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 font-bold text-gray-500">Chargement des pépites Rynek...</p>
    </div>
  );

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden my-4 sm:my-8 relative">
      
      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-5 z-[100] bg-white border-2 border-green-300 shadow-2xl p-4 rounded-2xl flex items-center gap-4">
             <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="text-green-600" size={20} /></div>
             <div>
               <p className="text-sm font-bold text-gray-900">
                 <span className="text-blue-700">{notification.prenom}</span> vient de gagner <span className="text-green-600">{notification.montant} FCFA</span>
               </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER ORANGE ANIMÉ --- */}
      <div className="py-4 bg-[#e96711] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-4 relative z-10 text-white px-6">
          <div className="flex items-center gap-3">
             <Zap fill="white" size={22} />
             <h2 className="text-2xl font-black uppercase tracking-tighter">Top Deals <span className="text-yellow-300">Rynek</span></h2>
          </div>
          <div className="flex-1 overflow-hidden">
             <motion.div className="flex gap-10 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
                <p className="text-xs font-bold uppercase italic opacity-80">🔥 Les meilleures commissions du moment — Rejoignez nos 12,000 revendeurs actifs — Paiements instantanés 🔥</p>
                <p className="text-xs font-bold uppercase italic opacity-80">🔥 Les meilleures commissions du moment — Rejoignez nos 12,000 revendeurs actifs — Paiements instantanés 🔥</p>
             </motion.div>
          </div>
        </div>
      </div>

      {/* --- BADGES DE CONFIANCE --- */}
      <div className="bg-gray-50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between min-w-max gap-8 px-8 py-3">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-3">
              <badge.icon size={20} className="text-[#e96711]" strokeWidth={2.5} />
              <div className="flex flex-col">
                <h4 className="text-[11px] font-black text-gray-950 uppercase leading-none">{badge.title}</h4>
                <p className="text-[10px] text-gray-500 font-semibold">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- GRILLE DE PRODUITS DEPUIS SUPABASE --- */}
      <div className="p-3 sm:p-5 bg-gray-50/20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {products.map((deal) => (
            <div key={deal.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden relative">
              
              {/* Badge Promo */}
              <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md transform -rotate-3 group-hover:rotate-0 transition-transform">
                {deal.discount}
              </div>
              
              {/* Image avec Link Supabase ID */}
              <Link to={`/product/${deal.id}`} className="block relative aspect-square bg-white p-4 overflow-hidden flex items-center justify-center">
                <img src={deal.img} alt={deal.nom} className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              </Link>
              
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/product/${deal.id}`}>
                  <h3 className="text-[13px] font-bold text-gray-800 line-clamp-1 group-hover:text-[#e96711] transition-colors">{deal.nom}</h3>
                </Link>
                
                <div className="flex items-center gap-2 mt-2 mb-3">
                  <span className="text-lg font-black text-gray-900">{deal.prix?.toLocaleString()} <span className="text-[10px]">FCFA</span></span>
                  {deal.old_price && <span className="text-xs line-through text-gray-400 font-medium">{deal.old_price?.toLocaleString()}</span>}
                </div>
                
                <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-green-800 uppercase">Commission</span>
                  <span className="text-xs font-black text-green-600">{deal.commission} FCFA</span>
                </div>
                
                <button onClick={(e) => handleShare(e, deal)} className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95">
                  <Share2 size={16} /> Partager & Gagner
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && <CheckoutPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}