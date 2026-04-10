import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { supabase } from "../../utils/supabaseClient"; 
import { useAuth } from "../../contexte/AuthContext";

import UserSidebar from "./UserSidebar";
import TableauDeBord from "./TableauDeBord";
import MesCommandes from "./MesCommandes";
import MonWallet from "./MonWallet";
import Affiliation from "./Affiliation";
import CommissionsBons from "./CommissionsBons";
import MesFavoris from "./MesFavoris";
import MesAdresses from "./MesAdresses";
import MonProfil from "./MonProfil";

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("Tableau de Bord");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ MISE À JOUR LOCALE DIRECTE (Optimistic UI)
  // Permet d'afficher la photo immédiatement sans attendre le rechargement serveur
  const handleLocalUpdate = (updatedFields) => {
    setUserData(prevData => ({
      ...prevData,
      ...updatedFields
    }));
  };

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id) 
        .maybeSingle();

      if (error) throw error;
      if (data) setUserData(data);
    } catch (error) {
      console.error("Erreur rafraîchissement profil:", error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadInitialData = async () => {
      setLoading(true);
      await refreshUserData();
      setLoading(false);
    };
    loadInitialData();

    // Abonnement Temps Réel (Toujours utile en arrière-plan)
    const channel = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` },
        (payload) => {
          console.log("Supabase Realtime Update:", payload.new);
          setUserData(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut(); 
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Tableau de Bord": 
        return <TableauDeBord user={user} userData={userData} setActiveTab={setActiveTab} />;
      case "Mes Commandes": 
        return <MesCommandes user={user} />;
      case "Mon Wallet": 
        return <MonWallet userData={userData} />;
      case "Affiliation": 
        return <Affiliation userData={userData} />;
      case "Commissions & Bons": 
        return <CommissionsBons userData={userData} />;
      case "Mes Favoris": 
        return <MesFavoris />;
      case "Mes Adresses": 
        return <MesAdresses user={user} />;
      case "Mon Profil": 
        // ✅ ON PASSE LA FONCTION DE MISE À JOUR LOCALE ICI
        return <MonProfil user={user} userData={userData} onProfileUpdate={handleLocalUpdate} />;
      default: 
        return <div className="p-20 text-center text-gray-400 font-bold uppercase text-xs">Sélectionnez un onglet</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Chargement Espace Client...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif] selection:bg-primary/20 selection:text-primary py-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="md:hidden mb-6 flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
           <h1 className="font-black text-lg uppercase italic tracking-tighter">Mon Espace</h1>
           <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Client</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <UserSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            user={user} 
            userData={userData} 
            handleLogout={handleLogout} 
          />

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