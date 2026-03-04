import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, UserRound, ShoppingCart, HelpCircle, ChevronDown, Truck, Tag, Gift, Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Imports Contextes & Firebase
import PopupPanier from "../PopupPanier"; 
import { useAuth } from "../../contexte/AuthContext";
import { useCart } from "../CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

export default function Navbar() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [isPopupPanierOpen, setIsPopupPanierOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStuck, setIsStuck] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("client"); // Par défaut client

  const navigate = useNavigate();

  // 1. Récupérer le rôle de l'utilisateur pour la redirection
  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || "client");
        }
      }
    };
    fetchRole();
  }, [user]);

  // 2. Calcul du panier
  const cartCount = cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  // 3. Sticky Header
  useEffect(() => {
    const handleScroll = () => setIsStuck(window.scrollY > 88);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. Promo Bar Logic
  const [promoIndex, setPromoIndex] = useState(0);
  const promos = [
    { title: "LIVRAISON GRATUITE", desc: "Dès 50.000 FCFA d'achat", icon: <Truck size={18} />, link: "/livraison" },
    { title: "VENTE FLASH", desc: "Jusqu'à -50% sur l'électroménager", icon: <Tag size={18} />, link: "/promos" },
    { title: "OFFRE BIENVENUE", desc: "10% de remise sur votre 1er achat", icon: <Gift size={18} />, link: "/inscription" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setPromoIndex((prev) => (prev + 1) % promos.length), 4000);
    return () => clearInterval(timer);
  }, [promos.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  // Fonction de redirection dynamique
  const handleProfileClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      // Si admin ou vendeur -> Dashboard Pro, sinon -> Mon Compte
      const targetPath = (userRole === "admin" || userRole === "vendeur") ? "/dashboard" : "/mon-compte";
      navigate(targetPath);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="w-full font-['Inter',sans-serif] bg-white">
        {/* TOP BAR PROMO */}
        <div className="bg-blue-700 text-white h-20 hidden md:flex items-center px-10 border-b border-white/10 relative">
          <div className="flex-1 hidden lg:flex items-center gap-2 text-sm font-black opacity-90 uppercase tracking-wide">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full text-sm bg-green-500"></span>
             </span>
             Support Rynek en ligne
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center h-full w-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={promoIndex}
                initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -25, opacity: 0 }}
                className="flex items-center"
              >
                <Link to={promos[promoIndex].link} className="flex items-center gap-4 hover:text-orange-300 transition-colors">
                  <span className="bg-white/20 p-3 rounded-full">{promos[promoIndex].icon}</span>
                  <div className="flex flex-col">
                    <span className="text-lg font-black tracking-widest leading-tight uppercase">{promos[promoIndex].title}</span>
                    <span className="text-sm font-bold opacity-90 leading-tight">{promos[promoIndex].desc}</span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-1 flex justify-end">
            <a href="tel:2520006161" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 py-2 px-6 rounded-full transition-all group border border-white/5">
              <div className="bg-orange-500 p-2 rounded-full text-white"><Phone size={16} fill="currentColor" /></div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase font-black text-blue-200 leading-none">Besoin d'aide ?</span>
                <span className="text-base font-black tracking-tighter">25 20 00 61 61</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className={`w-full bg-white sticky top-0 z-[100] py-4 transition-all ${isStuck ? "shadow-lg" : "border-b"}`}>
        <div className="container mx-auto px-4 md:px-10 flex items-center justify-between gap-4 md:gap-8">
          
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-black group-hover:text-orange-500 transition-colors uppercase italic">RYNEK</span>
            <span className="bg-[#f68b1e] text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">★</span>
          </Link>

          {/* Recherche Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-2xl relative">
            <input
              type="text"
              placeholder="Cherchez un produit, une marque ou une catégorie"
              className="w-full pl-5 pr-4 py-3 rounded-l border border-gray-300 focus:border-[#f68b1e] outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-[#f68b1e] hover:bg-[#e67e17] text-white px-8 py-3 rounded-r font-black uppercase text-xs tracking-widest transition-all">
              Rechercher
            </button>
          </form>

          <div className="flex items-center gap-3 md:gap-6">
            {/* BOUTON PROFIL DYNAMIQUE */}
            <button 
              onClick={handleProfileClick}
              className="hidden md:flex items-center gap-2 group cursor-pointer py-2 hover:text-[#f68b1e] transition-colors"
            >
              <UserRound size={24} className="text-gray-700 group-hover:text-[#f68b1e]" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Mon Compte</span>
                <span className="text-xs font-black uppercase tracking-tight">
                  {user ? user.displayName?.split(" ")[0] : "Connexion"}
                </span>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {/* BOUTON PANIER */}
            <button 
                onClick={() => setIsPopupPanierOpen(true)} 
                className="flex items-center gap-2 group relative p-2"
            >
              <div className="relative">
                <ShoppingCart size={26} className="text-gray-800 group-hover:text-[#f68b1e] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-black uppercase hidden md:block group-hover:text-[#f68b1e]">Panier</span>
            </button>

            <button className="md:hidden p-1" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />

            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-[85%] bg-white z-[210] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <span className="font-black text-xl italic uppercase">RYNEK ★</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
              </div>

              <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                {/* Recherche Mobile */}
                <form onSubmit={handleSearch} className="relative">
                  <input type="text" placeholder="Rechercher..." className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold border-none"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500"><Search size={20}/></button>
                </form>

                <div className="flex flex-col gap-4">
                   <button onClick={handleProfileClick} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-700">
                      <div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><UserRound size={20}/></div>
                      {user ? `Profil : ${user.displayName}` : "Se connecter / S'inscrire"}
                   </button>
                   
                   <Link to="/livraison" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-700">
                      <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Truck size={20}/></div>
                      Suivi de livraison
                   </Link>
                </div>
              </div>

              <div className="p-6 border-t">
                 <a href="tel:2520006161" className="w-full bg-blue-700 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest">
                    <Phone size={18} fill="currentColor"/> Appeler le 25 20 00 61 61
                 </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* POPUP PANIER GLOBAL */}
      <PopupPanier isOpen={isPopupPanierOpen} onClose={() => setIsPopupPanierOpen(false)} />
    </>
  );
}