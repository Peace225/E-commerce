import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient"; 

export default function AdminBoutiques() {
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");

  // 🔄 Synchronisation en temps réel avec Supabase
  const fetchBoutiques = async () => {
    try {
      const { data, error } = await supabase
        .from('boutiques')
        .select('*')
        .order('created_at', { ascending: false }); 

      if (error) throw error;
      if (data) setBoutiques(data);
    } catch (error) {
      console.error("Erreur chargement des boutiques:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoutiques();

    // ⚡ Souscription temps réel globale sur la table boutiques
    const channel = supabase.channel('admin-boutiques-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'boutiques' }, () => {
        fetchBoutiques(); 
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ⚙️ ACTION : VALIDER OU REFUSER UNE BOUTIQUE (Workflow de validation)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('boutiques')
        .update({ statut: newStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Erreur de mise à jour du statut:", error);
      alert("Une erreur est survenue lors de la modification du statut.");
    }
  };

  // ⚙️ ACTION : SUPPRIMER UNE BOUTIQUE
  const handleDelete = async (id) => {
    if (window.confirm("🚨 ATTENTION : Supprimer cette boutique effacera son catalogue définitivement. Confirmer ?")) {
      try {
        const { error } = await supabase
          .from('boutiques')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error("Erreur de suppression:", error);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  // 🔍 Filtrage combiné (Recherche textuelle + Statut)
  const filteredBoutiques = boutiques.filter(b => {
    const nom = b.nom || "";
    const email = b.proprietaire_email || b.proprietaireEmail || ""; 

    const matchesSearch = nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "Tous" || b.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // 📊 CALCUL DES STATS RAPIDES (Prise en compte des 3 statuts)
  const stats = {
    total: boutiques.length,
    pending: boutiques.filter(b => b.statut === "pending" || !b.statut).length,
    approved: boutiques.filter(b => b.statut === "approved").length,
  };

  // 🛡️ COMPOSANT INTERNE : BADGE DE STATUT PREMIUM
  const StatusBadge = ({ status }) => {
    const config = {
      approved: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-500", label: "Certifiée" },
      pending: { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-500", label: "En attente" },
      rejected: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-500", label: "Rejetée" }
    };
    const s = config[status] || config.pending;
    return (
      <span className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Icons.Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">Chargement de l'écosystème...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* 🔹 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Boutiques", val: stats.total, icon: <Icons.Store />, col: "text-blue-500" },
          { label: "Demandes en attente", val: stats.pending, icon: <Icons.Clock className={stats.pending > 0 ? "animate-pulse" : ""} />, col: "text-orange-500" },
          { label: "Boutiques certifiées", val: stats.approved, icon: <Icons.ShieldCheck />, col: "text-emerald-500" },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-white/5 ${s.col}`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-black text-white mt-1">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 HEADER & FILTRES */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Contrôle & <span className="text-orange-500">Validation</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Modération et activation des vitrines marchandes
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" placeholder="Rechercher une boutique ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-white focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <select 
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0f172a] border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl outline-none focus:border-orange-500 transition-all"
          >
            <option value="Tous">Toutes les demandes</option>
            <option value="pending">En attente d'audit</option>
            <option value="approved">Validées / Certifiées</option>
            <option value="rejected">Rejetées</option>
          </select>
        </div>
      </div>

      {/* 🔹 TABLEAU DES BOUTIQUES */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Identité Boutique</th>
                <th className="p-8">Propriétaire & Contact</th>
                <th className="p-8 text-center">Catalogue</th>
                <th className="p-8 text-center">Statut Actuel</th>
                <th className="p-8 text-right">Actions Décisoires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredBoutiques.map((b, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    key={b.id} className="hover:bg-white/[0.01] transition-colors group"
                  >
                    {/* Identité */}
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 border border-white/5 group-hover:bg-orange-500 group-hover:text-white transition-all">
                          <Icons.Store size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white text-xs uppercase tracking-tight">{b.nom}</span>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">ID: {b.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Propriétaire */}
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-300">{b.proprietaire_email || b.proprietaireEmail}</span>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.1em] mt-1">Vendeur Premium</span>
                      </div>
                    </td>

                    {/* Catalogue */}
                    <td className="p-8 text-center">
                      <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <Icons.Package size={14} className="text-orange-500" />
                        <span className="text-xs font-black text-white">{b.nombre_produits || b.nombreProduits || 0}</span>
                      </div>
                    </td>

                    {/* Statut Badge */}
                    <td className="p-8 text-center">
                      <StatusBadge status={b.statut} />
                    </td>

                    {/* Validation Actions */}
                    <td className="p-8 text-right">
                      <div className="flex justify-end items-center gap-2">
                        
                        {/* Bouton Accepter / Approuver */}
                        {b.statut !== "approved" && (
                          <button 
                            onClick={() => handleUpdateStatus(b.id, "approved")}
                            className="p-2.5 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-xl transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-wider px-3"
                            title="Valider et publier la boutique"
                          >
                            <Icons.Check size={14} /> Approuver
                          </button>
                        )}

                        {/* Bouton Refuser / Suspendre */}
                        {b.statut !== "rejected" && b.statut !== "pending" && (
                          <button 
                            onClick={() => handleUpdateStatus(b.id, "rejected")}
                            className="p-2.5 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-wider px-3"
                            title="Rejeter / Suspendre la boutique"
                          >
                            <Icons.X size={14} /> Rejeter
                          </button>
                        )}

                        {/* Bouton Remettre en attente si rejetée */}
                        {b.statut === "rejected" && (
                          <button 
                            onClick={() => handleUpdateStatus(b.id, "pending")}
                            className="p-2.5 bg-orange-500/10 hover:bg-orange-600 text-orange-500 hover:text-white rounded-xl transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-wider px-3"
                            title="Remettre en attente d'audit"
                          >
                            <Icons.RefreshCw size={14} /> Réauditer
                          </button>
                        )}

                        {/* Séparateur visuel discret */}
                        <div className="w-px h-6 bg-white/10 mx-1" />

                        {/* Action de suppression drastique */}
                        <button 
                          onClick={() => handleDelete(b.id)} 
                          className="p-2.5 bg-white/5 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-all"
                          title="Supprimer définitivement"
                        >
                          <Icons.Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Écran vide si aucun résultat */}
        {filteredBoutiques.length === 0 && !loading && (
          <div className="p-24 text-center">
            <Icons.Inbox className="mx-auto text-slate-700 mb-4 animate-bounce" size={48} />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Aucun dossier de boutique à traiter</p>
          </div>
        )}
      </div>
    </div>
  );
}