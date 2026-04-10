import { useState, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient";

export default function MesCommandes({ user }) {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("toutes");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // 🔔 Notification Luxe
  const notify = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // 🔄 1. SYNC SUPABASE & REAL-TIME
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('commandes')
        .select('*')
        .eq('vendeur_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error) setCommandes(data || []);
      setLoading(false);
    };

    fetchOrders();

    // Live Sync : On écoute les nouvelles commandes
    const channel = supabase
      .channel('flux-commandes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'commandes', filter: `vendeur_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCommandes(prev => [payload.new, ...prev]);
            notify("Nouvelle commande reçue ! 🚀", "success");
          }
          if (payload.eventType === 'UPDATE') {
            setCommandes(prev => prev.map(c => c.id === payload.new.id ? payload.new : p));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  // ⚙️ 2. CHANGER LE STATUT (Action Vendeur)
  const updateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .update({ statut: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      notify(`Commande marquée comme ${newStatus}`);
    } catch (err) {
      notify("Erreur lors de la mise à jour", "error");
    }
  };

  // 🔍 3. FILTRAGE INTELLIGENT
  const filteredCommandes = useMemo(() => {
    return commandes.filter(c => {
      const matchesStatus = filterStatus === "toutes" || c.statut === filterStatus;
      const matchesSearch = c.produit_nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.id.toString().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [commandes, filterStatus, searchTerm]);

  const statutStyles = {
    "En attente": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Expédiée": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Livrée": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Annulée": "bg-red-500/10 text-red-500 border-red-500/20"
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* 🔹 NOTIFICATION TOAST */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.5 }} className="fixed bottom-10 right-10 z-[600]">
            <div className="bg-slate-900 border border-white/10 p-5 rounded-[2rem] shadow-2xl flex items-center gap-4 text-white">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toast.type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                {toast.type === 'error' ? <Icons.AlertCircle size={20} /> : <Icons.BellRing size={20} />}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 HEADER : ANALYSES DE FLUX */}
      <header className="bg-[#0f172a] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              Flux <span className="text-orange-500">Commandes</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Monitoring des ventes en temps réel</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5 text-center min-w-[150px]">
               <p className="text-white text-3xl font-black">{commandes.filter(c => c.statut === "En attente").length}</p>
               <p className="text-orange-500 text-[8px] font-black uppercase tracking-widest">À préparer</p>
            </div>
            <div className="bg-emerald-500/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-emerald-500/10 text-center min-w-[150px]">
               <p className="text-emerald-500 text-3xl font-black">
                 {commandes.filter(c => c.statut === "Livrée").reduce((acc, c) => acc + c.montant, 0).toLocaleString()}
               </p>
               <p className="text-emerald-600/50 text-[8px] font-black uppercase tracking-widest">Revenus encaissés</p>
            </div>
          </div>
        </div>
        <Icons.Activity className="absolute -right-10 -bottom-10 text-white/5 rotate-12" size={250} />
      </header>

      {/* 🔹 FILTRES & RECHERCHE */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {["toutes", "En attente", "Expédiée", "Livrée", "Annulée"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border
                ${filterStatus === status ? "bg-orange-500 border-orange-500 text-white shadow-xl" : "bg-white text-slate-400 border-slate-100 hover:border-orange-500"}`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="relative w-full xl:w-96 group">
          <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500" size={18} />
          <input 
            type="text" 
            placeholder="ID commande ou produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-xs font-bold outline-none focus:border-orange-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* 🔹 TABLEAU DE GESTION */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                <th className="p-8">Commande</th>
                <th className="p-8">Client & Date</th>
                <th className="p-8">Prix Total</th>
                <th className="p-8 text-center">Action Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredCommandes.map((c) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={c.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-orange-500 shadow-lg">
                          <Icons.Hash size={18} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-xs uppercase tracking-tight">{c.produit_nom}</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-1">ID: #{c.id.toString().slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-8">
                      <p className="text-slate-900 font-black text-xs uppercase">{c.client_nom || "Client Rynek"}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-2">
                        <Icons.Calendar size={12} /> {new Date(c.created_at || c.date).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="p-8">
                      <span className="text-base font-black text-slate-900 italic">
                        {c.montant.toLocaleString()} <small className="text-[9px] text-slate-400 not-italic uppercase font-black">F CFA</small>
                      </span>
                    </td>

                    <td className="p-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border ${statutStyles[c.statut]}`}>
                          {c.statut}
                        </span>
                        
                        {/* 🔘 DROPDOWN D'ACTION RAPIDE */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {["Expédiée", "Livrée", "Annulée"].map(s => (
                            c.statut !== s && (
                              <button 
                                key={s}
                                onClick={() => updateStatus(c.id, s)}
                                title={`Passer en ${s}`}
                                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all"
                              >
                                {s === "Expédiée" && <Icons.Truck size={14} />}
                                {s === "Livrée" && <Icons.Check size={14} />}
                                {s === "Annulée" && <Icons.X size={14} />}
                              </button>
                            )
                          ))}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredCommandes.length === 0 && (
          <div className="p-20 text-center bg-slate-50/20">
            <Icons.Layers className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
              Aucun mouvement sur ce canal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}