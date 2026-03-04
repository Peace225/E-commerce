import { useState, useEffect } from "react";
import { db } from "../../utils/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AffiliationDash({ wallet }) {
  const [filleuls, setFilleuls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilleuls = async () => {
      try {
        const q = query(collection(db, "users"), where("referredBy", "==", wallet?.referralCode));
        const snap = await getDocs(q);
        setFilleuls(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Erreur réseau:", error);
      } finally {
        setLoading(false);
      }
    };

    if (wallet?.referralCode) fetchFilleuls();
    else setLoading(false);
  }, [wallet]);

  const copyLink = () => {
    const link = `https://rynek.com/register?ref=${wallet?.referralCode}`;
    navigator.clipboard.writeText(link);
    alert("Lien ambassadeur copié ! 🚀");
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronisation du réseau...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      
      {/* 🔹 HEADER RÉSEAU ULTRA PRO */}
      <header className="bg-[#0f172a] p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Network <span className="text-orange-500">Center</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-4 italic">
              Gestionnaire d'affiliation Rynek Pro
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 w-full max-w-md shadow-inner">
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Votre identifiant unique</p>
            <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/5">
              <span className="flex-1 text-sm font-black text-white tracking-widest pl-2">
                {wallet?.referralCode}
              </span>
              <button 
                onClick={copyLink}
                className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-xl transition-all active:scale-95 flex items-center gap-2"
              >
                <Icons.Share2 size={16} />
                <span className="text-[9px] font-black uppercase">Copier Link</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 🔹 KPIs DU RÉSEAU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Membres Directs", val: filleuls.length, icon: <Icons.UserPlus />, color: "text-blue-500" },
          { label: "Bonus de Rang", val: "N/A", icon: <Icons.Award />, color: "text-yellow-500" },
          { label: "Gains Générés", val: `${wallet?.referralEarnings || 0} F`, icon: <Icons.TrendingUp />, color: "text-emerald-500" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-orange-500/30 transition-all">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{item.val}</h3>
            </div>
            <div className={`${item.color} bg-slate-50 p-4 rounded-2xl group-hover:scale-110 transition-transform`}>{item.icon}</div>
          </div>
        ))}
      </div>

      {/* 🔹 LISTE DES AFFILIÉS */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black uppercase text-xs tracking-tighter text-slate-900 flex items-center gap-3">
            <Icons.ListTree size={18} className="text-orange-500" /> Arbre des affiliés
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase bg-white px-4 py-2 rounded-full border border-slate-100">
            {filleuls.length} Actifs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Nom du membre</th>
                <th className="p-8">Statut Rang</th>
                <th className="p-8">Date d'adhésion</th>
                <th className="p-8 text-right">Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filleuls.map((f, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.1 }}
                    key={f.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-black text-xs">
                          {f.displayName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 uppercase text-xs">{f.displayName}</span>
                          <span className="text-[9px] text-slate-400 font-bold lowercase">{f.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-100">
                        {f.level || "Bronze"}
                      </span>
                    </td>
                    <td className="p-8 text-slate-400 font-bold text-xs italic">
                      {f.createdAt?.toDate().toLocaleDateString('fr-FR') || "03/03/2026"}
                    </td>
                    <td className="p-8 text-right">
                      <span className="text-emerald-600 font-black text-sm tracking-tighter">+5% de commission</span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filleuls.length === 0 && (
          <div className="p-24 text-center">
            <Icons.UserPlus size={48} className="mx-auto text-slate-200 mb-6" />
            <h4 className="text-slate-900 font-black uppercase text-xs mb-2">Votre arbre est vide</h4>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Partagez votre lien pour construire votre empire</p>
          </div>
        )}
      </div>

    </div>
  );
}