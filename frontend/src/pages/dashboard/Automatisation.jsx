import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient";

// 🔹 Composant Switch Premium (Look Apple/Rynek) - Redimensionné pour mobile
const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-14 shrink-0 items-center rounded-full transition-all duration-500 ease-in-out focus:outline-none shadow-inner ${
      enabled ? 'bg-orange-500 shadow-orange-500/40' : 'bg-slate-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 sm:h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-500 ease-in-out ${
        enabled ? 'translate-x-6 sm:translate-x-8' : 'translate-x-1'
      }`}
    />
  </button>
);

export default function Automatisation({ user }) {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // 🚀 ÉTATS : BOOSTERS DE VENTES
  const [boosters, setBoosters] = useState([
    { id: 1, nom: "Relance WhatsApp AI", desc: "Relance intelligente des paniers via WhatsApp Business.", icon: <Icons.MessageCircle size={18} className="sm:w-5 sm:h-5"/>, color: "text-emerald-500", bg: "bg-emerald-50", active: true },
    { id: 2, nom: "Upsell Prédictif", desc: "IA qui suggère le meilleur produit complémentaire.", icon: <Icons.Mail size={18} className="sm:w-5 sm:h-5"/>, color: "text-blue-500", bg: "bg-blue-50", active: false },
    { id: 3, nom: "Collecteur d'Avis", desc: "Demande automatique d'avis avec bonus fidélité.", icon: <Icons.Star size={18} className="sm:w-5 sm:h-5"/>, color: "text-yellow-500", bg: "bg-yellow-50", active: true },
  ]);

  const notify = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // 🔄 FETCH DATA (Simulé pour Supabase)
  useEffect(() => {
    setCommandes([
      { id: 1, produit: "Montre Connectée Z", fournisseur: "AliExpress", plateforme: "Shopify", statut: "En transit", prix: 15000, tracking: "TRK-849201" },
      { id: 2, produit: "Sneakers Urban", fournisseur: "CJdropshipping", plateforme: "WooCommerce", statut: "Livrée", prix: 22000, tracking: "TRK-552190" },
    ]);
  }, []);

  // ⚙️ LOGIQUE : SYNCHRONISATION MULTI-PLATEFORMES
  const handleSync = async () => {
    setLoading(true);
    setProgress(0);
    
    const steps = [15, 45, 75, 95, 100];
    for (const s of steps) {
      await new Promise(r => setTimeout(r, 400));
      setProgress(s);
    }

    notify("Synchronisation réussie sur 3 plateformes !");
    setLoading(false);
  };

  const toggleBooster = (id) => {
    setBoosters(boosters.map(b => b.id === id ? { ...b, active: !b.active } : b));
    const booster = boosters.find(b => b.id === id);
    notify(`${booster.nom} ${!booster.active ? 'activé' : 'désactivé'}`);
  };

  const commandesFiltrees = filterStatut === "Tous" ? commandes : commandes.filter(cmd => cmd.statut === filterStatut);

  return (
    <div className="space-y-6 sm:space-y-10 pb-20">
      
      {/* 🔹 TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[600] max-w-[calc(100vw-3rem)]">
            <div className="bg-slate-900 border border-white/10 p-3.5 md:p-5 rounded-2xl md:rounded-[2rem] shadow-2xl flex items-center gap-3 md:gap-4 text-white">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                <Icons.Zap size={16} className="md:w-5 md:h-5" />
              </div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-snug">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 HEADER SMART SYNC */}
      <header className="bg-[#0f172a] p-6 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-10">
          <div className="text-center lg:text-left space-y-2 sm:space-y-4">
            <div className="bg-orange-500/10 text-orange-500 w-fit px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest mx-auto lg:mx-0 border border-orange-500/20">
              Système de Synchronisation IA
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Auto-Pilote <span className="text-orange-500">& Sync</span>
            </h1>
            <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] max-w-lg italic opacity-80">
              Automatisez vos flux logistiques et activez vos leviers de croissance.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-[3rem] border border-white/10 w-full max-w-md flex flex-col items-center shadow-inner">
            {loading ? (
              <div className="w-full space-y-4 sm:space-y-6">
                <div className="flex justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-orange-500">
                  <span className="flex items-center gap-1.5"><Icons.Loader2 className="animate-spin" size={11}/> Sync...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 sm:h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-orange-600 to-orange-400" />
                </div>
              </div>
            ) : (
              <button 
                onClick={handleSync}
                className="w-full bg-white text-slate-900 hover:bg-orange-500 hover:text-white px-4 py-3.5 sm:px-8 sm:py-5 rounded-xl sm:rounded-[1.5rem] transition-all active:scale-95 shadow-xl font-black uppercase text-[10px] sm:text-[11px] tracking-wider sm:tracking-widest flex items-center justify-center gap-2 group"
              >
                <Icons.RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-700 sm:w-4 sm:h-4" /> 
                Lancer la Sync Globale
              </button>
            )}
          </div>
        </div>
        <Icons.CircuitBoard className="absolute -left-10 -bottom-10 text-white/5 rotate-12 hidden sm:block" size={300} />
      </header>

      {/* 🔹 GRID : PLATEFORMES & BOOSTERS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        
        {/* Intégrations Plateformes */}
        <div className="xl:col-span-1 bg-white rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
             <h3 className="font-black uppercase text-[10px] sm:text-xs tracking-wider sm:tracking-[0.2em] text-slate-900 mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
               <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0"><Icons.Link size={14} className="sm:w-4 sm:h-4" /></div>
               Canaux Connectés
             </h3>
             <div className="space-y-2 sm:space-y-4">
               {["Shopify", "WooCommerce", "AliExpress"].map((p, i) => (
                 <div key={i} className="flex items-center justify-between p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-500/30 transition-all cursor-pointer group">
                   <span className="font-black text-[11px] sm:text-xs text-slate-700 uppercase tracking-tight">{p}</span>
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[7px] sm:text-[8px] font-black text-emerald-600 uppercase">Actif</span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
           <button className="mt-4 sm:mt-6 md:mt-8 w-full py-3 sm:py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl sm:rounded-2xl font-black uppercase text-[8px] sm:text-[9px] tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all">
             + Ajouter une API
           </button>
        </div>

        {/* Boosters de Ventes */}
        <div className="xl:col-span-2 bg-white rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-10 border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-10">
             <h3 className="font-black uppercase text-[10px] sm:text-xs tracking-wider sm:tracking-[0.2em] text-slate-900 flex items-center gap-2 sm:gap-3">
               <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0"><Icons.Rocket size={14} className="sm:w-4 sm:h-4" /></div>
               Boosters IA & Marketing
             </h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
             {boosters.map((b) => (
               <motion.div 
                 whileHover={{ y: -3 }}
                 key={b.id} 
                 className={`p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border transition-all ${b.active ? 'border-orange-500/20 bg-orange-50/20 shadow-lg shadow-orange-500/5' : 'border-slate-50 bg-slate-50/50'}`}
               >
                 <div className="flex justify-between items-start mb-4 sm:mb-6">
                   <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${b.bg} ${b.color} shadow-sm shrink-0`}>{b.icon}</div>
                   <ToggleSwitch enabled={b.active} onChange={() => toggleBooster(b.id)} />
                 </div>
                 <h4 className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-tight mb-1 sm:mb-2">{b.nom}</h4>
                 <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider sm:tracking-widest">{b.desc}</p>
               </motion.div>
             ))}
           </div>
        </div>

      </div>

      {/* 🔹 FLUX LOGISTIQUE */}
      <div className="bg-white rounded-2xl sm:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 bg-slate-50/30">
          <h3 className="font-black uppercase text-[10px] sm:text-xs tracking-wider sm:tracking-[0.2em] text-slate-900 flex items-center gap-2 sm:gap-3">
            <Icons.Truck size={16} className="text-slate-400 sm:w-[18px] sm:h-[18px]" /> Centre Logistique Automatisé
          </h3>
          <div className="flex gap-1 p-1 bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-x-auto max-w-full whitespace-nowrap">
            {["Tous", "En attente", "En transit", "Livrée"].map((statut) => (
              <button
                key={statut}
                onClick={() => setFilterStatut(statut)}
                className={`px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest transition-all
                  ${filterStatut === statut ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-900"}`}
              >
                {statut}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[550px] md:min-w-full">
            <thead>
              <tr className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] bg-slate-50/30 border-b border-slate-50">
                <th className="p-4 sm:p-8">Colis & Tracking</th>
                <th className="p-4 sm:p-8">Origine</th>
                <th className="p-4 sm:p-8">Valorisation</th>
                <th className="p-4 sm:p-8 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {commandesFiltrees.map((cmd) => (
                  <motion.tr 
                    layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    key={cmd.id} className="hover:bg-slate-50/50 transition-colors group cursor-default"
                  >
                    <td className="p-4 sm:p-8">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 text-orange-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                          <Icons.Box size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-slate-900 uppercase text-[11px] sm:text-xs truncate">{cmd.produit}</span>
                          <span className="text-[8px] sm:text-[10px] text-orange-500 font-bold tracking-wider mt-0.5 font-mono uppercase">{cmd.tracking}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-8">
                       <p className="text-[9px] sm:text-[10px] font-black text-slate-800 uppercase tracking-wider">{cmd.plateforme}</p>
                       <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 italic">via {cmd.fournisseur}</p>
                    </td>
                    <td className="p-4 sm:p-8 text-slate-900 font-black text-xs sm:text-sm italic">
                      {cmd.prix.toLocaleString()} <small className="text-[9px] sm:text-[10px] opacity-50 not-italic uppercase">F</small>
                    </td>
                    <td className="p-4 sm:p-8 text-right">
                      <span className={`px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[7px] sm:text-[8px] font-black uppercase tracking-wider sm:tracking-widest border whitespace-nowrap
                        ${cmd.statut === 'Livrée' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          cmd.statut === 'En transit' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {cmd.statut}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}