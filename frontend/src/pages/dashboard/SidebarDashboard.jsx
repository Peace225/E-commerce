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
  
  const shopName = wallet?.nom_boutique || "Boutique en attente";
  const managerName = wallet?.full_name || user?.user_metadata?.full_name || "Gérant";
  const shopLogo = wallet?.logo_url || null; 
  const managerPhoto = user?.user_metadata?.avatar_url || wallet?.avatar_url; 
  
  const isSuperAdmin = wallet?.is_superadmin || user?.user_metadata?.is_superadmin || false;
  const shopStatus = wallet?.status || "pending";
  const initials = managerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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
        { id: "certification", label: "Dossier de Vérification", icon: <Icons.ShieldCheck size={18} /> }, 
        { id: "parametres", label: "Configuration Pro", icon: <Icons.Settings size={18} /> },
      ]
    }
  ];

  const mobileNavItems = [
    { id: "accueil", label: "Aperçu", icon: <Icons.LayoutDashboard size={20} /> },
    { id: "ma-boutique", label: "Vitrine", icon: <Icons.Store size={20} /> },
    { id: "mes-commandes", label: "Commandes", icon: <Icons.ShoppingBag size={20} /> },
    { id: "wallet", label: "Wallet", icon: <Icons.Wallet size={20} /> },
  ];

  // 🛠️ FILTRAGE : Liste des IDs déjà présents dans la bottom bar
  const displayedMobileIds = mobileNavItems.map(item => item.id);

  // Génère les départements épurés pour le menu burger mobile
  const filteredDepartments = departments
    .map(dept => ({
      ...dept,
      items: dept.items.filter(item => !displayedMobileIds.includes(item.id))
    }))
    .filter(dept => dept.items.length > 0);

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
      {/* 💻 SIDERBAR DE BUREAU */}
      <aside className="hidden lg:flex w-72 bg-slate-950 h-screen sticky top-0 flex-col p-6 text-white border-r border-white/5">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
             <Icons.ShieldCheck size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            Life<span className="text-orange-500 font-black">Shop</span>
          </h1>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-5 mb-8 space-y-4 group relative overflow-hidden">
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden">
                   {shopLogo ? <img src={shopLogo} alt="Logo" className="w-full h-full object-cover" /> : <Icons.Store size={24} className="text-slate-300" />}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-slate-950 overflow-hidden shadow-lg bg-orange-500 flex items-center justify-center">
                  {managerPhoto ? <img src={managerPhoto} alt="Gérant" className="w-full h-full object-cover" /> : <span className="text-[8px] font-black">{initials}</span>}
                </div>
              </div>
              <div className="min-w-0">
                 <h3 className="text-xs font-black uppercase truncate text-white leading-none">{shopName}</h3>
                 <p className="text-[9px] font-bold text-orange-500/80 uppercase truncate tracking-wide mt-1.5 italic">Gérant: {managerName}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
                <StatusBadge />
            </div>
          </div>
          <Icons.Store className="absolute -right-4 -bottom-4 text-white/5" size={80} />
        </div>

        {/* Liste des menus */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-4 text-slate-300">
          {departments.map((dept, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="px-4 text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">{dept.title}</h4>
              <nav className="space-y-1">
                {dept.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${activePage === item.id ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 font-black" : "hover:bg-white/5 hover:text-white font-medium"}`}
                  >
                    <span className={`${activePage === item.id ? "text-white" : "text-slate-500 group-hover:text-orange-500"} transition-colors`}>{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* 🚪 BOUTON DÉCONNEXION DESKTOP (Fixé en bas de la sidebar) */}
        <div className="pt-4 border-t border-white/5 shrink-0">
          <button 
            onClick={handleLogout} 
            className="w-full py-3.5 flex items-center gap-4 px-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Icons.LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* 📱 BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-lg border-t border-white/5 z-[150] px-3 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {mobileNavItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button key={item.id} onClick={() => setActivePage(item.id)} className="flex-1 flex flex-col items-center justify-center h-full relative">
              <div className={`transition-all duration-300 ${isActive ? "text-orange-500 -translate-y-1" : "text-slate-400"}`}>{item.icon}</div>
              <span className={`text-[8px] font-black uppercase tracking-wider mt-1 ${isActive ? "text-white" : "text-slate-500"}`}>{item.label}</span>
              {isActive && <motion.div layoutId="activeIndicator" className="absolute bottom-1 w-5 h-0.5 bg-orange-500 rounded-full" />}
            </button>
          );
        })}
        <button onClick={() => setMenuOpen(true)} className="flex-1 flex flex-col items-center justify-center h-full text-slate-400">
          <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-300"><Icons.Menu size={18} /></div>
          <span className="text-[8px] font-black uppercase tracking-wider mt-1 text-slate-500">Menu</span>
        </button>
      </div>

      {/* 📱 🎯 BOTTOM SHEET MODAL (FILTRÉE) */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[200] lg:hidden flex flex-col justify-end">
            
            {/* Arrière-plan flouté sombre */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setMenuOpen(false)} 
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" 
            />
            
            {/* Le panneau qui monte depuis le bas */}
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="relative w-full max-h-[85vh] bg-slate-900 border-t border-white/10 rounded-t-[3rem] p-6 flex flex-col shadow-2xl z-10 overflow-y-auto no-scrollbar"
            >
              
              {/* Petite barre de contrôle visuelle supérieure (Style iOS) */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 shrink-0" onClick={() => setMenuOpen(false)} />

              <div className="flex justify-between items-center mb-6">
                <h1 className="italic font-black text-white text-lg uppercase tracking-tighter">Menu <span className="text-orange-500">Général</span></h1>
                <button onClick={() => setMenuOpen(false)} className="text-slate-400 bg-white/5 rounded-full p-2"><Icons.X size={16} /></button>
              </div>

              {/* Contenu de la navigation épuré et filtré */}
              <nav className="space-y-6 flex-grow">
                {filteredDepartments.map((dept, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">{dept.title}</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {dept.items.map((item) => (
                        <button 
                          key={item.id} 
                          onClick={() => { setActivePage(item.id); setMenuOpen(false); }}
                          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activePage === item.id ? "bg-orange-500 text-white font-black shadow-lg" : "text-slate-400 bg-white/[0.02] hover:bg-white/5"}`}
                        >
                          <span className={activePage === item.id ? "text-white" : "text-orange-500"}>{item.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <button onClick={handleLogout} className="mt-8 py-4 border-t border-white/5 flex items-center justify-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/5 rounded-xl">
                 <Icons.LogOut size={16}/> Déconnexion
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}