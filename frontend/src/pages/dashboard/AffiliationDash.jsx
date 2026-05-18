import { useState, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient"; 

export default function AffiliationDash({ wallet, user }) {
  const [filleuls, setFilleuls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // 🔔 Notification Système
  const notify = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // 🔄 1. SYNC SUPABASE & TEMPS RÉEL
  useEffect(() => {
    if (!wallet?.referralCode) {
      setLoading(false);
      return;
    }

    const fetchFilleuls = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles') 
          .select('*')
          .eq('referred_by', wallet.referralCode) 
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFilleuls(data || []);
      } catch (err) {
        console.error("Erreur réseau:", err);
        notify("Impossible de synchroniser le réseau.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchFilleuls();

    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'profiles', filter: `referred_by=eq.${wallet.referralCode}` }, 
        (payload) => {
          setFilleuls(prev => [payload.new, ...prev]);
          notify("Nouveau membre rejoint votre réseau ! 👑");
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [wallet]);

  // 🔗 2. LOGIQUE DE PARTAGE
  const copyLink = () => {
    const link = `https://rynek.com/register?ref=${wallet?.referralCode}`;
    navigator.clipboard.writeText(link);
    notify("Lien ambassadeur copié ! Prêt pour le partage.");
  };

  // 📊 3. CALCULS KPIs
  const conversionRate = useMemo(() => {
    if (!wallet?.total_clicks) return "0%";
    return ((filleuls.length / wallet.total_clicks) * 100).toFixed(1) + "%";
  }, [filleuls, wallet]);

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4 md:space-y-6">
      <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-400 animate-pulse text-center px-4">Architecture du réseau en cours...</p>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      
      {/* 🔹 TOAST NOTIFICATION PRESTIGE */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[600] max-w-[calc(100vw-3rem)]">
            <div className="bg-slate-900 border border-white/10 p-3.5 md:p-5 rounded-2xl md:rounded-[2rem] shadow-2xl flex items-center gap-3 md:gap-4 text-white">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                <Icons.UserPlus size={16} className="md:w-5 md:h-5" />
              </div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-snug">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 🔹 HEADER RÉSEAU */}
      <header className="bg-[#0f172a] p-6 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-10">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Network <span className="text-orange-500">Center</span>
            </h1>
            <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.25em] md:tracking-[0.4em] mt-2 md:mt-4 italic opacity-60">
              Système d'expansion Life Shop v2.1
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-white/10 w-full max-w-md shadow-inner">
            <div className="flex justify-between items-center mb-2.5 md:mb-4">
               <p className="text-[8px] md:text-[9px] font-black text-orange-500 uppercase tracking-[0.2em]">Votre clé d'accès</p>
               <Icons.ShieldCheck size={14} className="text-emerald-500 md:w-4 md:h-4" />
            </div>
            <div className="flex items-center gap-2 bg-black/40 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-white/5">
              <span className="flex-1 text-xs sm:text-sm font-black text-white tracking-[0.2em] sm:tracking-[0.3em] pl-1 truncate">
                {wallet?.referralCode}
              </span>
              <button 
                onClick={copyLink}
                className="bg-white text-slate-900 hover:bg-orange-500 hover:text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                <Icons.Copy size={12} className="sm:w-4 sm:h-4" />
                <span className="text-[8px] sm:text-[9px] font-black uppercase">Copier</span>
              </button>
            </div>
          </div>
        </div>
        <Icons.Network size={200} className="absolute -left-20 -bottom-20 text-white/5 rotate-12 pointer-events-none hidden sm:block" />
      </header>

      {/* 🔹 KPIs DU RÉSEAU */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:grid-cols-3 md:gap-6">
        {[
          { label: "Membres Directs", val: filleuls.length, icon: <Icons.Users size={18} />, color: "text-blue-500", desc: "Ambassadeurs actifs" },
          { label: "Taux de Conversion", val: conversionRate, icon: <Icons.Zap size={18} />, color: "text-orange-500", desc: "Efficacité du lien" },
          { label: "Gains Générés", val: `${(wallet?.referralEarnings || 0).toLocaleString()} F`, icon: <Icons.TrendingUp size={18} />, color: "text-emerald-500", desc: "Commissions cumulées" },
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-orange-500/30 transition-all shadow-sm"
          >
            <div>
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">{item.label}</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{item.val}</h3>
              <p className="text-[7px] md:text-[8px] font-bold text-slate-300 uppercase mt-1 md:mt-2">{item.desc}</p>
            </div>
            <div className={`${item.color} bg-slate-50 p-3.5 sm:p-4 md:p-5 rounded-xl md:rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shrink-0`}>
              {item.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🔹 LISTE DES AFFILIÉS DESIGN */}
      <div className="bg-white rounded-2xl md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black uppercase text-[10px] md:text-xs tracking-tight text-slate-900 flex items-center gap-2 md:gap-3">
            <Icons.ListTree size={16} className="text-orange-500 md:w-[18px] md:h-[18px]" /> Généalogie du Réseau
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px] md:min-w-full">
            <thead>
              <tr className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] border-b border-slate-50">
                <th className="p-4 md:p-8">Membre</th>
                <th className="p-4 md:p-8">Statut / Rang</th>
                <th className="p-4 md:p-8">Activité</th>
                <th className="p-4 md:p-8 text-right">Date d'entrée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filleuls.map((f, i) => (
                  <motion.tr 
                    layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    key={f.id} 
                    className="hover:bg-slate-50/50 transition-colors group cursor-default"
                  >
                    <td className="p-4 md:p-8">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#0f172a] text-orange-500 flex items-center justify-center font-black text-xs md:text-sm shadow-md group-hover:scale-105 transition-transform shrink-0">
                          {f.full_name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-slate-900 uppercase text-[11px] md:text-xs tracking-tight truncate">{f.full_name || "Ambassadeur"}</span>
                          <span className="text-[8px] md:text-[9px] text-slate-400 font-bold lowercase truncate mt-0.5">{f.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 md:p-8">
                      <span className="px-2.5 py-1 md:px-4 md:py-2 bg-slate-900 text-white rounded-lg md:rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-wider md:tracking-widest border border-white/10 shadow-sm whitespace-nowrap">
                        {f.rank || "Membre Bronze"}
                      </span>
                    </td>
                    <td className="p-4 md:p-8">
                       <div className="flex items-center gap-1.5">
                          <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase">Actif</span>
                       </div>
                    </td>
                    <td className="p-4 md:p-8 text-right">
                      <span className="text-slate-400 font-bold text-[11px] md:text-xs italic whitespace-nowrap">
                        {new Date(f.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filleuls.length === 0 && (
          <div className="p-12 sm:p-24 text-center">
            <Icons.UserPlus size={36} className="mx-auto text-slate-200 mb-4 sm:mb-6 md:w-12 md:h-12" />
            <h4 className="text-slate-900 font-black uppercase text-[11px] md:text-xs mb-1 sm:mb-2 italic tracking-tighter">Expansion requise</h4>
            <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
              Votre réseau est actuellement en attente de nouveaux talents. Partagez votre lien d'accès.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}