import { useState, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient"; // 👈 Migration Supabase

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
          .from('profiles') // On suppose que tes users sont dans 'profiles'
          .select('*')
          .eq('referred_by', wallet.referralCode) // Format snake_case SQL
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

    // Inscription au canal Realtime pour voir les nouveaux filleuls en direct
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
    // Logique fictive : on imagine que tu as un nombre de clics dans wallet
    if (!wallet?.total_clicks) return "0%";
    return ((filleuls.length / wallet.total_clicks) * 100).toFixed(1) + "%";
  }, [filleuls, wallet]);

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-6">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Architecture du réseau en cours...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      
      {/* 🔹 TOAST NOTIFICATION PRESTIGE */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 right-10 z-[600]">
            <div className="bg-slate-900 border border-white/10 p-5 rounded-[2rem] shadow-2xl flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center">
                <Icons.UserPlus size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 🔹 HEADER RÉSEAU */}
      <header className="bg-[#0f172a] p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Network <span className="text-orange-500">Center</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4 italic opacity-60">
              Système d'expansion Rynek Pro v2.1
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 w-full max-w-md shadow-inner">
            <div className="flex justify-between items-center mb-4">
               <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em]">Votre clé d'accès</p>
               <Icons.ShieldCheck size={16} className="text-emerald-500" />
            </div>
            <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/5">
              <span className="flex-1 text-sm font-black text-white tracking-[0.3em] pl-2">
                {wallet?.referralCode}
              </span>
              <button 
                onClick={copyLink}
                className="bg-white text-slate-900 hover:bg-orange-500 hover:text-white px-5 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-2"
              >
                <Icons.Copy size={16} />
                <span className="text-[9px] font-black uppercase">Copier</span>
              </button>
            </div>
          </div>
        </div>
        <Icons.Network size={300} className="absolute -left-20 -bottom-20 text-white/5 rotate-12 pointer-events-none" />
      </header>

      {/* 🔹 KPIs DU RÉSEAU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Membres Directs", val: filleuls.length, icon: <Icons.Users />, color: "text-blue-500", desc: "Ambassadeurs actifs" },
          { label: "Taux de Conversion", val: conversionRate, icon: <Icons.Zap />, color: "text-orange-500", desc: "Efficacité du lien" },
          { label: "Gains Générés", val: `${(wallet?.referralEarnings || 0).toLocaleString()} F`, icon: <Icons.TrendingUp />, color: "text-emerald-500", desc: "Commissions cumulées" },
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-orange-500/30 transition-all shadow-sm"
          >
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{item.val}</h3>
              <p className="text-[8px] font-bold text-slate-300 uppercase mt-2">{item.desc}</p>
            </div>
            <div className={`${item.color} bg-slate-50 p-5 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-500`}>
              {item.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🔹 LISTE DES AFFILIÉS DESIGN */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black uppercase text-xs tracking-tighter text-slate-900 flex items-center gap-3">
            <Icons.ListTree size={18} className="text-orange-500" /> Généalogie du Réseau
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Membre</th>
                <th className="p-8">Statut / Rang</th>
                <th className="p-8">Activité</th>
                <th className="p-8 text-right">Date d'entrée</th>
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
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-orange-500 flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                          {f.full_name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 uppercase text-xs tracking-tight">{f.full_name || "Ambassadeur"}</span>
                          <span className="text-[9px] text-slate-400 font-bold lowercase">{f.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10 shadow-sm">
                        {f.rank || "Membre Bronze"}
                      </span>
                    </td>
                    <td className="p-8">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[10px] font-black text-slate-900 uppercase">Actif</span>
                       </div>
                    </td>
                    <td className="p-8 text-right">
                      <span className="text-slate-400 font-bold text-xs italic">
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
          <div className="p-24 text-center">
            <Icons.UserPlus size={48} className="mx-auto text-slate-200 mb-6" />
            <h4 className="text-slate-900 font-black uppercase text-xs mb-2 italic tracking-tighter">Expansion requise</h4>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
              Votre réseau est actuellement en attente de nouveaux talents. Partagez votre lien d'accès.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}