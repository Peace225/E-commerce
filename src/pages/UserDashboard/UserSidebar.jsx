import { Package, Heart, MapPin, Settings, Wallet, Share2, Gift, LogOut } from "lucide-react";

export default function UserSidebar({ activeTab, setActiveTab, user, handleLogout }) {
  // 📋 Liste complète des onglets de l'espace client
  const menuItems = [
    { name: "Mes Commandes", icon: <Package size={18} /> },
    { name: "Mon Wallet", icon: <Wallet size={18} /> },
    { name: "Affiliation", icon: <Share2 size={18} /> },
    { name: "Commissions & Bons", icon: <Gift size={18} /> },
    { name: "Mes Favoris", icon: <Heart size={18} /> },
    { name: "Mes Adresses", icon: <MapPin size={18} /> },
    { name: "Mon Profil", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-full md:w-[280px] flex-shrink-0 space-y-4 font-['Inter',sans-serif]">
      
      {/* 🟢 CARTE PROFIL UTILISATEUR */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm text-center border border-gray-100 relative overflow-hidden">
        {/* Décoration de fond */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-orange-400 to-orange-600 opacity-20"></div>
        
        {/* Avatar avec la première lettre du nom */}
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black relative z-10 border-4 border-white shadow-md uppercase">
          {user?.displayName ? user.displayName.charAt(0) : "U"}
        </div>
        
        {/* Infos Utilisateur */}
        <h3 className="font-black uppercase text-sm tracking-tighter relative z-10 text-gray-900 leading-tight">
          {user?.displayName || "Client Rynek"}
        </h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase relative z-10 mb-4 truncate px-2">
          {user?.email}
        </p>

        {/* Badge Affilié (Pour motiver au partage) */}
        <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[9px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Compte Affilié Actif
        </div>
      </div>

      {/* 🟢 MENU DE NAVIGATION (Boutons) */}
      <nav className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 space-y-1.5">
        {menuItems.map((item, i) => {
          const isActive = activeTab === item.name;
          
          return (
            <button 
              key={i} 
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${
                isActive 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 translate-x-1' 
                  : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <span className={`transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`}>
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
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut size={18} className="text-red-400 group-hover:text-red-600 transition-colors" />
            Déconnexion
          </button>
        </div>
      </nav>
      
    </aside>
  );
}