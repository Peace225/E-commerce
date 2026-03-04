import { useState, useEffect } from "react";
import { db } from "../../utils/firebaseConfig";
import { 
  collection, onSnapshot, query, orderBy, 
  writeBatch, doc, increment 
} from "firebase/firestore";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [activeTab, setActiveTab] = useState("En attente"); // "En attente" ou "Payé"
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Synchronisation de TOUTES les commissions pour les statistiques
  useEffect(() => {
    const q = query(collection(db, "commissions"), orderBy("createdAt", "desc"));
    
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCommissions(docs);
      setLoading(false);
    });
    
    return () => unsub();
  }, []);

  // 🔍 Filtrage logique
  const filteredCommissions = commissions.filter(c => (c.statut || "En attente") === activeTab);
  
  // 📊 Calcul des Statistiques
  const stats = {
    aReverser: commissions.filter(c => (c.statut || "En attente") === "En attente").reduce((acc, c) => acc + (c.montant || 0), 0),
    dejaPaye: commissions.filter(c => c.statut === "Payé").reduce((acc, c) => acc + (c.montant || 0), 0),
    totalTransactions: commissions.length
  };

  // 🚀 FONCTION : PAYER TOUT LE MONDE (BATCH UPDATE)
  const handleSolderTout = async () => {
    const pendingCommissions = commissions.filter(c => (c.statut || "En attente") === "En attente");
    
    if (pendingCommissions.length === 0) return;
    if (!window.confirm(`Confirmez-vous le paiement global de ${stats.aReverser.toLocaleString()} F pour ${pendingCommissions.length} transactions ?\n\nCela créditera automatiquement les portefeuilles des ambassadeurs.`)) return;

    setIsProcessing(true);
    const batch = writeBatch(db);

    try {
      pendingCommissions.forEach((c) => {
        // 1. Mettre à jour le statut de la commission
        const commissionRef = doc(db, "commissions", c.id);
        batch.update(commissionRef, { 
          statut: "Payé",
          payeLe: new Date() 
        });

        // 2. Créditer le portefeuille de l'utilisateur (si l'UID est stocké)
        if (c.utilisateurUid) {
          const userRef = doc(db, "users", c.utilisateurUid);
          batch.update(userRef, { balance: increment(c.montant) });
        }
      });

      await batch.commit();
      alert("✅ Reversements effectués avec succès !");
      setActiveTab("Payé"); // Bascule sur l'historique après paiement
    } catch (error) {
      console.error("Erreur lors du paiement global:", error);
      alert("❌ Erreur lors du traitement.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-10 pb-10">
      
      {/* 🔹 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-orange-500/20 shadow-2xl flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 text-orange-500 group-hover:scale-110 transition-transform"><Icons.AlertCircle size={100} /></div>
          <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 relative z-10"><Icons.Clock size={24} /></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dette Affiliation</p>
            <h3 className="text-3xl font-black text-white">{stats.aReverser.toLocaleString()} <span className="text-sm text-orange-500">F</span></h3>
          </div>
        </div>

        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform"><Icons.CheckCircle2 size={100} /></div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 relative z-10"><Icons.TrendingUp size={24} /></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Reversé</p>
            <h3 className="text-3xl font-black text-white">{stats.dejaPaye.toLocaleString()} <span className="text-sm text-emerald-500">F</span></h3>
          </div>
        </div>

        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-blue-500/20 shadow-2xl flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 text-blue-500 group-hover:scale-110 transition-transform"><Icons.Activity size={100} /></div>
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 relative z-10"><Icons.Network size={24} /></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Flux Réseau</p>
            <h3 className="text-3xl font-black text-white">{stats.totalTransactions} <span className="text-sm text-blue-500">Trans.</span></h3>
          </div>
        </div>
      </div>

      {/* 🔹 HEADER & CONTRÔLES */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Audit des <span className="text-red-500">Commissions</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Gestion de la trésorerie ambassadeurs
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Onglets */}
          <div className="flex bg-[#0f172a] p-1.5 rounded-2xl border border-white/5 shadow-inner w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("En attente")}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "En attente" ? "bg-orange-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}
            >
              En attente
            </button>
            <button
              onClick={() => setActiveTab("Payé")}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "Payé" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}
            >
              Historique
            </button>
          </div>

          {/* Bouton d'action dynamique */}
          {activeTab === "En attente" ? (
            <button 
              onClick={handleSolderTout}
              disabled={isProcessing || filteredCommissions.length === 0}
              className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg flex justify-center items-center gap-3"
            >
              {isProcessing ? <Icons.Loader2 className="animate-spin" size={16} /> : <Icons.Wallet size={16} />}
              Payer {stats.aReverser.toLocaleString()} F
            </button>
          ) : (
            <button className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg flex justify-center items-center gap-3">
              <Icons.Download size={16} /> Exporter CSV
            </button>
          )}
        </div>
      </div>

      {/* 🔹 TABLEAU DES FLUX */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Bénéficiaire (Parrain)</th>
                <th className="p-8">Origine (Vente Filleul)</th>
                <th className="p-8 text-center">Niveau</th>
                <th className="p-8 text-center">Date</th>
                <th className="p-8 text-right">Gain Reversé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredCommissions.map((c, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.05 }}
                    key={c.id} className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTab === 'Payé' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                          <Icons.UserCheck size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white text-xs uppercase tracking-tight">{c.utilisateurEmail}</span>
                          <span className="text-[9px] text-slate-500 font-bold italic">Réf: {c.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-300">{c.filleulEmail}</span>
                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">Achat validé</span>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        Lvl {c.niveau || 1}
                      </span>
                    </td>
                    <td className="p-8 text-center">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        {c.createdAt?.toDate().toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-black text-sm ${activeTab === 'Payé' ? 'text-emerald-400' : 'text-orange-400'}`}>
                          +{c.montant?.toLocaleString()} F
                        </span>
                        <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-1">
                          {activeTab}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredCommissions.length === 0 && !loading && (
          <div className="p-24 text-center">
            <Icons.Archive className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Aucune donnée dans cet onglet</p>
          </div>
        )}
      </div>
    </div>
  );
}