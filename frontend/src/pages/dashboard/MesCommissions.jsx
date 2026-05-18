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

  // 📊 2. LOGIQUE ANALYTIQUE
  const stats = useMemo(() => {
    const total = commissions.reduce((sum, c) => sum + Number(c.amount), 0);
    const recues = commissions.filter(c => c.status === "Complété").reduce((sum, c) => sum + Number(c.amount), 0);
    const attente = commissions.filter(c => c.status === "En attente").reduce((sum, c) => sum + Number(c.amount), 0);
    const bonus = commissions.filter(c => c.type === "bonus").reduce((sum, c) => sum + Number(c.amount), 0);
    
    return { total, recues, attente, bonus };
  }, [commissions]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 px-4 sm:px-0">
      
      {/* 🔹 TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[600] left-6 sm:left-auto">
            <div className="bg-slate-900 border border-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-2xl flex items-center gap-3 sm:gap-4 text-white">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <Icons.TrendingUp size={16} className="sm:w-5 sm:h-5" />
              </div>
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 HEADER PRESTIGE : LE BILAN GLOBAL */}
      <header className="bg-[#0f172a] p-6 sm:p-10 rounded-2xl sm:rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8">
          <div className="text-center lg:text-left">
            <div className="bg-emerald-500/10 text-emerald-500 w-fit px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-3 sm:mb-4 border border-emerald-500/20 mx-auto lg:mx-0">
              Écosystème Croissance Life Shop
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
              Mes <span className="text-emerald-500 text-glow">Revenus</span>
            </h1>
            <p className="text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-[0.4em] mt-2 sm:mt-3 italic">
              Performance de votre réseau d'affiliation
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-5 sm:p-8 rounded-xl sm:rounded-[2.5rem] border border-white/10 text-center w-full lg:w-auto min-w-full sm:min-w-[250px] shadow-inner">
             <p className="text-slate-400 text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-[0.2em] mb-1.5 sm:mb-3 text-center">Solde Retirable</p>
             <h2 className="text-2xl sm:text-4xl font-black text-white italic">
               {stats.recues.toLocaleString()} <span className="text-emerald-500 text-xs sm:text-sm not-italic font-bold">F</span>
             </h2>
          </div>
        </div>
        <Icons.TrendingUp size={250} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 pointer-events-none hidden sm:block" />
      </header>

      {/* 🔹 GRILLE ANALYTIQUE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: "Gains Réseau", val: `${(stats.recues - stats.bonus).toLocaleString()} F`, icon: <Icons.Users size={18} />, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Récompenses & Bonus", val: `${stats.bonus.toLocaleString()} F`, icon: <Icons.Zap size={18} />, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "En cours de validation", val: `${stats.attente.toLocaleString()} F`, icon: <Icons.Clock size={18} />, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 flex items-center gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`${item.bg} ${item.color} p-3.5 sm:p-5 rounded-xl sm:rounded-2xl shrink-0`}>{item.icon}</div>
            <div>
              <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1">{item.label}</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">{item.val}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🔹 JOURNAL DES TRANSACTIONS */}
      <div className="bg-white rounded-2xl sm:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/30 gap-4">
          <h3 className="font-black uppercase text-xs tracking-tighter text-slate-900 flex items-center gap-2">
            <Icons.History size={16} className="text-slate-400" /> Journal d'activité financière
          </h3>
          <button className="w-full sm:w-auto text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2 bg-white border border-slate-100 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
            <Icons.Download size={12} className="sm:w-3.5 sm:h-3.5" /> Exporter .CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-[0.2em]">
                  <th className="p-5 sm:p-8 border-b border-slate-50">Source de Revenu</th>
                  <th className="p-5 sm:p-8 border-b border-slate-50">Canal</th>
                  <th className="p-5 sm:p-8 border-b border-slate-50">Date</th>
                  <th className="p-5 sm:p-8 border-b border-slate-50 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr><td colSpan="4" className="p-16 sm:p-20 text-center"><div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"/></td></tr>
                  ) : commissions.map((c) => (
                    <motion.tr 
                      layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={c.id}
                      className="hover:bg-slate-50/50 transition-colors group cursor-default"
                    >
                      <td className="p-5 sm:p-8 whitespace-nowrap">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                            <Icons.ArrowDownLeft size={16} className="sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 uppercase text-xs tracking-tight">{c.title || c.source}</p>
                            <span className={`text-[7px] sm:text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full border ${c.status === "Complété" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"}`}>
                              {c.status}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 sm:p-8 whitespace-nowrap">
                        <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider sm:tracking-widest italic">{c.method || c.type}</p>
                      </td>
                      <td className="p-5 sm:p-8 whitespace-nowrap">
                        <p className="text-slate-500 font-bold text-xs">{new Date(c.created_at || c.date).toLocaleDateString()}</p>
                      </td>
                      <td className="p-5 sm:p-8 text-right whitespace-nowrap">
                        <span className="text-base sm:text-lg font-black text-slate-900 italic">
                          +{Number(c.amount).toLocaleString()} <small className="text-[8px] sm:text-[10px] not-italic text-emerald-500">F</small>
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {commissions.length === 0 && !loading && (
          <div className="p-16 sm:p-24 text-center">
            <Icons.PieChart className="mx-auto text-slate-100 mb-3 sm:mb-4" size={48} />
            <p className="text-slate-400 font-black uppercase text-[8px] sm:text-[10px] tracking-wider sm:tracking-widest">
              Aucune activité enregistrée sur ce trimestre
            </p>
          </div>
        )}
      </div>
    </div>
  );
}