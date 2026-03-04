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
  
  // Sécurité nom d'utilisateur
  const fullName = user?.displayName || wallet?.displayName || user?.email?.split('@')[0] || "Ambassadeur";
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  /**
   * 🔘 CONFIGURATION DES LIENS
   */
  const menuItems = [
    { id: "accueil", label: "Dashboard", icon: <Icons.LayoutDashboard size={20} /> },
    { id: "ma-boutique", label: "Ma Boutique", icon: <Icons.Store size={20} /> },
    { id: "mes-commandes", label: "Commandes", icon: <Icons.ShoppingBag size={20} /> },
    { id: "mes-commissions", label: "Commissions", icon: <Icons.TrendingUp size={20} /> },
    // 🔗 NOUVEAU LIEN : PORTEFEUILLE (WALLET)
    { id: "wallet", label: "Portefeuille", icon: <Icons.Wallet size={20} /> }, 
    { id: "affiliation", label: "Affiliation", icon: <Icons.Users size={20} /> }, 
    { id: "mes-bons", label: "Bons & Coupons", icon: <Icons.Ticket size={20} /> },
    { id: "automatisation", label: "Automatisation", icon: <Icons.Zap size={20} /> },
    { id: "formation", label: "Académie", icon: <Icons.GraduationCap size={20} /> },
    { id: "parametres", label: "Paramètres", icon: <Icons.Settings size={20} /> },
  ];

  return (
    <>
      {/* 🖥️ VERSION DESKTOP */}
      <aside className="hidden lg:flex w-72 bg-[#0f172a] h-screen sticky top-0 flex-col p-6 text-white border-r border-white/5">
        <div className="mb-10 px-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/30"></div>
          <h1 className="text-2xl font-black tracking-tighter italic uppercase">
            RYNEK<span className="text-orange-500">.</span>
          </h1>
        </div>

        {/* PROFIL CARD */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 mb-8 flex items-center gap-4 group transition-all">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-sm shadow-lg group-hover:rotate-6 transition-transform">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase truncate tracking-tight">{fullName}</p>
            <p className="text-[8px] font-bold text-orange-500 uppercase tracking-widest mt-1">
              PRO {wallet?.level || "Bronze"}
            </p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pb-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${activePage === item.id 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 font-black" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white font-bold"}`}
            >
              <div className="flex items-center gap-4">
                <span className={`${activePage === item.id ? "text-white" : "text-slate-500 group-hover:text-orange-500"} transition-colors`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {activePage === item.id && (
                <motion.div layoutId="nav-pill" className="w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="pt-6 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest group"
          >
            <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-all">
              <Icons.LogOut size={18} />
            </div>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* 📱 VERSION MOBILE (Menu Slide) */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[150] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-80 bg-[#0f172a] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <h1 className="italic font-black text-white text-xl uppercase">RYNEK.</h1>
                <button onClick={() => setMenuOpen(false)} className="text-slate-400"><Icons.X /></button>
              </div>
              <nav className="flex-1 space-y-2 overflow-y-auto pb-20">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActivePage(item.id); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl ${activePage === item.id ? "bg-orange-500 text-white" : "text-slate-400 font-bold"}`}
                  >
                    {item.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}