import { memo, useMemo, useCallback } from "react";
import {
  Package, Heart, MapPin, Settings, Wallet,
  Share2, Gift, LogOut, LayoutDashboard
} from "lucide-react";

const MENU_ITEMS = [
  { name: "Tableau de Bord", Icon: LayoutDashboard },
  { name: "Mes Commandes", Icon: Package },
  { name: "Mon Wallet", Icon: Wallet },
  { name: "Affiliation", Icon: Share2 },
  { name: "Commissions & Bons", Icon: Gift },
  { name: "Mes Favoris", Icon: Heart },
  { name: "Mes Adresses", Icon: MapPin },
  { name: "Mon Profil", Icon: Settings },
];

function UserSidebarBase({ activeTab, setActiveTab, user, userData, handleLogout }) {
  const userInitials = useMemo(() =>
    userData?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U",
    [userData?.full_name, user?.email]
  );

  const onTabClick = useCallback((name) => () => setActiveTab(name), [setActiveTab]);

  return (
    <aside className="w-full md:w-80 flex-shrink-0 font-['Inter',sans-serif] [contain:layout_style]">

      {/* CARTE PROFIL : Uniquement sur Desktop */}
      <div className="hidden md:block bg-white p-6 rounded-[2.5rem] shadow-sm text-center border border-gray-100 relative overflow-hidden mb-4">
        <div className="absolute top-0 left-0 w-full h-24 bg-primary/10"></div>

        <div className="w-24 h-24 bg-white rounded-[2.2rem] flex items-center justify-center mx-auto mb-4 relative z-10 border-4 border-white shadow-xl overflow-hidden">
          {userData?.avatar_url ? (
            <img
              src={userData.avatar_url}
              alt="Profil Rynek"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width="96"
              height="96"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black uppercase">
              {userInitials}
            </div>
          )}
        </div>

        <div className="relative z-10 space-y-1">
          <h3 className="font-black uppercase text-sm tracking-tighter text-gray-900 leading-tight">
            {userData?.full_name || "Client Rynek"}
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase truncate px-4">
            {user?.email}
          </p>
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-4 py-2 rounded-full tracking-widest shadow-sm relative z-10">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Compte Elite Actif
        </div>
      </div>

      {/* BARRE DE NAVIGATION */}
      {/* Mobile : Fixée tout en bas, surélevée par un shadow-2xl et un léger flou arrière-plan */}
      {/* Desktop : Menu vertical classique intégré au flux */}
      <nav className="
        fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-4 py-3 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] border-t border-gray-100
        flex flex-row overflow-x-auto whitespace-nowrap scrollbar-none space-x-2
        md:relative md:bottom-auto md:left-auto md:right-auto md:z-0 md:bg-white md:backdrop-blur-none md:p-4 md:rounded-[2.5rem] md:shadow-sm md:border md:flex-col md:space-x-0 md:space-y-1.5 md:overflow-x-visible md:whitespace-normal
      ">
        
        {MENU_ITEMS.map(({ name, Icon }) => {
          const isActive = activeTab === name;

          return (
            <button
              key={name}
              onClick={onTabClick(name)}
              className={`flex items-center gap-2 md:gap-4 px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl 
                          text-xs font-black uppercase tracking-widest transition-all duration-200 flex-shrink-0 ${
                isActive
                  ? 'bg-primary text-theme-text shadow-md md:shadow-lg shadow-primary/20'
                  : 'text-gray-500 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-theme-text' : 'text-gray-400'} />
              <span>{name}</span>
            </button>
          );
        })}

        {/* BOUTON DECONNEXION */}
        <div className="flex items-center pl-2 border-l border-gray-100 md:border-l-0 md:border-t md:pt-3 md:mt-3 md:pl-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 md:gap-4 px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl 
                        text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
          >
            <LogOut size={16} className="text-red-400" />
            <span>Quitter</span>
          </button>
        </div>
      </nav>
      
      {/* PADDING FANTÔME POUR MOBILE : Évite que la barre fixe ne cache le bas du contenu de la page */}
      <div className="h-24 md:hidden" />
    </aside>
  );
}

export default memo(UserSidebarBase);