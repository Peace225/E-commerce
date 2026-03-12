import { useState, useEffect } from "react";
import { 
  Wallet, Users, TrendingUp, Award, 
  Zap, Copy, Heart, BarChart3, Star, Crown,
  Lightbulb, Store, GraduationCap, X, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHome({ wallet, user }) {
  
  // 🔹 ÉTAT DU GUIDE (Vérifie si l'utilisateur l'a déjà fermé dans le passé)
  const [showGuide, setShowGuide] = useState(() => {
    const isHidden = localStorage.getItem("rynekGuideHidden");
    return isHidden !== "true"; // Si "true", showGuide sera false
  });

  // 🔹 FONCTION POUR FERMER ET MÉMORISER
  const dismissGuide = () => {
    setShowGuide(false);
    localStorage.setItem("rynekGuideHidden", "true"); // Sauvegarde le choix dans le navigateur
  };

  // ✨ LOGIQUE DE PERSONNALISATION
  const rawName = user?.displayName || wallet?.displayName || user?.email?.split('@')[0] || "Ambassadeur";
  const firstWord = rawName.split(' ')[0];
  const firstName = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();

  // 📊 RÉCUPÉRATION DES STATISTIQUES
  const totalFilleuls = wallet?.referralCount || 0;
  const soldeActuel = wallet?.balance || 0;

  // 🏆 CONFIGURATION DES RANGS
  const ranks = [
    { name: "BRONZE", min: 0, next: 5, color: "text-orange-700", bg: "bg-orange-50", icon: <Award size={20} /> },
    { name: "ARGENT", min: 5, next: 15, color: "text-slate-500", bg: "bg-slate-50", icon: <Star size={20} /> },
    { name: "OR", min: 15, next: 50, color: "text-yellow-600", bg: "bg-yellow-50", icon: <Crown size={20} /> },
    { name: "DIAMANT", min: 50, next: 100, color: "text-blue-600", bg: "bg-blue-50", icon: <Zap size={20} /> },
  ];

  const currentRank = ranks.find(r => totalFilleuls >= r.min && (totalFilleuls < r.next || r.name === "DIAMANT")) || ranks[0];

  return (
    <div className="space-y-10 pb-10">
      
      {/* 🔹 BANNIÈRE DE BIENVENUE PERSONNALISÉE */}
      <section className="bg-[#0f172a] rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 space-y-4"
        >
          <div className="bg-orange-600 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-600/20">
            <Crown size={14} className="fill-white" /> Rang {currentRank.name}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Ravi de vous revoir, <br/>
            <span className="text-orange-500">{firstName}</span> ! 👋
          </h1>
          
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2 italic">
            Votre empire commercial progresse sur Rynek Pro.
          </p>
        </motion.div>
        
        <Wallet className="absolute -right-10 -bottom-10 text-white/5 rotate-12" size={300} />
      </section>

      {/* 🔹 GRILLE DE STATS EN TEMPS RÉEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-emerald-500/30 hover:shadow-xl transition-all cursor-default">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full tracking-widest uppercase border border-emerald-100">Solde Actif</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 truncate">
            {soldeActuel.toLocaleString()} <small className="text-sm font-bold opacity-30">FCFA</small>
          </h3>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-blue-500/30 hover:shadow-xl transition-all cursor-default">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full tracking-widest uppercase border border-blue-100">Équipe</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 truncate">
            {totalFilleuls} <small className="text-sm font-bold opacity-30">MEMBRES</small>
          </h3>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-orange-500/30 hover:shadow-xl transition-all cursor-default">
          <div className="flex justify-between items-start mb-6">
            <div className={`${currentRank.bg} ${currentRank.color} p-4 rounded-2xl group-hover:rotate-12 transition-transform`}>
              {currentRank.icon}
            </div>
            <span className={`text-[10px] font-black ${currentRank.color} ${currentRank.bg} px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100`}>Niveau</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter truncate">
            {currentRank.name}
          </h3>
        </div>
      </div>

      {/* 🔹 GUIDE DE DÉMARRAGE RAPIDE (ÉDUCATIF & INTELLIGENT) */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            className="bg-orange-50/50 border border-orange-100 rounded-[3rem] p-8 md:p-10 relative shadow-sm"
          >
            {/* Bouton pour fermer définitivement */}
            <button 
              onClick={dismissGuide}
              className="absolute top-6 right-6 p-2 bg-white text-slate-400 hover:text-orange-600 hover:bg-orange-100 rounded-full transition-colors shadow-sm"
              title="Masquer ce guide pour toujours"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <Lightbulb size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900">Guide de Démarrage</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Découvrez vos 4 piliers de croissance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-[2rem] border border-orange-100 shadow-sm hover:border-orange-300 transition-colors">
                <Store size={24} className="text-orange-500 mb-4" />
                <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 mb-2">1. Ma Boutique</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  C'est votre vitrine. Ajoutez des produits, gérez vos prix et suivez vos commandes en direct pour satisfaire vos clients.
                </p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-orange-100 shadow-sm hover:border-blue-300 transition-colors">
                <Zap size={24} className="text-blue-500 mb-4" />
                <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 mb-2">2. Logistique Auto</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Reliez vos fournisseurs (AliExpress, CJ) et laissez le système importer vos commandes sur pilote automatique.
                </p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-orange-100 shadow-sm hover:border-emerald-300 transition-colors">
                <Users size={24} className="text-emerald-500 mb-4" />
                <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 mb-2">3. Affiliation</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Partagez votre lien ambassadeur. Chaque personne inscrite via votre lien vous rapporte des commissions à vie.
                </p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-orange-100 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-colors">
                <div>
                  <GraduationCap size={24} className="text-purple-500 mb-4" />
                  <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 mb-2">4. Académie</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                    Formez-vous aux meilleures stratégies e-commerce avec nos vidéos exclusives pour exploser vos ventes.
                  </p>
                </div>
                {/* Bouton pour fermer définitivement */}
                <button onClick={dismissGuide} className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                  J'ai compris <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 OUTIL DE PARRAINAGE RAPIDE */}
      <div className="bg-gray-900 rounded-[3rem] p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-2 text-center lg:text-left">
          <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center lg:justify-start gap-2">
            <Heart size={12} className="fill-orange-500" /> Ambassadeur {firstName}
          </p>
          <h4 className="text-2xl font-black uppercase tracking-tighter">Développez votre réseau</h4>
        </div>
        
        <div className="relative z-10 w-full lg:w-auto flex flex-col sm:flex-row gap-4">
           <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 backdrop-blur-md">
              <code className="text-orange-500 font-black text-sm tracking-widest truncate">
                {wallet?.referralCode || "RYNEK-PRO"}
              </code>
           </div>
           <button 
             onClick={() => {
               const link = `https://rynek.com/register?ref=${wallet?.referralCode || "RYNEK-PRO"}`;
               navigator.clipboard.writeText(link);
               alert("Votre lien ambassadeur a été copié ! 🚀");
             }}
             className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group"
           >
             <Copy size={18} className="group-hover:scale-110 transition-transform" /> Copier mon lien
           </button>
        </div>
        
        <BarChart3 className="absolute -left-10 -bottom-10 text-white/5 rotate-12" size={200} />
      </div>

    </div>
  );
}