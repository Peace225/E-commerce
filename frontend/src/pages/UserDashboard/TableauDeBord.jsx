import { useNavigate } from "react-router-dom";
import { Wallet, Share2, Gift, ArrowRight, Package, TrendingUp, HelpCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function TableauDeBord({ user, userData, setActiveTab }) {
  const navigate = useNavigate();

  // Logique éducative : calcul du prochain palier
  const pointsToNextLevel = 500 - (userData?.bonus_balance % 500);
  const progressPercent = ((userData?.bonus_balance % 500) / 500) * 100;

  return (
    <div className="space-y-6 pb-10">
      
      {/* 1. HEADER DYNAMIQUE & ÉDUCATIF AVEC PHOTO DE PROFIL */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        {/* Section Profil & Bienvenue */}
        <div className="flex items-center gap-5">
          {/* Miniature Photo de profil Elite */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] overflow-hidden border-4 border-gray-50 bg-white flex-shrink-0 shadow-lg relative group">
             {userData?.avatar_url ? (
                <img 
                  src={userData.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
             ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
                  {userData?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
             )}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-gray-900 leading-tight">
              Salut, {userData?.full_name?.split(' ')[0] || "Champion"} ! 🚀
            </h2>
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full w-fit">
              <Star size={12} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-widest">Membre Rynek Elite</span>
            </div>
          </div>
        </div>

        {/* Barre de progression éducative */}
        <div className="flex-1 max-w-md w-full space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Objectif prochain bon d'achat</span>
            <span className="text-primary font-black">{userData?.bonus_balance % 500} / 500 PTS</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-primary shadow-[0_0_15px_rgba(var(--color-primary),0.5)]"
            />
          </div>
          <p className="text-[9px] text-gray-400 font-medium italic">Plus que {pointsToNextLevel} points pour débloquer un cadeau !</p>
        </div>

        {/* ✅ MODIFICATION ICI : navigate('/') */}
        <button 
          onClick={() => navigate('/')} 
          className="bg-primary text-theme-text px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 active:scale-95 whitespace-nowrap"
        >
          Shopping Now <ArrowRight size={18} />
        </button>
      </div>

      {/* 2. GRILLE DE STATS AVEC TOOLTIPS ÉDUCATIFS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Wallet */}
        <div 
          className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 relative group cursor-pointer overflow-hidden"
          onClick={() => setActiveTab("Mon Wallet")}
        >
          <div className="absolute -right-4 -top-4 text-primary/5 group-hover:text-primary/10 transition-colors">
            <Wallet size={120} />
          </div>
          <div className="bg-primary/10 p-4 rounded-2xl text-primary w-fit mb-4">
            <TrendingUp size={24} />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Argent disponible</p>
            <HelpCircle size={12} className="text-gray-300" title="Argent gagné via vos commissions" />
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">
            {userData?.balance?.toLocaleString() || 0} <span className="text-sm text-primary">FCFA</span>
          </p>
        </div>

        {/* Points */}
        <div 
          className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 relative group cursor-pointer overflow-hidden"
          onClick={() => setActiveTab("Commissions & Bons")}
        >
          <div className="absolute -right-4 -top-4 text-primary/5 group-hover:text-primary/10 transition-colors">
            <Gift size={120} />
          </div>
          <div className="bg-primary/10 p-4 rounded-2xl text-primary w-fit mb-4">
            <Star size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Points Fidélité</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">
            {userData?.bonus_balance || 0} <span className="text-sm text-primary">PTS</span>
          </p>
        </div>

        {/* Status Achats */}
        <div 
          className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 relative group cursor-pointer overflow-hidden"
          onClick={() => setActiveTab("Mes Commandes")}
        >
          <div className="absolute -right-4 -top-4 text-primary/5 group-hover:text-primary/10 transition-colors">
            <Package size={120} />
          </div>
          <div className="bg-primary/10 p-4 rounded-2xl text-primary w-fit mb-4">
            <Package size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Mes Achats</p>
          <div className="flex items-center gap-2 text-primary font-black text-sm uppercase italic">
            Suivre mes colis <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* 3. SECTION ÉDUCATIVE : "COMMENT ÇA MARCHE ?" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Affiliation Attractive */}
        <div className="bg-primary p-8 rounded-[3rem] text-theme-text relative overflow-hidden group shadow-2xl shadow-primary/30">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
            <Share2 size={300} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Devenez Apporteur d'Affaires</h4>
              <p className="text-sm opacity-90 font-medium max-w-xs">Gagnez jusqu'à 5% de commission sur chaque achat de vos amis.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-[9px] font-bold uppercase opacity-70">Votre Code</p>
                <p className="text-xl font-black tracking-widest">{userData?.referral_code || "RYNEK-PRO"}</p>
              </div>
              <button 
                onClick={() => setActiveTab("Affiliation")}
                className="bg-white text-primary px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
              >
                Partager & Gagner
              </button>
            </div>
          </div>
        </div>

        {/* Guide Éducatif Rapide */}
        <div className="bg-gray-900 p-8 rounded-[3rem] text-white space-y-6 border border-gray-800 shadow-2xl">
          <h4 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Star className="text-primary" size={20} /> Astuces Rynek
          </h4>
          <div className="space-y-4">
            {[
              { text: "1000 FCFA dépensés = 1 Point gagné", color: "bg-blue-500" },
              { text: "Un partage = 10 Points (limite 5/jour)", color: "bg-emerald-500" },
              { text: "500 Points = Un Bon d'achat de 2.500F", color: "bg-primary" }
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className={`w-2 h-2 rounded-full ${tip.color} group-hover:scale-150 transition-transform`} />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-300">{tip.text}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-800">
            <p className="text-[10px] text-gray-500 font-medium italic">Le saviez-vous ? Votre premier achat vous rapporte 3% de commission automatique !</p>
          </div>
        </div>

      </div>
    </div>
  );
}