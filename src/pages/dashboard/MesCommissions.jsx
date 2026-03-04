import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export default function MesCommissions() {
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    const data = [
      { id: 1, source: "Affiliation - Imane Boutik", montant: 5000, date: "2026-02-10", statut: "Reçue", type: "Vente" },
      { id: 2, source: "Bonus Inscription Réseau", montant: 1000, date: "2026-02-12", statut: "Reçue", type: "Bonus" },
      { id: 3, source: "Affiliation - Daji's Food", montant: 2000, date: "2026-02-15", statut: "En attente", type: "Vente" },
    ];
    setCommissions(data);
  }, []);

  const totalCommissions = commissions.reduce((sum, c) => sum + c.montant, 0);

  return (
    <div className="space-y-10 pb-20">
      
      {/* 🔹 HEADER PRESTIGE */}
      <header className="bg-[#0f172a] p-10 rounded-[3rem] border border-white/5 shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="bg-emerald-500/10 text-emerald-500 w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-500/20">
              Portefeuille Actif
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Mes <span className="text-emerald-500">Gains</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 italic">
              Suivi de vos revenus d'affiliation Rynek
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md text-center">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-2">Solde Total</p>
              <h2 className="text-3xl font-black text-white italic">
                {totalCommissions.toLocaleString()} <small className="text-emerald-500 text-sm not-italic font-bold">FCFA</small>
              </h2>
            </div>
          </div>
        </div>
        <Icons.TrendingUp size={200} className="absolute -right-10 -bottom-10 text-white/5" />
      </header>

      {/* 🔹 GRILLE DE RÉSUMÉ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Ventes Réseau", val: "7,000 F", icon: <Icons.Users />, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Bonus Directs", val: "1,000 F", icon: <Icons.Zap />, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "En attente", val: "2,000 F", icon: <Icons.Clock />, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5">
            <div className={`${item.bg} ${item.color} p-4 rounded-2xl`}>{item.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
              <h3 className="text-xl font-black text-slate-900">{item.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 TABLEAU DES GAINS DESIGN */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black uppercase text-xs tracking-tighter text-slate-900">Journal des transactions</h3>
          <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl">
            <Icons.Download size={14} /> Exporter relevé
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Origine du gain</th>
                <th className="p-8">Type</th>
                <th className="p-8">Montant</th>
                <th className="p-8">Date</th>
                <th className="p-8 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {commissions.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Icons.ArrowUpRight size={18} />
                      </div>
                      <span className="font-black text-slate-900 uppercase text-xs">{c.source}</span>
                    </div>
                  </td>
                  <td className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.type}</td>
                  <td className="p-8">
                    <span className="text-lg font-black text-slate-900">+{c.montant.toLocaleString()} <small className="text-[10px]">F</small></span>
                  </td>
                  <td className="p-8 text-slate-400 font-bold text-xs">{c.date}</td>
                  <td className="p-8 text-right">
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border 
                      ${c.statut === "Reçue" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"}`}>
                      {c.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}