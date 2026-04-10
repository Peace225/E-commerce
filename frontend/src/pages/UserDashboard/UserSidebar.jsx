import { Package, Heart, MapPin, Settings, Wallet, Share2, Gift, LogOut, LayoutDashboard } from "lucide-react";

export default function UserSidebar({ activeTab, setActiveTab, user, userData, handleLogout }) {
  // 📋 Liste complète des onglets de l'espace client
  const menuItems = [
    { name: "Tableau de Bord", icon: <LayoutDashboard size={18} /> },
    { name: "Mes Commandes", icon: <Package size={18} /> },
    { name: "Mon Wallet", icon: <Wallet size={18} /> },
    { name: "Affiliation", icon: <Share2 size={18} /> },
    { name: "Commissions & Bons", icon: <Gift size={18} /> },
    { name: "Mes Favoris", icon: <Heart size={18} /> },
    { name: "Mes Adresses", icon: <MapPin size={18} /> },
    { name: "Mon Profil", icon: <Settings size={18} /> },
  ];

  // On récupère l'initiale en forçant la majuscule pour faire plus propre
  const userInitials = 
    userData?.full_name?.charAt(0)?.toUpperCase() || 
    user?.email?.charAt(0)?.toUpperCase() || 
    "U";

  return (
    <aside className="w-full md:w-[280px] flex-shrink-0 space-y-4 font-['Inter',sans-serif]">
      
      {/* 🟢 CARTE PROFIL UTILISATEUR */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm text-center border border-gray-100 relative overflow-hidden group">
        {/* Décoration de fond dynamique */}
        <div className="absolute top-0 left-0 w-full h-24 bg-primary opacity-10 group-hover:opacity-15 transition-opacity duration-500"></div>
        
        {/* AVATAR DYNAMIQUE (Image ou Initiale) */}
        <div className="w-24 h-24 bg-white rounded-[2.2rem] flex items-center justify-center mx-auto mb-4 relative z-10 border-4 border-white shadow-xl overflow-hidden transition-transform duration-500 group-hover:scale-105">
          {userData?.avatar_url ? (
            <img 
              src={userData.avatar_url} 
              alt="Profil Rynek" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black uppercase">
              {userInitials}
            </div>
          )}
        </div>
        
        {/* Infos Utilisateur */}
        <div className="relative z-10 space-y-1">
          <h3 className="font-black uppercase text-sm tracking-tighter text-gray-900 leading-tight">
            {userData?.full_name || "Client Rynek"}
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase truncate px-4">
            {user?.email}
          </p>
        </div>

        {/* Badge de Statut */}
        <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-black uppercase px-4 py-2 rounded-full tracking-widest shadow-sm relative z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Compte Elite Actif
        </div>
      </div>

      {/* 🟢 MENU DE NAVIGATION (Boutons) */}
      <nav className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-1.5">
        {menuItems.map((item, i) => {
          const isActive = activeTab === item.name;
          
          return (
            <button 
              key={i} 
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                isActive 
                  ? 'bg-primary text-theme-text shadow-lg shadow-primary/20 translate-x-1' 
                  : 'text-gray-500 hover:bg-primary/5 hover:text-primary hover:translate-x-1'
              }`}
            >
              <span className={`transition-colors ${isActive ? 'text-theme-text' : 'text-gray-400'}`}>
                {item.icon}
              </span>
              {item.name}
            </button>
          );
        })}

        {/* 🔴 BOUTON DÉCONNEXION */}
        <div className="pt-3 mt-3 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut size={18} className="text-red-400 group-hover:text-red-600 transition-colors" />
            Quitter la session
          </button>
        </div>
      </nav>
      
    </aside>
  );
}