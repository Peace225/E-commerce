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
            // Correction ici : changement de 'p' en 'c' pour éviter l'erreur d'exécution
            setCommandes(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
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
    <div className="space-y-5 md:space-y-8 pb-20">
      
      {/* 🔹 NOTIFICATION TOAST COMPACTE */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-[600]">
            <div className="bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-white">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${toast.type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                {toast.type === 'error' ? <Icons.AlertCircle size={16} /> : <Icons.BellRing size={16} />}
              </div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 HEADER RESPONSIVE AVEC POLICES OPTIMISÉES */}
      <header className="bg-[#0f172a] p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 text-center sm:text-left">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">
              Flux <span className="text-orange-500">Commandes</span>
            </h1>
            <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mt-1">Monitoring des ventes en temps réel</p>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <div className="bg-white/5 backdrop-blur-md px-4 py-2.5 md:p-6 rounded-xl md:rounded-[2.5rem] border border-white/5 text-center min-w-[90px] md:min-w-[140px]">
               <p className="text-white text-lg md:text-2xl font-black leading-none">{commandes.filter(c => c.statut === "En attente").length}</p>
               <p className="text-orange-500 text-[7px] md:text-[8px] font-black uppercase tracking-widest mt-1">À préparer</p>
            </div>
            <div className="bg-emerald-500/10 backdrop-blur-md px-4 py-2.5 md:p-6 rounded-xl md:rounded-[2.5rem] border border-emerald-500/10 text-center min-w-[100px] md:min-w-[140px]">
               <p className="text-emerald-500 text-lg md:text-2xl font-black leading-none">
                 {commandes.filter(c => c.statut === "Livrée").reduce((acc, c) => acc + c.montant, 0).toLocaleString()}
               </p>
               <p className="text-emerald-600/50 text-[7px] md:text-[8px] font-black uppercase tracking-widest mt-1">Revenus (FCFA)</p>
            </div>
          </div>
        </div>
        <Icons.Activity className="absolute -right-10 -bottom-10 text-white/5 rotate-12 pointer-events-none" size={180} />
      </header>

      {/* 🔹 FILTRES ET RECHERCHE AJUSTÉS */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {["toutes", "En attente", "Expédiée", "Livrée", "Annulée"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-wider md:tracking-widest transition-all border
                ${filterStatus === status ? "bg-orange-500 border-orange-500 text-white shadow-md" : "bg-white text-slate-400 border-slate-100 hover:border-orange-500"}`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="relative w-full lg:w-72 group">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500" size={16} />
          <input 
            type="text" 
            placeholder="ID commande ou produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-[11px] md:text-xs font-bold outline-none focus:border-orange-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* 🔹 TABLEAU COMPACT ET SCROLLABLE */}
      <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] md:min-w-full">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="p-4 md:p-6">Commande</th>
                <th className="p-4 md:p-6">Client & Date</th>
                <th className="p-4 md:p-6">Prix Total</th>
                <th className="p-4 md:p-6 text-center">Action Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredCommandes.map((c) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={c.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 md:p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-orange-500 shrink-0 shadow-sm">
                          <Icons.Hash size={14} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-[11px] md:text-xs uppercase tracking-tight">{c.produit_nom}</p>
                          <p className="text-[8px] text-slate-400 font-bold mt-0.5">ID: #{c.id.toString().slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4 md:p-6">
                      <p className="text-slate-900 font-black text-[11px] md:text-xs uppercase leading-none">{c.client_nom || "Client Rynek"}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 flex items-center gap-1.5">
                        <Icons.Calendar size={10} /> {new Date(c.created_at || c.date).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="p-4 md:p-6">
                      <span className="text-sm md:text-base font-black text-slate-900 italic">
                        {c.montant.toLocaleString()} <span className="text-[8px] text-slate-400 not-italic uppercase font-black">FCFA</span>
                      </span>
                    </td>

                    <td className="p-4 md:p-6 text-center">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-wider border shrink-0 ${statutStyles[c.statut]}`}>
                          {c.statut}
                        </span>
                        
                        {/* Actions rapides adaptées */}
                        <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          {["Expédiée", "Livrée", "Annulée"].map(s => (
                            c.statut !== s && (
                              <button 
                                key={s}
                                onClick={() => updateStatus(c.id, s)}
                                title={`Passer en ${s}`}
                                className="w-6 h-6 rounded-md bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all active:scale-90"
                              >
                                {s === "Expédiée" && <Icons.Truck size={12} />}
                                {s === "Livrée" && <Icons.Check size={12} />}
                                {s === "Annulée" && <Icons.X size={12} />}
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
          <div className="p-12 md:p-20 text-center bg-slate-50/10">
            <Icons.Layers className="mx-auto text-slate-200 mb-3" size={36} />
            <p className="text-slate-400 font-black uppercase text-[8px] md:text-[9px] tracking-widest">
              Aucun mouvement sur ce canal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}