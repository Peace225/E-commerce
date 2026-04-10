import { useState } from "react";
import { 
  Wallet, Users, TrendingUp, Award, 
  Zap, Copy, Heart, BarChart3, Star, Crown,
  Lightbulb, Store, GraduationCap, X, ArrowRight,
  ShieldCheck, Truck, AlertCircle, CheckCircle2,
  TrendingDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHome({ wallet, user }) {
  
  // 🔹 ÉTAT DU GUIDE BUSINESS
  const [showGuide, setShowGuide] = useState(() => {
    return localStorage.getItem("rynekProGuideHidden") !== "true";
  });

  const dismissGuide = () => {
    setShowGuide(false);
    localStorage.setItem("rynekProGuideHidden", "true");
  };

  // ✨ IDENTITÉ
  const rawName = wallet?.full_name || user?.user_metadata?.full_name || "Partenaire";
  const firstName = rawName.split(' ')[0];

  // 📊 LOGIQUE DES COMMISSIONS (PILIER 1)
  // On simule/récupère le CA mensuel. Dans la DB, ce serait wallet.monthly_revenue
  const caMensuel = wallet?.monthly_revenue || 0; 
  
  const getCommissionData = (ca) => {
    if (ca >= 1000000) return { rate: "5%", label: "ÉLITE", next: null, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (ca >= 100000) return { rate: "8%", label: "PRO", next: 1000000, color: "text-orange-500", bg: "bg-orange-500/10" };
    return { rate: "10%", label: "DÉCOUVERTE", next: 100000, color: "text-blue-500", bg: "bg-blue-500/10" };
  };

  const comm = getCommissionData(caMensuel);
  const progressToNextComm = comm.next ? (caMensuel / comm.next) * 100 : 100;

  // 🛡️ LOGIQUE DU SCORE DE CONFIANCE (PILIER 2)
  const trustScore = wallet?.trust_score || 0;

  // 🏆 RÉCOMPENSES (PILIER 3)
  const rewards = [
    { pts: 1000, label: "Badge Vendeur Fiable", icon: <ShieldCheck size={16} />, active: trustScore >= 1000 },
    { pts: 3000, label: "3 Produits Sponsorisés", icon: <Zap size={16} />, active: trustScore >= 3000 },
    { pts: 10000, label: "Pass Rynek Premium", icon: <Crown size={16} />, active: trustScore >= 10000 },
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* 🔹 BANNIÈRE STRATÉGIQUE : RENTABILITÉ & VISION */}
      <section className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 ${comm.bg}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${comm.color.replace('text', 'bg')}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${comm.color}`}>Niveau {comm.label}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
              Générez plus de profits, <br/>
              <span className="text-orange-500">{firstName}</span>.
            </h1>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
               <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
                  <TrendingUp size={20} className="text-white" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commission actuelle</p>
                  <p className="text-xl font-black text-white">{comm.rate} <span className="text-xs font-medium text-slate-500 tracking-normal italic ml-2">sur chaque vente</span></p>
               </div>
            </div>
          </motion.div>

          {/* Jauge de progression vers la réduction de frais */}
          {comm.next && (
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-xs font-black uppercase tracking-widest">Objectif Frais Réduits</p>
                <p className="text-orange-500 font-black text-sm">{Math.round(progressToNextComm)}%</p>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${progressToNextComm}%` }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Vendez encore <span className="text-white font-bold">{(comm.next - caMensuel).toLocaleString()} FCFA</span> pour passer à un taux de commission de <span className="text-emerald-400 font-bold">{caMensuel >= 100000 ? "5%" : "8%"}</span>.
              </p>
            </div>
          )}
        </div>
        <BarChart3 className="absolute -right-20 -top-20 text-white/5 rotate-12" size={400} />
      </section>

      {/* 🔹 STATS BUSINESS & RÉPUTATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Chiffre d'Affaires */}
        <div className="bg-white p-7 rounded-[2.2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all">
          <div className="flex justify-between mb-8">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all"><Wallet size={24} /></div>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase">Solde Net</span>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{(wallet?.balance || 0).toLocaleString()} <span className="text-xs text-slate-400">FCFA</span></p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Prêt pour retrait</p>
          </div>
        </div>

        {/* Score de Confiance (Gamification B2B) */}
        <div className="bg-white p-7 rounded-[2.2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all">
          <div className="flex justify-between mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all"><ShieldCheck size={24} /></div>
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase italic tracking-tighter">Score Rynek</span>
                {trustScore < 0 && <span className="text-[8px] text-red-500 font-bold mt-1 animate-pulse">Risque de suspension</span>}
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{trustScore.toLocaleString()} <span className="text-xs text-slate-400 font-bold">PTS</span></p>
            <div className="flex items-center gap-1 mt-2">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Réputation : {trustScore > 2000 ? "Excellente" : "Standard"}</p>
            </div>
          </div>
        </div>

        {/* Expédition Rapide */}
        <div className="bg-white p-7 rounded-[2.2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all">
          <div className="flex justify-between mb-8">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all"><Truck size={24} /></div>
            <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg uppercase">Logistique</span>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">98%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Expéditions à temps (-24h)</p>
          </div>
        </div>
      </div>

      {/* 🔹 LOGIQUE ÉDUCATIVE : COMMENT GAGNER DES POINTS ? */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Roadmap des Récompenses */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                <Crown size={20} className="text-orange-500" /> Vos Avantages Business
              </h3>
              <div className="space-y-4">
                {rewards.map((reward, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${reward.active ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${reward.active ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {reward.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase tracking-wide ${reward.active ? 'text-emerald-900' : 'text-slate-500'}`}>{reward.label}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Requis : {reward.pts} PTS</p>
                      </div>
                    </div>
                    {reward.active ? <CheckCircle2 className="text-emerald-500" size={18} /> : <AlertCircle className="text-slate-300" size={18} />}
                  </div>
                ))}
              </div>
          </div>

          {/* Guide des Points (Éducatif) */}
          <div className="bg-orange-500 rounded-[3rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Boostez votre visibilité</h3>
                <div className="space-y-3">
                    {[
                        { text: "Expédier en -24h", pts: "+50", icon: <Zap size={14}/> },
                        { text: "Recevoir un avis 5★", pts: "+100", icon: <Star size={14}/> },
                        { text: "Mois sans litige", pts: "+500", icon: <ShieldCheck size={14}/> },
                        { text: "Annuler une vente", pts: "-200", icon: <TrendingDown size={14}/>, bad: true }
                    ].map((rule, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                {rule.icon} {rule.text}
                            </span>
                            <span className={`text-xs font-black ${rule.bad ? 'text-red-200' : 'text-emerald-200'}`}>{rule.pts} PTS</span>
                        </div>
                    ))}
                </div>
              </div>
              <Lightbulb className="absolute -right-10 -bottom-10 text-white/10" size={200} />
          </div>
      </div>

      {/* 🔹 ZONE DE CROISSANCE (AFFILIATION) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/5">
        <div className="space-y-2 text-center lg:text-left">
          <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center lg:justify-start gap-2">
            <Users size={12} fill="currentColor" /> Réseau de Partenaires
          </p>
          <h4 className="text-2xl font-black uppercase tracking-tighter">Parrainez d'autres vendeurs</h4>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Gagnez 1% de leur CA à vie sur Rynek</p>
        </div>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
           <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center justify-between gap-4 backdrop-blur-md min-w-[200px]">
              <code className="text-orange-500 font-black text-sm tracking-widest uppercase">
                {wallet?.referral_code || "RYNEK-PRO"}
              </code>
           </div>
           <button 
             onClick={() => {
               navigator.clipboard.writeText(`https://rynek.com/register?ref=${wallet?.referral_code || "RYNEK-PRO"}`);
               alert("Lien Partenaire copié ! 🚀");
             }}
             className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-orange-500/20"
           >
             <Copy size={16} /> Copier le lien pro
           </button>
        </div>
      </div>

    </div>
  );
}