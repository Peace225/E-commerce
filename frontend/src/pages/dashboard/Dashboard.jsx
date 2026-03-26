import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async"; // 🚀 Utilisation de Helmet Async
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

// --- LOGIQUE FIREBASE & AUTH ---

import { useAuth } from "../../contexte/AuthContext";


// --- COMPOSANTS DE STRUCTURE ---
import SidebarDashboard from "../dashboard/SidebarDashboard";

// --- PAGES & SECTIONS ---
import DashboardHome from "./DashboardHome";
import MaBoutique from "../dashboard/MaBoutique";
import MesCommandes from "./MesCommandes";
import MesCommissions from "./MesCommissions";
import AffiliationDash from "../dashboard/AffiliationDash";
import MesBons from "./MesBons";
import Parametres from "../Parametres";
import Automatisation from "./Automatisation";
import Formation from "./Formation";
// 🔗 Nouveau composant Wallet :
import WalletPage from "../dashboard/WalletPage"; 

export default function Dashboard() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("accueil");
  const [menuOpen, setMenuOpen] = useState(false);

  // ✨ PERSONNALISATION À LA CRÉATION DU COMPTE
  const initialiserNouveauCompte = async () => {
    if (!user) return;

    const prefix = user.email ? user.email.split("@")[0].toUpperCase().slice(0, 4) : "RYNK";
    const refCode = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

    let cleanName = "Ambassadeur";
    if (user.displayName) {
      cleanName = user.displayName;
    } else if (user.email) {
      const emailName = user.email.split("@")[0];
      cleanName = emailName.charAt(0).toUpperCase() + emailName.slice(1).toLowerCase();
    }

    const newUser = {
      uid: user.uid,
      email: user.email || "",
      displayName: cleanName,
      balance: 0,
      referralCode: refCode,
      referralCount: 0,
      level: "Bronze",
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), newUser);
    setWallet(newUser);
    setLoading(false);
  };

  // 🔄 SYNCHRONISATION TEMPS RÉEL DU WALLET
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setWallet(snap.data());
        setLoading(false);
      } else {
        initialiserNouveauCompte();
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 🚀 CONTRÔLEUR DE RENDU DYNAMIQUE
  const renderContent = () => {
    if (!user || !wallet) return null;

    const globalProps = { wallet, user };

    switch (activePage) {
      case "accueil": return <DashboardHome {...globalProps} />;
      case "ma-boutique": return <MaBoutique {...globalProps} />;
      case "mes-commandes": return <MesCommandes {...globalProps} />;
      case "mes-commissions": return <MesCommissions {...globalProps} />;
      case "affiliation": return <AffiliationDash {...globalProps} />;
      case "mes-bons": return <MesBons {...globalProps} />;
      case "automatisation": return <Automatisation {...globalProps} />;
      case "formation": return <Formation {...globalProps} />;
      case "parametres": return <Parametres {...globalProps} />;
      case "wallet": return <WalletPage {...globalProps} />;
      default: return <DashboardHome {...globalProps} />;
    }
  };

  // 🛡️ ÉCRAN DE CHARGEMENT INITIAL
  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full mb-6 shadow-[0_0_20px_rgba(234,88,12,0.3)]"
      />
      <h2 className="text-white font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">
        Rynek Pro Ecosystem
      </h2>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] overflow-hidden font-sans selection:bg-orange-100 selection:text-orange-600">
      
      {/* 🚀 ANTI-SEO : Bloque strictement l'indexation de cette zone privée */}
      <Helmet>
        <title>Rynek Pro | {activePage.replace('-', ' ').toUpperCase()}</title>
        <meta name="robots" content="noindex, nofollow" /> 
      </Helmet>

      {/* 🔹 SIDEBAR (Navigation Latérale) */}
      <SidebarDashboard 
        user={user}
        wallet={wallet}
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setMenuOpen(false); // Ferme automatiquement le menu sur mobile
        }}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={() => signOut(auth)}
      />

      {/* 🔹 ZONE DE CONTENU PRINCIPALE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER MOBILE (Optimisé UX) */}
        <header className="lg:hidden flex items-center justify-between p-4 sm:p-5 md:p-6 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg sm:rounded-xl shadow-sm flex items-center justify-center">
              <Icons.TrendingUp size={18} className="text-white" />
            </div>
            <h1 className="font-black text-xl sm:text-2xl tracking-tighter uppercase italic text-gray-900">RYNEK</h1>
          </div>
          <button 
            onClick={() => setMenuOpen(true)}
            className="p-2 sm:p-3 bg-gray-50 hover:bg-gray-100 rounded-xl sm:rounded-2xl text-gray-900 active:scale-90 transition-transform"
            aria-label="Ouvrir le menu"
          >
            <Icons.Menu size={24} className="sm:w-7 sm:h-7" />
          </button>
        </header>

        {/* AFFICHAGE DES PAGES AVEC ANIMATION RAPIDE */}
        {/* 🚀 RESPONSIVE : Paddings progressifs (p-4 -> p-6 -> p-8) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-[#f8fafc]">
          <div className="max-w-[1400px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }} // Légèrement plus rapide pour la sensation de vélocité
                className="w-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

      </div>
    </div>
  );
}