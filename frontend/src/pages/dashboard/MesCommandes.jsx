import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MesCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [filterStatus, setFilterStatus] = useState("toutes");

  // Simulation de récupération de données
  useEffect(() => {
    const data = [
      { id: 1, produit: "T-shirt Homme Rynek Pro", date: "2026-02-23", montant: 12000, statut: "En attente" },
      { id: 2, produit: "Chaussures Sport Elite", date: "2026-02-21", montant: 25000, statut: "Expédiée" },
      { id: 3, produit: "Sac à dos Urban Dark", date: "2026-02-20", montant: 18000, statut: "Livrée" },
      { id: 4, produit: "Montre Connectée Z", date: "2026-02-18", montant: 45000, statut: "Annulée" }
    ];
    setCommandes(data);
  }, []);

  const filteredCommandes = filterStatus === "toutes"
    ? commandes
    : commandes.filter(c => c.statut === filterStatus);

  // Couleurs Ultra Pro pour les statuts
  const statutStyles = {
    "En attente": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "Expédiée": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Livrée": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Annulée": "bg-red-500/10 text-red-500 border-red-500/20"
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* 🔹 HEADER DE SECTION */}
      <header className="bg-[#0f172a] p-10 rounded-[3rem] border border-white/5 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Mes <span className="text-orange-500">Commandes</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 italic">
              Historique et suivi des transactions
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Icons.ShoppingBag size={24} />
            </div>
            <div className="pr-4">
              <p className="text-white text-2xl font-black leading-none">{commandes.length}</p>
              <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Total commandes</p>
            </div>
          </div>
        </div>
      </header>

      {/* 🔹 FILTRES STYLISÉS */}
      <div className="flex flex-wrap gap-3">
        {["toutes", "En attente", "Expédiée", "Livrée", "Annulée"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border
              ${filterStatus === status 
                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "bg-white border-slate-100 text-slate-400 hover:border-orange-500 hover:text-orange-500"}`}
          >
            {status === "toutes" ? "Toutes" : status}
          </button>
        ))}
      </div>

      {/* 🔹 TABLEAU DES COMMANDES DESIGN */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="p-8 border-b border-slate-100">Détails Produit</th>
                <th className="p-8 border-b border-slate-100">Date d'achat</th>
                <th className="p-8 border-b border-slate-100">Montant</th>
                <th className="p-8 border-b border-slate-100">État</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredCommandes.map((c) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={c.id} 
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                          <Icons.Package size={20} />
                        </div>
                        <span className="font-black text-slate-900 uppercase text-xs tracking-tight">{c.produit}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-bold text-sm">{c.date}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">UTC+00:00</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="text-lg font-black text-slate-900 italic">
                        {c.montant.toLocaleString()} <small className="text-[10px] text-slate-400 not-italic">FCFA</small>
                      </span>
                    </td>
                    <td className="p-8">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statutStyles[c.statut]}`}>
                        {c.statut}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredCommandes.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Icons.Inbox size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
              Aucun flux de commande trouvé
            </p>
          </div>
        )}
      </div>

    </div>
  );
}