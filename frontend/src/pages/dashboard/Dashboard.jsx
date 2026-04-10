import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

// --- LOGIQUE SUPABASE & AUTH ---
import { supabase } from "../../utils/supabaseClient"; 
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
import Parametres from "./Parametres";
import Automatisation from "./Automatisation";
import Formation from "./Formation";
import WalletPage from "../dashboard/WalletPage"; 
import Certification from "./Certification"; // 👈 NOUVELLE PAGE IMPORTÉE

export default function Dashboard() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("accueil");
  const [menuOpen, setMenuOpen] = useState(false);

  // ✨ INITIALISATION DU COMPTE VENDEUR (Audit par défaut)
  const initialiserNouveauCompte = async () => {
    if (!user) return;

    const prefix = user.email ? user.email.split("@")[0].toUpperCase().slice(0, 4) : "RYNK";
    const refCode = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = {
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || "Gérant Rynek",
      balance: 0,
      bonus_balance: 0,
      trust_score: 500, // Score de départ
      referral_code: refCode,
      level: "Bronze",
      role: "vendeur",
      status: "pending", // 🛡️ En attente de validation
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('users').insert([newUser]);
    if (!error) setWallet(newUser);
    setLoading(false);
  };

  // 🔄 SYNCHRONISATION SUPABASE (Temps Réel)
  useEffect(() => {
    if (!user) return;

    const syncDashboard = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setWallet(data);
      } else {
        await initialiserNouveauCompte();
      }
      setLoading(false);

      const channel = supabase
        .channel(`dashboard-realtime-${user.id}`)
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` }, 
          (payload) => {
            console.log("⚡ Mise à jour profil vendeur :", payload.new);
            setWallet(payload.new);
          }
        )
        .subscribe();

      return channel;
    };

    const channelPromise = syncDashboard();
    return () => { channelPromise.then(c => c && supabase.removeChannel(c)); };
  }, [user]);

  // 🛡️ COMPOSANT : ÉCRAN D'ATTENTE DE VALIDATION
  const PendingValidation = () => (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-24 h-24 bg-orange-500/10 text-orange-500 rounded-[2.5rem] flex items-center justify-center mb-8 border border-orange-500/20 shadow-2xl shadow-orange-500/10">
        <Icons.ShieldAlert size={48} className="animate-pulse" />
      </div>
      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-4">Accès Restreint</h2>
      <p className="text-slate-500 text-sm max-w-lg leading-relaxed mb-8">
        Cet outil est réservé aux boutiques <strong>validées</strong>. Votre profil est actuellement en statut "En attente". 
        Veuillez soumettre vos documents légaux pour débloquer toutes les fonctionnalités.
      </p>
      <button 
        onClick={() => setActivePage("certification")} // 👈 Redirige intelligemment vers la page KYC
        className="bg-slate-950 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all flex items-center gap-3 shadow-xl hover:shadow-orange-500/20"
      >
        <Icons.FileCheck size={16} /> Envoyer mon dossier
      </button>
    </div>
  );

  // 🚀 CONTRÔLEUR DE RENDU
  const renderContent = () => {
    if (!user || !wallet) return null;
    const globalProps = { wallet, user };

    // 🛑 Restriction d'accès aux outils de vente
    const isRestricted = wallet.status !== "approved";
    // On ne bloque PAS 'accueil', 'parametres', 'certification', 'wallet'
    // const restrictedPages = ["ma-boutique", "mes-commandes", "mes-commissions", "automatisation", "formation"];

    // if (isRestricted && restrictedPages.includes(activePage)) {
    //   return <PendingValidation />;
    // }

    switch (activePage) {
      case "accueil": return <DashboardHome {...globalProps} />;
      case "ma-boutique": return <MaBoutique {...globalProps} />;
      case "mes-commandes": return <MesCommandes {...globalProps} />;
      case "mes-commissions": return <MesCommissions {...globalProps} />;
      case "affiliation": return <AffiliationDash {...globalProps} />;
      case "mes-bons": return <MesBons {...globalProps} />;
      case "automatisation": return <Automatisation {...globalProps} />;
      case "formation": return <Formation {...globalProps} />;
      case "certification": return <Certification {...globalProps} />; // 👈 ROUTE AJOUTÉE
      case "parametres": return <Parametres {...globalProps} onUpdate={(updated) => setWallet({...wallet, ...updated})} />;
      case "wallet": return <WalletPage {...globalProps} />;
      default: return <DashboardHome {...globalProps} />;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-16 h-16 border-t-4 border-orange-500 rounded-full mb-8"
      />
      <h2 className="text-white font-black uppercase text-[10px] tracking-[0.6em] animate-pulse">Rynek Pro Syncing</h2>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] selection:bg-orange-100 selection:text-orange-600">
      
      <Helmet>
        <title>Rynek Pro | {activePage.toUpperCase()}</title>
        <meta name="robots" content="noindex, nofollow" /> 
      </Helmet>

      {/* 🔹 SIDEBAR */}
      <SidebarDashboard 
        user={user}
        wallet={wallet}
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setMenuOpen(false);
        }}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={handleLogout}
      />

      {/* 🔹 CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Mobile */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-slate-950 text-white shadow-xl sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Icons.ShieldCheck size={20} className="text-white" />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic">RYNEK<span className="text-orange-500">PRO</span></h1>
          </div>
          <button onClick={() => setMenuOpen(true)} className="p-2 bg-white/5 rounded-xl text-white active:scale-90 transition-transform">
            <Icons.Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-[#f8fafc]">
          <div className="max-w-[1400px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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