import { useState, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient";

export default function MesCommissions({ user }) {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // 🔔 Notification Luxe
  const notify = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // 🔄 1. CHARGEMENT & SYNCHRONISATION TEMPS RÉEL
  useEffect(() => {
    if (!user) return;

    const fetchGains = async () => {
      setLoading(true);
      // On récupère les transactions de type 'commission' ou 'bonus'
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .in('type', ['commission', 'bonus'])
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error) setCommissions(data || []);
      setLoading(false);
    };

    fetchGains();

    // Live Sync : Dès qu'un gain est validé par le système
    const channel = supabase
      .channel('flux-argent')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          if (payload.new.type === 'commission' || payload.new.type === 'bonus') {
            setCommissions(prev => [payload.new, ...prev]);
            notify(`Nouveau gain : +${payload.new.amount} F ! 💸`);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  // 📊 2. LOGIQUE ANALYTIQUE (Calculs de performance)
  const stats = useMemo(() => {
    const total = commissions.reduce((sum, c) => sum + Number(c.amount), 0);
    const recues = commissions.filter(c => c.status === "Complété").reduce((sum, c) => sum + Number(c.amount), 0);
    const attente = commissions.filter(c => c.status === "En attente").reduce((sum, c) => sum + Number(c.amount), 0);
    const bonus = commissions.filter(c => c.type === "bonus").reduce((sum, c) => sum + Number(c.amount), 0);
    
    return { total, recues, attente, bonus };
  }, [commissions]);

  return (
    <div className="space-y-8 pb-20">
      
      {/* 🔹 TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 right-10 z-[600]">
            <div className="bg-slate-900 border border-white/10 p-5 rounded-[2rem] shadow-2xl flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <Icons.TrendingUp size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 HEADER PRESTIGE : LE BILAN GLOBAL */}
      <header className="bg-[#0f172a] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <div className="bg-emerald-500/10 text-emerald-500 w-fit px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border border-emerald-500/20">
              Écosystème Croissance Rynek
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
              Mes <span className="text-emerald-500 text-glow">Revenus</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic">
              Performance de votre réseau d'affiliation
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[250px] shadow-inner">
             <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-center">Solde Retirable</p>
             <h2 className="text-4xl font-black text-white italic">
               {stats.recues.toLocaleString()} <span className="text-emerald-500 text-sm not-italic font-bold">F</span>
             </h2>
          </div>
        </div>
        <Icons.TrendingUp size={250} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 pointer-events-none" />
      </header>

      {/* 🔹 GRILLE ANALYTIQUE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Gains Réseau", val: `${(stats.recues - stats.bonus).toLocaleString()} F`, icon: <Icons.Users />, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Récompenses & Bonus", val: `${stats.bonus.toLocaleString()} F`, icon: <Icons.Zap />, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "En cours de validation", val: `${stats.attente.toLocaleString()} F`, icon: <Icons.Clock />, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`${item.bg} ${item.color} p-5 rounded-2xl`}>{item.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{item.val}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🔹 JOURNAL DES TRANSACTIONS */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black uppercase text-xs tracking-tighter text-slate-900 flex items-center gap-2">
            <Icons.History size={18} className="text-slate-400" /> Journal d'activité financière
          </h3>
          <button className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 bg-white border border-slate-100 px-5 py-3 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
            <Icons.Download size={14} /> Exporter .CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8 border-b border-slate-50">Source de Revenu</th>
                <th className="p-8 border-b border-slate-50">Canal</th>
                <th className="p-8 border-b border-slate-50">Date</th>
                <th className="p-8 border-b border-slate-50 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr><td colSpan="4" className="p-20 text-center"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"/></td></tr>
                ) : commissions.map((c, i) => (
                  <motion.tr 
                    layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={c.id}
                    className="hover:bg-slate-50/50 transition-colors group cursor-default"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                          <Icons.ArrowDownLeft size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase text-xs tracking-tight">{c.title || c.source}</p>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${c.status === "Complété" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"}`}>
                            {c.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{c.method || c.type}</p>
                    </td>
                    <td className="p-8">
                      <p className="text-slate-500 font-bold text-xs">{new Date(c.created_at || c.date).toLocaleDateString()}</p>
                    </td>
                    <td className="p-8 text-right">
                      <span className="text-lg font-black text-slate-900 italic">
                        +{Number(c.amount).toLocaleString()} <small className="text-[10px] not-italic text-emerald-500">F</small>
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {commissions.length === 0 && !loading && (
          <div className="p-24 text-center">
            <Icons.PieChart className="mx-auto text-slate-100 mb-4" size={64} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
              Aucune activité enregistrée sur ce trimestre
            </p>
          </div>
        )}
      </div>
    </div>
  );
}