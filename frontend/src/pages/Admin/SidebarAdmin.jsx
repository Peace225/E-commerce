import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

// 🛡️ Ajout de la prop 'auditBadge' transmise par AdminDashboard
export default function SidebarAdmin({ menuOpen, setMenuOpen, handleLogout, withdrawalsBadge, auditBadge }) {
  const location = useLocation();

  /**
   * 🔘 CONFIGURATION DES LIENS ADMIN
   */
  const adminMenuItems = [
    { path: "/admin", label: "Vue d'ensemble", icon: <Icons.Activity size={20} /> },
    { path: "/admin/users", label: "Utilisateurs", icon: <Icons.Users size={20} /> },
    { path: "/admin/boutiques", label: "Boutiques", icon: <Icons.Store size={20} /> },
    { path: "/admin/produits", label: "Catalogue", icon: <Icons.Package size={20} /> }, 
    { path: "/admin/commandes", label: "Commandes", icon: <Icons.ShoppingBag size={20} /> },
    { path: "/admin/commissions", label: "Commissions", icon: <Icons.TrendingUp size={20} /> },
    { path: "/admin/finances", label: "Trésorerie", icon: <Icons.Banknote size={20} />, badge: withdrawalsBadge }, 
    { path: "/admin/parametres", label: "Paramètres", icon: <Icons.Settings size={20} /> },
    { path: "/admin/support", label: "Support SAV", icon: <Icons.LifeBuoy size={20} /> },
    // 🚨 Ajout du badge d'alerte en temps réel pour la sécurité
    { path: "/admin/logs", label: "Audit & Logs", icon: <Icons.ShieldAlert size={20} />, badge: auditBadge }, 
    { path: "/admin/marketing", label: "Marketing", icon: <Icons.Megaphone size={20} /> },
  ];

  return (
    <>
      {/* 🖥️ VERSION DESKTOP */}
      <aside className="hidden lg:flex w-72 bg-[#020617] h-screen sticky top-0 flex-col p-6 text-slate-400 border-r border-white/5">
        <div className="mb-10 px-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg shadow-lg shadow-red-600/30 flex items-center justify-center">
            <Icons.ShieldCheck size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter italic uppercase text-white">
            RYNEK <span className="text-red-600 text-sm">ADMIN</span>
          </h1>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pb-4">
          {adminMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                  ${isActive 
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20 font-black" 
                    : "hover:bg-white/5 hover:text-white font-bold"}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`${isActive ? "text-white" : "text-slate-600 group-hover:text-red-500"} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Affichage du Badge si supérieur à 0 */}
                  {item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black shadow-md ${isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                  {/* Point indicateur actif */}
                  {isActive && (
                    <motion.div layoutId="admin-nav-pill" className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* ZONE RETOUR SITE */}
        <div className="pt-6 border-t border-white/5 mt-auto">
          <Link 
            to="/" /* 🔄 Corrigé : Pointe vers l'accueil public au lieu de l'espace vendeur */
            className="w-full flex items-center gap-4 px-4 py-4 text-slate-500 hover:bg-white/5 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest group"
          >
            <Icons.ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Retour au Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest group mt-2"
          >
            <Icons.LogOut size={18} />
            Quitter God Mode
          </button>
        </div>
      </aside>

      {/* 📱 VERSION MOBILE (Menu Slide) */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[250] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              className="absolute inset-y-0 left-0 w-80 bg-[#020617] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <Icons.ShieldCheck size={16} className="text-white" />
                  </div>
                  <h1 className="italic font-black text-white text-xl uppercase tracking-tighter">RYNEK ADMIN</h1>
                </div>
                <button onClick={() => setMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors"><Icons.X /></button>
              </div>
              
              <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                {adminMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl ${isActive ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-slate-500 font-bold hover:bg-white/5"}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={isActive ? "text-white" : "text-slate-600"}>{item.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                      {item.badge > 0 && (
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* RETOUR ET DECONNEXION MOBILE */}
              <div className="pt-6 border-t border-white/5 mt-auto">
                <Link 
                  to="/" 
                  className="w-full flex items-center gap-4 px-4 py-4 text-slate-500 hover:bg-white/5 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest"
                >
                  <Icons.Home size={18} />
                  Accueil Public
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest mt-2">
                  <Icons.LogOut size={18} />
                  Verrouiller Session
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}