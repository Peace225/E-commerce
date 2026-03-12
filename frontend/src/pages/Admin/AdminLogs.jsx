import { useEffect, useState } from "react";
import { db } from "../../utils/firebaseConfig";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Tous");

  // 🔄 RÉCUPÉRATION DES LOGS (Historique système)
  useEffect(() => {
    // Note : Pour voir des données ici, tu devras créer une collection "logs"
    // et y ajouter un document à chaque action admin (ex: bannissement, retrait, etc.)
    const q = query(collection(db, "logs"), orderBy("createdAt", "desc"), limit(100));
    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 📥 FONCTION : EXPORTER EN CSV (EXCEL)
  const exportToCSV = () => {
    if (logs.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    // 1. Définir les en-têtes du fichier
    const headers = ["Date", "Administrateur", "Module", "Action", "Détails"];
    
    // 2. Formater les données
    const rows = filteredLogs.map(log => {
      const dateStr = log.createdAt?.toDate ? log.createdAt.toDate().toLocaleString('fr-FR') : "Date inconnue";
      return [
        `"${dateStr}"`, 
        `"${log.adminEmail || "Système"}"`, 
        `"${log.module || "Général"}"`, 
        `"${log.action || "Action enregistrée"}"`, 
        `"${log.details || ""}"`
      ];
    });

    // 3. Assembler le fichier CSV
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    // 4. Déclencher le téléchargement
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rynek_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔍 FILTRAGE
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "Tous" || log.module === filterType;
    return matchesSearch && matchesType;
  });

  // 🎨 COULEURS DES BADGES SELON LE MODULE
  const moduleColors = {
    "Finances": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Sécurité": "bg-red-500/10 text-red-500 border-red-500/20",
    "Utilisateurs": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Catalogue": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  return (
    <div className="space-y-10 pb-10">
      
      {/* 🔹 HEADER & BOUTON D'EXPORT */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Audit & <span className="text-red-500">Sécurité</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Boîte noire du système Rynek Pro
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" placeholder="Chercher une action, un email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-white focus:border-red-500 outline-none transition-all"
            />
          </div>
          <select 
            value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#0f172a] border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl outline-none"
          >
            <option value="Tous">Tous les Modules</option>
            <option value="Finances">Finances</option>
            <option value="Sécurité">Sécurité</option>
            <option value="Utilisateurs">Utilisateurs</option>
            <option value="Catalogue">Catalogue</option>
          </select>

          {/* 📥 LE BOUTON MAGIQUE EXPORT CSV */}
          <button 
            onClick={exportToCSV}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <Icons.Download size={16} /> Exporter CSV
          </button>
        </div>
      </div>

      {/* 🔹 TABLEAU DES LOGS (HISTORIQUE) */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Horodatage</th>
                <th className="p-8">Administrateur</th>
                <th className="p-8 text-center">Module</th>
                <th className="p-8">Action & Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredLogs.map((log, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={log.id} className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <Icons.Activity size={16} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-xs">{log.createdAt?.toDate().toLocaleDateString('fr-FR')}</span>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{log.createdAt?.toDate().toLocaleTimeString('fr-FR')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="text-sm font-black text-slate-300">{log.adminEmail || "Système Automatique"}</span>
                    </td>
                    <td className="p-8 text-center">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${moduleColors[log.module] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                        {log.module || "Général"}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white uppercase tracking-tight">{log.action}</span>
                        <span className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed max-w-md">{log.details}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && !loading && (
          <div className="p-24 text-center">
            <Icons.ShieldCheck className="mx-auto text-emerald-500 mb-4" size={48} />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Aucune anomalie détectée</p>
            <p className="text-slate-600 text-xs mt-2">Le journal d'audit est vide.</p>
          </div>
        )}
      </div>
    </div>
  );
}