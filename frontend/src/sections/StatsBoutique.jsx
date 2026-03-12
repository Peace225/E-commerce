import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function StatsBoutique({ produits, wallet }) {
  // Simulation de données de performance
  const stats = [
    { label: "Revenu Total", value: "125,400 F", icon: <Icons.Banknote />, color: "text-emerald-500" },
    { label: "Taux de Conversion", value: "12.5%", icon: <Icons.Zap />, color: "text-orange-500" },
    { label: "Clics sur Lien", value: "1,042", icon: <Icons.MousePointer2 />, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-8">
      {/* 🔹 CHIFFRES CLÉS PRO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">{s.label}</p>
              <h3 className="text-2xl font-black text-white">{s.value}</h3>
            </div>
            <div className={`${s.color} bg-white/5 p-4 rounded-2xl`}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 🔹 GRAPHIQUE DES VENTES (VISUEL) */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-white font-black uppercase text-xs tracking-widest">Flux de revenus (7 derniers jours)</h3>
            <span className="text-emerald-500 font-black text-[10px] uppercase">+14% ce mois</span>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-3">
            {[20, 45, 30, 80, 60, 95, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                <motion.div 
                  initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  className={`w-full rounded-t-xl ${i === 5 ? 'bg-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-white/10'}`}
                />
                <span className="text-[8px] font-black text-slate-600 uppercase">J-{6-i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 RÉPARTITION DES PROFITS */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex flex-col justify-center">
          <h3 className="text-white font-black uppercase text-xs tracking-widest mb-8 text-center">Origine des Profits</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase">
                <span>Ventes Directes</span>
                <span className="text-orange-500">70%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[70%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase">
                <span>Commissions Réseau</span>
                <span className="text-blue-500">30%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[30%]"></div>
              </div>
            </div>
          </div>
          <p className="mt-10 text-[10px] text-slate-500 italic text-center leading-relaxed">
            "L'affiliation génère des revenus passifs même quand votre boutique est fermée."
          </p>
        </div>
      </div>
    </div>
  );
}