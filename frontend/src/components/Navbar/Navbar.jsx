import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, UserRound, ShoppingCart, ChevronDown, Truck, Tag, Gift, Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Imports Contextes & Supabase
import PopupPanier from "../PopupPanier"; 
import { useAuth } from "../../contexte/AuthContext";
import { useCart } from "../CartContext";
import { useTheme } from "../../contexte/ThemeProvider"; 
import { supabase } from "../../utils/supabaseClient";

export default function Navbar() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const { currentTheme } = useTheme(); 
  const [isPopupPanierOpen, setIsPopupPanierOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStuck, setIsStuck] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // ✅ Nouveaux états pour gérer les données complètes de l'utilisateur
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState("client");

  const navigate = useNavigate();

  // --- LOGIQUE DE RÉCUPÉRATION DES DONNÉES ET TEMPS RÉEL ---
  useEffect(() => {
    if (!user) {
      setUserData(null);
      return;
    }

    // 1. Récupération initiale de toutes les données (photo, nom, rôle)
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*') // On récupère TOUT au lieu de juste le rôle
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setUserData(data);
          if (data.role) setUserRole(data.role);
        }
      } catch (error) {
        console.error("Erreur récupération données Navbar:", error.message);
      }
    };

    fetchUserData();

    // ⚡ 2. Écouteur Temps Réel pour que la Navbar se mette à jour instantanément
    const channel = supabase
      .channel('navbar-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` },
        (payload) => {
          setUserData(payload.new);
          if (payload.new.role) setUserRole(payload.new.role);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  // ✅ Calcul dynamique et en temps réel du nombre d'articles dans le panier via useCart
  const cartCount = cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  // --- LOGIQUE STICKY NAVBAR ---
  useEffect(() => {
    const handleScroll = () => setIsStuck(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- GESTION DYNAMIQUE DES PROMOS ---
  const basePromos = [
    { title: "LIVRAISON GRATUITE", desc: "Dès 50.000 FCFA d'achat", icon: <Truck size={18} />, link: "/livraison" },
    { title: "VENTE FLASH", desc: "Jusqu'à -50% sur l'électroménager", icon: <Tag size={18} />, link: "/promos" },
  ];

  const promos = currentTheme && currentTheme.id !== "default" && currentTheme.promoText
    ? [
        { 
          title: currentTheme.name?.toUpperCase() || "ÉVÉNEMENT", 
          desc: currentTheme.promoText, 
          icon: <Gift size={18} />, 
          link: "/promos" 
        },
        ...basePromos
      ]
    : basePromos;

  const [promoIndex, setPromoIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setPromoIndex((prev) => (prev + 1) % promos.length), 4000);
    return () => clearInterval(timer);
  }, [promos.length]);

  // --- ACTIONS ---
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleProfileClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      const targetPath = (userRole === "admin" || userRole === "vendeur") ? "/dashboard" : "/mon-compte";
      navigate(targetPath);
    }
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    if (!user) {
      navigate("/login"); 
    } else {
      setIsPopupPanierOpen(true);
    }
    setIsMobileMenuOpen(false);
  };

  // Préparation du nom à afficher (Prénom uniquement pour ne pas casser le design)
  const displayName = userData?.full_name?.split(" ")[0] || "Client";

  return (
    <>
      {/* 1. TOP BAR PROMO */}
      <div className="w-full font-['Inter',sans-serif] bg-primary text-theme-text h-16 lg:h-20 hidden md:flex items-center px-4 lg:px-10 border-b border-white/10 relative overflow-hidden transition-colors duration-500">
        <div className="flex-1 hidden xl:flex items-center gap-2 text-[11px] font-black opacity-90 uppercase tracking-wide">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Support en ligne 24/7
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center h-full w-full max-w-[300px] lg:max-w-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={promoIndex}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              className="flex items-center"
            >
              <Link to={promos[promoIndex]?.link || "/"} className="flex items-center gap-2 lg:gap-4 hover:opacity-80 transition-all">
                <span className="bg-white/20 p-2 lg:p-3 rounded-full hidden sm:block">{promos[promoIndex]?.icon}</span>
                <div className="flex flex-col text-center sm:text-left">
                  <span className="text-xs lg:text-lg font-black tracking-widest leading-tight uppercase">{promos[promoIndex]?.title}</span>
                  <span className="text-[10px] lg:text-sm font-medium opacity-90 leading-tight line-clamp-1">{promos[promoIndex]?.desc}</span>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex-1 flex justify-end">
          <a href="tel:2520006161" className="flex items-center gap-2 lg:gap-4 bg-white/10 hover:bg-white/20 py-2 px-4 lg:px-6 rounded-full transition-all group border border-white/5">
            <div className="bg-secondary p-1.5 rounded-full text-white transition-colors duration-500"><Phone size={14} fill="currentColor" /></div>
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-[9px] uppercase font-bold opacity-70 leading-none">Aide</span>
              <span className="text-xs lg:text-base font-black tracking-tighter">25 20 00 61 61</span>
            </div>
          </a>
        </div>
      </div>

      {/* Spacer dynamique */}
      {isStuck && <div className="h-[74px] lg:h-[93px] w-full hidden md:block" />}
      {isStuck && <div className="h-[65px] w-full md:hidden" />}

      {/* 2. MAIN HEADER */}
      <header 
        className={`w-full font-['Inter',sans-serif] bg-white z-[100] transition-all duration-300 ${
          isStuck 
            ? "fixed top-0 left-0 shadow-md py-2 lg:py-3" 
            : "relative py-3 lg:py-5 border-b"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 xl:px-12 flex items-center justify-between gap-4">
          
          <Link to="/" className="flex items-center gap-1 group flex-shrink-0">
            <span className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter text-black group-hover:text-primary transition-colors uppercase italic">RYNEK</span>
            <span className="bg-secondary text-white rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center font-bold text-[8px] lg:text-[10px] transition-colors duration-500">★</span>
          </Link>

          {/* Recherche */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-[40%] lg:max-w-2xl relative group">
            <input
              type="text"
              placeholder="Cherchez un produit, une marque..."
              className="w-full pl-4 pr-12 py-2.5 lg:py-3 rounded-l-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-primary hover:opacity-90 text-theme-text px-4 lg:px-8 py-2.5 lg:py-3 rounded-r-md font-black uppercase text-[10px] lg:text-xs tracking-widest transition-all">
              <Search size={18} className="lg:hidden" />
              <span className="hidden lg:inline">Rechercher</span>
            </button>
          </form>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
            <button onClick={handleProfileClick} className="hidden sm:flex items-center gap-2 group cursor-pointer py-1 hover:text-primary transition-colors">
              {/* ✅ GESTION DYNAMIQUE DE L'IMAGE DE PROFIL DESKTOP */}
              {userData?.avatar_url ? (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors flex-shrink-0">
                  <img src={userData.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                </div>
              ) : (
                <UserRound size={22} className="text-gray-700 group-hover:text-primary flex-shrink-0" />
              )}
              
              <div className="hidden lg:flex flex-col items-start leading-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Mon Compte</span>
                <span className="text-xs font-black uppercase tracking-tight truncate max-w-[100px]">{user ? displayName : "Connexion"}</span>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden lg:block" />
            </button>

            {/* Bouton Panier Logique */}
            <button onClick={handleCartClick} className="flex items-center gap-2 group relative p-2">
              <div className="relative">
                <ShoppingCart size={24} className="text-gray-800 group-hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount} // 👈 Force une petite animation quand le chiffre change
                    initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-secondary text-white text-[9px] font-black h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center rounded-full border-2 border-white transition-colors duration-500"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </div>
              <span className="text-xs font-black uppercase hidden xl:block group-hover:text-primary">Panier</span>
            </button>

            <button className="md:hidden p-2 text-gray-800 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[210] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b">
                <span className="font-black text-xl italic uppercase tracking-tighter">RYNEK ★</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
              </div>

              <div className="p-5 space-y-6 flex-1 overflow-y-auto">
                <nav className="flex flex-col gap-3">
                   {/* ✅ GESTION DYNAMIQUE DE L'IMAGE DE PROFIL MOBILE */}
                   <button onClick={handleProfileClick} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 text-left transition-colors">
                      {userData?.avatar_url ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                           <img src={userData.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="bg-primary/10 p-3 rounded-xl text-primary flex-shrink-0"><UserRound size={22}/></div>
                      )}
                      
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Espace Client</span>
                        <span className="text-sm font-black uppercase tracking-wide truncate">{user ? displayName : "Connexion / Inscription"}</span>
                      </div>
                   </button>
                   
                   {/* Panier Mobile Logique */}
                   <button onClick={handleCartClick} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                      <div className="bg-primary/10 p-3 rounded-xl text-primary relative">
                        <ShoppingCart size={22}/>
                        {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-white text-[8px] h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
                      </div>
                      <span className="text-sm font-black uppercase tracking-wide text-gray-700">Mon Panier</span>
                   </button>

                   <Link to="/promos" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="bg-secondary/10 p-3 rounded-xl text-secondary"><Tag size={22}/></div>
                      <span className="text-sm font-black uppercase tracking-wide text-gray-700">Nos Promotions</span>
                   </Link>
                </nav>
              </div>

              <div className="p-5 border-t bg-gray-50">
                 <a href="tel:2520006161" className="w-full bg-primary text-theme-text py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-widest shadow-lg transition-all duration-500">
                    <Phone size={18} fill="currentColor"/> Service Client Rynek
                 </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PopupPanier isOpen={isPopupPanierOpen} onClose={() => setIsPopupPanierOpen(false)} />
    </>
  );
}