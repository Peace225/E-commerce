import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient"; // 🔄 Import Supabase

export default function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");

  // 🔄 SYNCHRONISATION DU CATALOGUE GLOBAL (Supabase)
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const { data, error } = await supabase
          .from('produits')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setProduits(data);
      } catch (error) {
        console.error("Erreur chargement catalogue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();

    // ⚡ Souscription temps réel
    const channel = supabase.channel('admin-produits-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'produits' }, () => {
        fetchProduits();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ⚙️ ACTION : CENSURER / PUBLIER UN PRODUIT
  const toggleVisibility = async (id, currentStatus) => {
    const newStatus = currentStatus === "suspendu" ? "actif" : "suspendu";
    try {
      const { error } = await supabase
        .from('produits')
        .update({ 
          statut: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Erreur mise à jour statut produit:", error);
      alert("Erreur lors de la modification du statut.");
    }
  };

  // ⚙️ ACTION : SUPPRIMER DÉFINITIVEMENT
  const handleDelete = async (id) => {
    if (window.confirm("🚨 Supprimer définitivement ce produit de la base de données ?")) {
      try {
        const { error } = await supabase
          .from('produits')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error("Erreur de suppression:", error);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  // 🔍 FILTRES (Sécurisé pour les formats de DB variés)
  const filteredProduits = produits.filter(p => {
    const nomProduit = p.nom || p.title || "";
    const nomBoutique = p.boutique_nom || p.boutiqueNom || p.vendeur || "";
    
    const matchesSearch = nomProduit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          nomBoutique.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = p.statut || "actif";
    const matchesFilter = filterStatus === "Tous" || status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // 📊 KPIs
  const stats = {
    total: produits.length,
    actifs: produits.filter(p => (p.statut || "actif") === "actif").length,
    suspendus: produits.filter(p => p.statut === "suspendu").length,
    rupture: produits.filter(p => (p.stock || 0) <= 0).length,
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
          { label: "Total Produits", val: stats.total, icon: <Icons.Package />, col: "text-blue-500" },
          { label: "En Ligne", val: stats.actifs, icon: <Icons.CheckCircle2 />, col: "text-emerald-500" },
          { label: "Censurés", val: stats.suspendus, icon: <Icons.EyeOff />, col: "text-red-500" },
          { label: "Rupture de Stock", val: stats.rupture, icon: <Icons.AlertTriangle />, col: "text-orange-500" },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f172a] p-6 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-white/5 ${s.col}`}>{s.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-black text-white">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 HEADER & FILTRES */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Modération <span className="text-red-500">Catalogue</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Contrôle qualité des articles vendeurs
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" placeholder="Nom du produit ou boutique..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-white focus:border-red-500 outline-none transition-all"
            />
          </div>
          <select 
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0f172a] border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl outline-none"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="actif">En ligne</option>
            <option value="suspendu">Censurés</option>
          </select>
        </div>
      </div>

      {/* 🔹 TABLEAU DES PRODUITS */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Article</th>
                <th className="p-8">Boutique</th>
                <th className="p-8 text-center">Prix & Stock</th>
                <th className="p-8 text-center">Visibilité</th>
                <th className="p-8 text-right">Sanction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredProduits.map((p, i) => {
                  const isSuspended = p.statut === "suspendu";
                  
                  // 🖼️ Gestion robuste de l'image (Tableau vs URL unique vs Firebase relic)
                  let displayImage = "https://via.placeholder.com/50";
                  if (p.image) displayImage = p.image;
                  else if (p.image_url) displayImage = p.image_url;
                  else if (Array.isArray(p.images) && p.images.length > 0) displayImage = p.images[0];

                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                      key={p.id} className={`group transition-colors ${isSuspended ? 'bg-red-500/5' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <img 
                            src={displayImage} 
                            alt={p.nom || p.title || "Produit"} 
                            className={`w-12 h-12 rounded-xl object-cover bg-slate-800 border border-white/10 ${isSuspended ? 'grayscale opacity-50' : ''}`}
                            onError={(e) => e.target.src = "https://via.placeholder.com/50"} // Sécurité si image brisée
                          />
                          <div className="flex flex-col min-w-0 max-w-[200px]">
                            <span className="font-black text-white text-xs uppercase tracking-tight truncate">{p.nom || p.title || "Sans Nom"}</span>
                            <span className="text-[9px] text-slate-500 font-bold uppercase mt-1">{p.categorie || "Non classé"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-300">{p.boutique_nom || p.boutiqueNom || p.vendeur || "Boutique Inconnue"}</span>
                          <span className="text-[9px] text-slate-500 font-mono mt-1">
                            ID: {p.boutique_id?.slice(0,6) || p.uid?.slice(0,6) || p.id.slice(0,6)}
                          </span>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-emerald-400 font-black text-sm">{(p.prix || 0).toLocaleString()} F</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-md ${(p.stock || 0) > 0 ? 'bg-slate-800 text-slate-400' : 'bg-orange-500/20 text-orange-500'}`}>
                            {(p.stock || 0) > 0 ? `${p.stock} en stock` : 'Rupture'}
                          </span>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <button 
                          onClick={() => toggleVisibility(p.id, p.statut)}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all hover:scale-105 ${!isSuspended ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                        >
                          {!isSuspended ? "En ligne" : "Censuré"}
                        </button>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => toggleVisibility(p.id, p.statut)}
                            className={`p-3 rounded-xl transition-all ${!isSuspended ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-600 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-600 hover:text-white'}`}
                            title={!isSuspended ? "Suspendre l'article" : "Rétablir l'article"}
                          >
                            {!isSuspended ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                            title="Supprimer l'article"
                          >
                            <Icons.Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredProduits.length === 0 && !loading && (
          <div className="p-24 text-center">
            <Icons.PackageX className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}