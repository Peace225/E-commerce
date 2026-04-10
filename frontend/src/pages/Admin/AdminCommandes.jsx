import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient"; // 🔄 Import Supabase ajouté

export default function AdminCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Toutes");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 Synchronisation en temps réel avec Supabase
  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const { data, error } = await supabase
          .from('commandes')
          .select('*')
          .order('created_at', { ascending: false }); // Supabase utilise généralement created_at

        if (error) throw error;
        if (data) setCommandes(data);
      } catch (error) {
        console.error("Erreur chargement des commandes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();

    // ⚡ Souscription temps réel (remplace onSnapshot)
    const channel = supabase.channel('admin-commandes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'commandes' }, () => {
        fetchCommandes();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ⚙️ Action : Mettre à jour le statut d'une commande
  const updateStatus = async (orderId, newStatus) => {
    const messages = {
      "Livrée": "✅ Confirmez-vous que cette commande a bien été livrée au client ?",
      "Annulée": "❌ Attention, voulez-vous vraiment annuler cette commande ?"
    };

    if (window.confirm(messages[newStatus])) {
      try {
        // Mise à jour via Supabase
        const { error } = await supabase
          .from('commandes')
          .update({ 
            statut: newStatus,
            updated_at: new Date().toISOString() // Remplacer serverTimestamp()
          })
          .eq('id', orderId);

        if (error) throw error;
      } catch (error) {
        console.error("Erreur mise à jour statut:", error);
      }
    }
  };

  const statusColors = {
    "En attente": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Payée": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Livrée": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Annulée": "bg-red-500/10 text-red-500 border-red-500/20",
  };

  // 🔍 Filtrage combiné (Recherche + Statut)
  // Note : J'utilise (c.produit_nom || c.produitNom) pour être compatible avec les deux nomenclatures
  const filteredCommandes = commandes.filter(c => {
    const productName = c.produit_nom || c.produitNom || "";
    const clientEmail = c.client_email || c.clientEmail || "";
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filter === "Toutes" || c.statut === filter;
    return matchesSearch && matchesStatus;
  });

  // 📊 Calcul des Statistiques
  const stats = {
    total: commandes.length,
    enAttente: commandes.filter(c => c.statut === "En attente").length,
    livrees: commandes.filter(c => c.statut === "Livrée").length,
    caGenere: commandes.filter(c => c.statut === "Livrée" || c.statut === "Payée")
                       .reduce((acc, c) => acc + (c.montant || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      
      {/* 🔹 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Commandes", val: stats.total, icon: <Icons.ShoppingCart />, col: "text-blue-500" },
          { label: "À Traiter", val: stats.enAttente, icon: <Icons.Clock />, col: "text-orange-500" },
          { label: "Livrées", val: stats.livrees, icon: <Icons.CheckCircle2 />, col: "text-emerald-500" },
          { label: "C.A. Sécurisé", val: `${stats.caGenere.toLocaleString()} F`, icon: <Icons.TrendingUp />, col: "text-purple-500" },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f172a] p-6 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-5">
            <div className={`p-4 rounded-2xl bg-white/5 ${s.col}`}>{s.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-xl font-black text-white truncate">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 HEADER & FILTRES */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Centre <span className="text-red-500">Logistique</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Supervision des expéditions et du C.A.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          {/* Barre de recherche */}
          <div className="relative flex-1 sm:w-80">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="N° Commande, Client, Produit..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-white focus:border-red-500 outline-none transition-all"
            />
          </div>

          {/* Filtres de statuts */}
          <div className="flex gap-2 bg-[#0f172a] p-1.5 rounded-2xl border border-white/5 shadow-inner overflow-x-auto custom-scrollbar">
            {["Toutes", "En attente", "Payée", "Livrée", "Annulée"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${filter === s ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-slate-500 hover:text-white"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 TABLEAU DES VENTES */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Produit & Réf</th>
                <th className="p-8">Client</th>
                <th className="p-8 text-center">Montant</th>
                <th className="p-8 text-center">Statut Actuel</th>
                <th className="p-8 text-right">Contrôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredCommandes.map((c, i) => {
                  // ⏱️ Parsing de la date (Supabase renvoie une string ISO, Firebase renvoyait un objet)
                  const dateString = c.created_at || c.createdAt;
                  const dateObj = dateString ? new Date(dateString) : new Date();

                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={c.id} className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg">
                            <Icons.ShoppingBag size={20} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-black text-white text-xs uppercase tracking-tight truncate">
                              {c.produit_nom || c.produitNom || "Produit Inconnu"}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">ID: {c.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-300">{c.client_email || c.clientEmail}</span>
                          <span className="text-[10px] text-slate-500 font-bold italic mt-1">
                            {dateObj.toLocaleDateString('fr-FR')} à {dateObj.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <span className="text-emerald-400 font-black text-sm">{(c.montant || 0).toLocaleString()} F</span>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusColors[c.statut] || 'bg-slate-500/10 text-slate-500'}`}>
                          {c.statut || "Inconnu"}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {c.statut !== "Livrée" && c.statut !== "Annulée" && (
                            <button 
                              onClick={() => updateStatus(c.id, "Livrée")}
                              className="p-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-all"
                              title="Valider la livraison"
                            >
                              <Icons.CheckCircle2 size={16} />
                            </button>
                          )}
                          {c.statut !== "Annulée" && (
                            <button 
                              onClick={() => updateStatus(c.id, "Annulée")}
                              className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                              title="Annuler la commande"
                            >
                              <Icons.XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredCommandes.length === 0 && !loading && (
          <div className="p-24 text-center">
            <Icons.PackageOpen className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}