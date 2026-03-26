import { useEffect, useState } from "react";

import { useAuth } from "../../contexte/AuthContext";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminFinances() {
  const { user: currentAdmin } = useAuth(); // 👑 Récupération de l'Admin connecté
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("Retraits"); 
  const [loading, setLoading] = useState(true);

  // 1️⃣ États Modale Dépôt/Prélèvement (Action sur les clients)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState("add"); 
  const [adjustMotif, setAdjustMotif] = useState(""); 
  const [isProcessing, setIsProcessing] = useState(false);

  // 2️⃣ États Modale Retrait Admin (Tes propres retraits)
  const [isAdminWithdrawOpen, setIsAdminWithdrawOpen] = useState(false);
  const [adminWithdrawAmount, setAdminWithdrawAmount] = useState("");
  const [adminWithdrawMotif, setAdminWithdrawMotif] = useState("");

  // 🔄 SYNCHRONISATION
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qTrx = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    const unsubTrx = onSnapshot(qTrx, (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => { unsubUsers(); unsubTrx(); };
  }, []);

  // 💸 VALIDATION RETRAIT CLIENTS
  const handleProcessWithdrawal = async (trx, action) => {
    if (!window.confirm(action === "approve" ? "✅ Payer ce retrait ?" : "❌ Refuser et rembourser ?")) return;

    try {
      if (action === "approve") {
        await updateDoc(doc(db, "transactions", trx.id), { status: "Complété", updatedAt: serverTimestamp() });
        alert("✅ Retrait client payé.");
      } else {
        await updateDoc(doc(db, "transactions", trx.id), { status: "Annulé (Remboursé)", updatedAt: serverTimestamp() });
        await updateDoc(doc(db, "users", trx.userId), { balance: increment(trx.amount) });
        alert("✅ Fonds restitués au client.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de traitement.");
    }
  };

  // 💰 TRANSACTION MANUELLE SUR UN CLIENT
  const handleManualTransaction = async (e) => {
    e.preventDefault();
    if (!adjustAmount || isNaN(adjustAmount) || adjustAmount <= 0) return;
    if (!adjustMotif.trim()) { alert("Veuillez saisir un motif pour l'audit."); return; }

    setIsProcessing(true);
    const amount = Number(adjustAmount);
    const finalAmount = adjustType === "add" ? amount : -amount;

    if (adjustType === "subtract" && (selectedUser.balance || 0) < amount) {
      alert("❌ Opération impossible : le solde du client ne peut pas être négatif.");
      setIsProcessing(false);
      return;
    }

    try {
      await updateDoc(doc(db, "users", selectedUser.id), { balance: increment(finalAmount) });
      
      await addDoc(collection(db, "transactions"), {
        userId: selectedUser.id,
        userEmail: selectedUser.email,
        type: "system",
        title: adjustType === "add" ? "Dépôt (Admin)" : "Prélèvement (Admin)",
        amount: amount,
        motif: adjustMotif,
        status: "Complété",
        createdAt: serverTimestamp()
      });

      alert("✅ Transaction manuelle exécutée !");
      setIsEditModalOpen(false);
      setAdjustAmount("");
      setAdjustMotif("");
    } catch (error) {
      console.error(error);
      alert("❌ Échec.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 👑 RETRAIT ADMINISTRATEUR (Ton argent)
  const handleAdminWithdrawal = async (e) => {
    e.preventDefault();
    if (!adminWithdrawAmount || isNaN(adminWithdrawAmount) || adminWithdrawAmount <= 0) return;
    
    // Optionnel : Tu peux vérifier si ton solde admin est suffisant, 
    // ou retirer directement de la trésorerie globale. Ici on déduit de ton propre wallet Admin.
    const currentAdminData = users.find(u => u.id === currentAdmin?.uid);
    if ((currentAdminData?.balance || 0) < Number(adminWithdrawAmount)) {
      alert("❌ Ton solde Admin est insuffisant pour ce retrait.");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Déduire de ton solde admin
      await updateDoc(doc(db, "users", currentAdmin.uid), { 
        balance: increment(-Number(adminWithdrawAmount)) 
      });
      
      // 2. Créer la trace instantanément "Complétée"
      await addDoc(collection(db, "transactions"), {
        userId: currentAdmin.uid,
        userEmail: currentAdmin.email,
        type: "admin_withdrawal",
        title: "Retrait Administrateur",
        amount: Number(adminWithdrawAmount),
        method: adminWithdrawMotif || "Virement Bancaire / Cash",
        status: "Complété",
        createdAt: serverTimestamp()
      });

      alert("👑 Retrait Admin validé avec succès !");
      setIsAdminWithdrawOpen(false);
      setAdminWithdrawAmount("");
      setAdminWithdrawMotif("");
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de ton retrait.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 📊 KPIs
  const withdrawals = transactions.filter(t => t.type === "withdrawal" || t.type === "admin_withdrawal");
  const pendingWithdrawals = withdrawals.filter(t => t.status === "En attente");
  const stats = {
    totalTresorerie: users.reduce((acc, u) => acc + (u.balance || 0), 0),
    totalPending: pendingWithdrawals.reduce((acc, t) => acc + (t.amount || 0), 0),
    totalPaid: withdrawals.filter(t => t.status === "Complété").reduce((acc, t) => acc + (t.amount || 0), 0)
  };

  // Récupérer tes propres données Admin
  const adminProfile = users.find(u => u.id === currentAdmin?.uid);

  return (
    <div className="space-y-10 pb-10">
      
      {/* 🔹 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500"><Icons.Wallet size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trésorerie des Wallets</p>
            <h3 className="text-3xl font-black text-white">{stats.totalTresorerie.toLocaleString()} <span className="text-sm text-emerald-500">F</span></h3>
          </div>
        </div>
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-orange-500/20 shadow-2xl flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500"><Icons.Clock size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Retraits en attente</p>
            <h3 className="text-3xl font-black text-white">{stats.totalPending.toLocaleString()} <span className="text-sm text-orange-500">F</span></h3>
          </div>
        </div>
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-blue-500/20 shadow-2xl flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500"><Icons.CheckCircle2 size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Retraits Payés</p>
            <h3 className="text-3xl font-black text-white">{stats.totalPaid.toLocaleString()} <span className="text-sm text-blue-500">F</span></h3>
          </div>
        </div>
      </div>

      {/* 🔹 HEADER & ONGLETS */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Centre <span className="text-red-500">Financier</span></h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Supervision des portefeuilles</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="flex bg-[#0f172a] p-1.5 rounded-2xl border border-white/5 shadow-inner w-full sm:w-auto">
            <button onClick={() => setActiveTab("Retraits")} className={`flex-1 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "Retraits" ? "bg-red-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>Retraits</button>
            <button onClick={() => setActiveTab("Soldes")} className={`flex-1 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "Soldes" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>Comptes & Ajustements</button>
          </div>

          {/* 👑 BOUTON RETRAIT ADMIN */}
          <button 
            onClick={() => setIsAdminWithdrawOpen(true)}
            className="px-6 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex justify-center items-center gap-2"
          >
            <Icons.Crown size={16} /> Mon Retrait Admin
          </button>
        </div>
      </div>

      {/* 🔹 VUE 1 : RETRAITS */}
      {activeTab === "Retraits" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {pendingWithdrawals.length === 0 ? (
            <div className="bg-[#0f172a] p-16 rounded-[2.5rem] text-center border border-white/5 shadow-2xl"><Icons.CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" /><p className="text-white font-black uppercase tracking-widest">Aucun retrait en attente</p></div>
          ) : (
            pendingWithdrawals.map((trx) => (
              <div key={trx.id} className="bg-[#0f172a] p-6 rounded-[2rem] border border-orange-500/30 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center"><Icons.Clock size={20}/></div>
                  <div>
                    <h4 className="text-white font-black uppercase text-sm">{users.find(u => u.id === trx.userId)?.displayName || "Anonyme"}</h4>
                    <p className="text-slate-400 text-xs font-bold mt-1">Méthode : <span className="text-orange-400 uppercase tracking-widest">{trx.method}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-8 justify-between w-full md:w-auto">
                  <h2 className="text-3xl font-black text-white">{trx.amount.toLocaleString()} <span className="text-sm text-orange-500">F</span></h2>
                  <div className="flex gap-2">
                    <button onClick={() => handleProcessWithdrawal(trx, "approve")} className="p-3 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-colors"><Icons.Check size={20} /></button>
                    <button onClick={() => handleProcessWithdrawal(trx, "reject")} className="p-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors"><Icons.X size={20} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* 🔹 VUE 2 : SOLDES */}
      {activeTab === "Soldes" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Membre</th><th className="p-8">Rôle</th><th className="p-8">Solde Actuel</th><th className="p-8 text-right">Contrôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.sort((a, b) => (b.balance || 0) - (a.balance || 0)).map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-8"><div className="flex flex-col"><span className="font-black text-white text-xs uppercase">{u.displayName || "Client"}</span><span className="text-[10px] text-slate-500">{u.email}</span></div></td>
                  <td className="p-8"><span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{u.role || "user"}</span></td>
                  <td className="p-8"><span className="text-emerald-400 font-black text-lg">{(u.balance || 0).toLocaleString()} F</span></td>
                  <td className="p-8 text-right">
                    <button onClick={() => { setSelectedUser(u); setIsEditModalOpen(true); }} className="px-6 py-3 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-xl font-black uppercase text-[10px] tracking-widest inline-flex items-center gap-2 transition-all">
                      <Icons.Settings2 size={14} /> Ajuster
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* 👑 MODALE : RETRAIT ADMINISTRATEUR */}
      <AnimatePresence>
        {isAdminWithdrawOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0f172a] rounded-[3rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-red-500/30">
              <div className="flex items-center gap-3 mb-6">
                <Icons.Crown className="text-red-500" size={28} />
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Retrait Boss</h2>
              </div>
              
              <div className="bg-white/5 p-4 rounded-2xl mb-6 flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ton Solde Admin :</p>
                <h3 className="text-xl font-black text-emerald-400">{(adminProfile?.balance || 0).toLocaleString()} F</h3>
              </div>

              <form onSubmit={handleAdminWithdrawal} className="space-y-4">
                <input type="number" required min="1" value={adminWithdrawAmount} onChange={(e) => setAdminWithdrawAmount(e.target.value)} placeholder="Montant à retirer (FCFA)" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-lg font-black text-white focus:border-red-500 outline-none transition-all" />
                <input type="text" required value={adminWithdrawMotif} onChange={(e) => setAdminWithdrawMotif(e.target.value)} placeholder="Destination (ex: Wave, Orange, Banque...)" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:border-red-500 outline-none transition-all" />

                <div className="flex gap-4 mt-8">
                  <button type="button" disabled={isProcessing} onClick={() => setIsAdminWithdrawOpen(false)} className="flex-1 py-4 bg-white/5 text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10">Annuler</button>
                  <button type="submit" disabled={isProcessing} className="flex-[2] py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex justify-center items-center">
                    {isProcessing ? <Icons.Loader2 className="animate-spin" size={18} /> : "Sortir les fonds"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔹 MODALE : DÉPÔT / PRÉLÈVEMENT CLIENT */}
      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0f172a] rounded-[3rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-white/10">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-1">Ajustement Caisse</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Client : {selectedUser.email}</p>
              
              <div className="bg-white/5 p-4 rounded-2xl mb-6 text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Solde Actuel</p>
                <h3 className="text-2xl font-black text-emerald-400">{(selectedUser.balance || 0).toLocaleString()} F</h3>
              </div>

              <form onSubmit={handleManualTransaction} className="space-y-5">
                <div className="flex bg-white/5 p-1 rounded-2xl">
                  <button type="button" onClick={() => setAdjustType("add")} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adjustType === "add" ? "bg-emerald-500 text-white" : "text-slate-400"}`}>Créditer (+)</button>
                  <button type="button" onClick={() => setAdjustType("subtract")} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adjustType === "subtract" ? "bg-red-500 text-white" : "text-slate-400"}`}>Débiter (-)</button>
                </div>

                <div className="space-y-4">
                  <input type="number" required min="1" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} placeholder="Montant en FCFA" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-lg font-black text-white focus:border-red-500 outline-none transition-all" />
                  <input type="text" required value={adjustMotif} onChange={(e) => setAdjustMotif(e.target.value)} placeholder="Motif de l'opération (Obligatoire)" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:border-red-500 outline-none transition-all" />
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="button" disabled={isProcessing} onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-white/5 text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10">Annuler</button>
                  <button type="submit" disabled={isProcessing} className={`flex-[2] py-4 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex justify-center items-center ${adjustType === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                    {isProcessing ? <Icons.Loader2 className="animate-spin" size={18} /> : "Exécuter l'ordre"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}