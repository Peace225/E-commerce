import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBoutiques() {
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");

  // 🔄 Synchronisation en temps réel
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "boutiques"), (snap) => {
      setBoutiques(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ⚙️ ACTION : MODIFIER LE STATUT (Activer/Désactiver)
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateDoc(doc(db, "boutiques", id), { statut: newStatus });
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("🚨 ATTENTION : Supprimer cette boutique effacera son catalogue. Confirmer ?")) {
      try {
        await deleteDoc(doc(db, "boutiques", id));
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const filteredBoutiques = boutiques.filter(b => {
    const matchesSearch = b.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.proprietaireEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "Tous" || b.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // 📊 CALCUL DES STATS RAPIDES
  const stats = {
    total: boutiques.length,
    active: boutiques.filter(b => b.statut === "active").length,
    totalProducts: boutiques.reduce((acc, b) => acc + (b.nombreProduits || 0), 0)
  };

  return (
    <div className="space-y-10">
      {/* 🔹 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Boutiques Partenaires", val: stats.total, icon: <Icons.Store />, col: "text-blue-500" },
          { label: "Boutiques Actives", val: stats.active, icon: <Icons.ShieldCheck />, col: "text-emerald-500" },
          { label: "Produits en Ligne", val: stats.totalProducts, icon: <Icons.Package />, col: "text-orange-500" },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-white/5 ${s.col}`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-black text-white">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 HEADER & FILTRES */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Annuaire <span className="text-red-500">Business</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Supervision des vendeurs certifiés Rynek
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" placeholder="Nom ou Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-white focus:border-red-500 outline-none transition-all"
            />
          </div>
          <select 
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0f172a] border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl outline-none"
          >
            <option value="Tous">Tous les Statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>
        </div>
      </div>

      {/* 🔹 TABLEAU SAAS DARK */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Identité Boutique</th>
                <th className="p-8">Propriétaire</th>
                <th className="p-8 text-center">Catalogue</th>
                <th className="p-8 text-center">Statut</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredBoutiques.map((b, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    key={b.id} className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                          <Icons.Store size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white text-xs uppercase tracking-tight">{b.nom}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">ID: {b.id.slice(0,8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-300">{b.proprietaireEmail}</span>
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">Vendeur certifié</span>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <Icons.Package size={14} className="text-red-500" />
                        <span className="text-sm font-black text-white">{b.nombreProduits || 0}</span>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <button 
                        onClick={() => toggleStatus(b.id, b.statut)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${b.statut === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                      >
                        {b.statut || "inactive"}
                      </button>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3">
                        <button className="p-3 bg-slate-800 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all">
                          <Icons.Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(b.id)} 
                          className="p-3 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all"
                        >
                          <Icons.Trash2 size={16} />
                        </button>
                      </div>
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