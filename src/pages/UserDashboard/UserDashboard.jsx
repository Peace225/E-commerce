import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

// --- IMPORTS FIREBASE & CONTEXTE ---
import { auth, db } from "../../utils/firebaseConfig";
import { useAuth } from "../../contexte/AuthContext";

// --- IMPORTS COMPOSANTS ---
import UserSidebar from "./UserSidebar";
import MesCommandes from "./MesCommandes"; // 👈 Ajout de l'import du composant MesCommandes
import { Wallet, Share2, Gift, Heart, MapPin, Settings, Loader2 } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 🎛️ ÉTATS PRINCIPAUX
  const [activeTab, setActiveTab] = useState("Mes Commandes");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 RÉCUPÉRATION DES DONNÉES EN TEMPS RÉEL (Wallet, Points, Rôle...)
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  // 🔴 DÉCONNEXION
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // 🧩 MOTEUR D'AFFICHAGE DU CONTENU CENTRAL
  const renderContent = () => {
    switch (activeTab) {
      case "Mes Commandes":
        // 👈 On utilise maintenant le vrai composant de suivi
        return <MesCommandes user={user} />;

      case "Mon Wallet":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={120} /></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Solde Disponible</h3>
              <p className="text-4xl font-black tracking-tighter mb-6">{userData?.balance?.toLocaleString() || 0} <span className="text-lg text-orange-500">FCFA</span></p>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                Retirer mes fonds
              </button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
              <Gift size={48} className="text-orange-200 mb-4" />
              <h3 className="text-sm font-black uppercase tracking-widest mb-1">Points Fidélité</h3>
              <p className="text-3xl font-black text-orange-500">{userData?.bonusBalance || 0} PTS</p>
            </div>
          </div>
        );

      case "Affiliation":
        return (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
            <Share2 size={64} className="mx-auto text-blue-100 mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 text-gray-900">Programme d'Affiliation</h2>
            <p className="text-gray-500 text-xs font-bold mb-8 max-w-md mx-auto leading-relaxed">
              Partagez ce code avec vos proches. Ils obtiennent une réduction, et vous gagnez des commissions directes dans votre Wallet !
            </p>
            <div className="bg-blue-50 border-2 border-dashed border-blue-200 p-6 rounded-3xl flex flex-col items-center justify-center gap-4 max-w-sm mx-auto">
              <span className="text-sm font-black text-blue-400 uppercase tracking-widest">Votre Code Parrain</span>
              <span className="text-3xl font-black text-blue-700 tracking-widest">{userData?.referralCode || "RYNEK-PRO"}</span>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all mt-2 w-full active:scale-95">
                Copier le lien
              </button>
            </div>
          </div>
        );

      case "Mes Favoris":
        return (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center py-20">
            <Heart size={64} className="mx-auto text-red-100 mb-6" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Vos Coups de Cœur</h2>
            <p className="text-gray-400 font-bold uppercase text-xs">Votre liste d'envies est vide.</p>
          </div>
        );

      case "Mes Adresses":
      case "Mon Profil":
      case "Commissions & Bons":
        return (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center py-20 flex flex-col items-center justify-center">
            <Settings size={64} className="mx-auto text-gray-200 mb-6 animate-spin-slow" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">En construction</h2>
            <p className="text-gray-400 font-bold uppercase text-xs">Cet espace sera bientôt disponible.</p>
          </div>
        );

      default:
        return null;
    }
  };

  // ⏳ ÉCRAN DE CHARGEMENT
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-600 mb-4" size={48} />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Chargement Espace Client...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif] selection:bg-orange-100 selection:text-orange-600 py-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Titre Mobile Uniquement */}
        <div className="md:hidden mb-6 flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
           <h1 className="font-black text-lg uppercase italic tracking-tighter">Mon Espace</h1>
           <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Client</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          
          {/* 👈 BARRE LATÉRALE (Composant Importé) */}
          <UserSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            user={user} 
            handleLogout={handleLogout} 
          />

          {/* 👉 CONTENU PRINCIPAL DYNAMIQUE */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
          
        </div>
      </div>
    </div>
  );
}