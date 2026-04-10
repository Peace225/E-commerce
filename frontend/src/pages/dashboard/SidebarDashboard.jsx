import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarDashboard({ 
  user, 
  wallet, 
  activePage, 
  setActivePage, 
  menuOpen, 
  setMenuOpen,
  handleLogout 
}) {
  
  // ✨ LOGIQUE D'IDENTITÉ DÉCOUPLÉE (Boutique vs Gérant)
  const shopName = wallet?.nom_boutique || "Boutique en attente";
  const managerName = wallet?.full_name || user?.user_metadata?.full_name || "Gérant";
  
  // 📸 RÉCUPÉRATION DES VISUELS
  const shopLogo = wallet?.logo_url || null; // URL du logo de la boutique
  const managerPhoto = user?.user_metadata?.avatar_url || wallet?.avatar_url; // Photo humaine
  
  const isSuperAdmin = wallet?.is_superadmin || user?.user_metadata?.is_superadmin || false;
  const shopStatus = wallet?.status || "pending";
  const initials = managerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  /**
   * 🔘 DÉPARTEMENTS BUSINESS (Intégrés directement ici comme demandé)
   * ⚠️ Les "id" ici correspondent EXACTEMENT au switch de ton Dashboard.jsx
   */
  const departments = [
    {
      title: "Pilotage",
      items: [
        { id: "accueil", label: "Aperçu Business", icon: <Icons.LayoutDashboard size={18} /> },
      ]
    },
    {
      title: "Commerce & Flux",
      items: [
        { id: "ma-boutique", label: "Ma Vitrine & Stock", icon: <Icons.Store size={18} /> },
        { id: "mes-commandes", label: "Flux Commandes", icon: <Icons.ShoppingBag size={18} /> },
      ]
    },
    {
      title: "Finance & Réseau",
      items: [
        { id: "wallet", label: "Trésorerie / Wallet", icon: <Icons.Wallet size={18} /> },
        { id: "mes-commissions", label: "Performances", icon: <Icons.TrendingUp size={18} /> },
        { id: "affiliation", label: "Réseau Partenaires", icon: <Icons.Users size={18} /> },
      ]
    },
    {
      title: "Excellence Rynek",
      items: [
        { id: "automatisation", label: "Outils IA & Auto", icon: <Icons.Zap size={18} /> },
        { id: "formation", label: "Académie Pro", icon: <Icons.GraduationCap size={18} /> },
      ]
    },
    {
      title: "Administration & Légal",
      items: [
        // ✅ Ajout de l'ID certification manquant
        { id: "certification", label: "Dossier de Vérification", icon: <Icons.ShieldCheck size={18} /> }, 
        { id: "parametres", label: "Configuration Pro", icon: <Icons.Settings size={18} /> },
      ]
    }
  ];

  // 🛡️ COMPOSANT : BADGE DE STATUT
  const StatusBadge = () => {
    const config = {
      approved: { bg: "bg-emerald-500/10", text: "text-emerald-500", icon: <Icons.CheckCircle2 size={10}/>, label: "Certifié" },
      pending: { bg: "bg-orange-500/10", text: "text-orange-500", icon: <Icons.Clock size={10} className="animate-spin" />, label: "En Audit" },
      rejected: { bg: "bg-red-500/10", text: "text-red-500", icon: <Icons.AlertCircle size={10}/>, label: "À corriger" }
    };
    const s = config[shopStatus] || config.pending;
    return (
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/5 ${s.bg}`}>
        {s.icon} <span className={`text-[7px] font-black uppercase tracking-widest ${s.text}`}>{s.label}</span>
      </div>
    );
  };

  return (
    <>
      <aside className="hidden lg:flex w-72 bg-slate-950 h-screen sticky top-0 flex-col p-6 text-white border-r border-white/5">
        
        {/* BRANDING */}
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
             <Icons.ShieldCheck size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            RYNEK<span className="text-orange-500 font-black">PRO</span>
          </h1>
        </div>

        {/* 👤 CARTE PROFIL DUAL PREMIUM (Boutique + Gérant) */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-5 mb-8 space-y-4 group relative overflow-hidden">
          <div className="flex flex-col gap-4 relative z-10">
            
            {/* Zone visuelle combinée */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* 1. Logo de la Boutique (Base carrée arrondie) */}
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden">
                   {shopLogo ? (
                     <img src={shopLogo} alt="Logo Boutique" className="w-full h-full object-cover" />
                   ) : (
                     <Icons.Store size={24} className="text-slate-300" />
                   )}
                </div>

                {/* 2. Photo du Gérant (Incrustée en bas à droite) */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-slate-950 overflow-hidden shadow-lg bg-orange-500 flex items-center justify-center">
                  {managerPhoto ? (
                    <img src={managerPhoto} alt="Gérant" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[8px] font-black">{initials}</span>
                  )}
                </div>
              </div>

              {/* Textes Identité */}
              <div className="min-w-0">
                 <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black uppercase truncate text-white leading-none">{shopName}</h3>
                 </div>
                 <div className="flex items-center gap-1 mt-1.5">
                    <p className="text-[9px] font-bold text-orange-500/80 uppercase truncate tracking-wide italic">Gérant: {managerName}</p>
                    {isSuperAdmin && <Icons.Crown size={10} className="text-yellow-500 shrink-0" />}
                 </div>
              </div>
            </div>

            {/* Badge de Statut & Certification */}
            <div className="flex items-center justify-between pt-1">
                <StatusBadge />
                {isSuperAdmin && (
                   <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                      <Icons.ShieldCheck size={8} className="text-yellow-500" />
                      <span className="text-[6px] font-black text-yellow-500 uppercase tracking-widest">SuperAdmin</span>
                   </div>
                )}
            </div>
          </div>
          
          <Icons.Store className="absolute -right-4 -bottom-4 text-white/5" size={80} />
        </div>

        {/* 🧭 NAVIGATION PAR DÉPARTEMENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-6 text-slate-300">
          {departments.map((dept, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="px-4 text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">{dept.title}</h4>
              <nav className="space-y-1">
                {dept.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)} // 👈 Change la page au clic
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
                      ${activePage === item.id 
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 font-black" 
                        : "hover:bg-white/5 hover:text-white font-medium"}`}
                  >
                    <span className={`${activePage === item.id ? "text-white" : "text-slate-500 group-hover:text-orange-500"} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    {activePage === item.id && (
                      <motion.div layoutId="pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* 🔴 SORTIE */}
        <div className="pt-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest group"
          >
            <Icons.LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* 📱 VERSION MOBILE (Optimisée Dual Profile) */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[200] lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25 }} className="absolute inset-y-0 left-0 w-80 bg-slate-950 p-6 flex flex-col shadow-2xl overflow-y-auto">
              
              <div className="flex justify-between items-center mb-8">
                <h1 className="italic font-black text-white text-xl uppercase tracking-tighter">RYNEK <span className="text-orange-500">PRO</span></h1>
                <button onClick={() => setMenuOpen(false)} className="text-slate-400 p-2"><Icons.X /></button>
              </div>

              {/* Dual Profile Mobile */}
              <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10 mb-8 flex items-center gap-4 shadow-xl">
                 <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex items-center justify-center">
                       {shopLogo ? <img src={shopLogo} className="w-full h-full object-cover" /> : <Icons.Store className="text-slate-300" />}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-slate-950 overflow-hidden bg-orange-500 flex items-center justify-center">
                       {managerPhoto ? <img src={managerPhoto} className="w-full h-full object-cover" /> : <span className="text-[8px] font-black text-white">{initials}</span>}
                    </div>
                 </div>
                 <div className="min-w-0">
                    <p className="text-xs font-black text-white uppercase truncate">{shopName}</p>
                    <p className="text-[8px] font-bold text-orange-500 uppercase tracking-widest mt-0.5 italic">{managerName}</p>
                 </div>
              </div>

              <nav className="space-y-6">
                {departments.map((dept, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] px-4">{dept.title}</h4>
                    {dept.items.map((item) => (
                      <button 
                        key={item.id} 
                        onClick={() => { setActivePage(item.id); setMenuOpen(false); }} // 👈 Change la page en mobile et ferme le menu
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl ${activePage === item.id ? "bg-orange-500 text-white shadow-lg" : "text-slate-400"}`}
                      >
                        {item.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </nav>

              <button onClick={handleLogout} className="mt-10 py-5 border-t border-white/5 flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                 <Icons.LogOut size={18}/> Déconnexion
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}