import { useEffect, useState } from "react";
import { useAuth } from "../../contexte/AuthContext";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient";

export default function AdminFinances() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("Bons_Achat"); // 🔄 Changement d'onglet par défaut
  const [loading, setLoading] = useState(true);

  // 1️⃣ États Modale Dépôt/Prélèvement
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState("add"); 
  const [adjustMotif, setAdjustMotif] = useState(""); 
  const [isProcessing, setIsProcessing] = useState(false);

  // 2️⃣ États Modale Retrait Admin (Le seul vrai retrait cash)
  const [isAdminWithdrawOpen, setIsAdminWithdrawOpen] = useState(false);
  const [adminWithdrawAmount, setAdminWithdrawAmount] = useState("");
  const [adminWithdrawMotif, setAdminWithdrawMotif] = useState("");

  // 🔄 SYNCHRONISATION
  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const { data: usersData, error: usersError } = await supabase.from('users').select('*');
        if (!usersError && usersData) setUsers(usersData);

        const { data: trxData, error: trxError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });
        if (!trxError && trxData) setTransactions(trxData);
      } catch (error) {
        console.error("Erreur chargement finances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinances();

    const channel = supabase.channel('admin-finances-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchFinances())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchFinances())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // 🎫 VALIDATION : CONVERSION EN BON D'ACHAT
  const handleProcessVoucher = async (trx, action) => {
    const isApprove = action === "approve";
    const msg = isApprove 
      ? `✅ Confirmez-vous la création d'un BON D'ACHAT de ${trx.amount?.toLocaleString()} F pour ce client ?` 
      : `❌ Refuser cette demande et restituer les ${trx.amount?.toLocaleString()} F sur son solde ?`;

    if (!window.confirm(msg)) return;

    try {
      if (isApprove) {
        // 🚀 Logique métier : Le statut passe à "Bon Généré"
        // (Idéalement, ici on pourrait appeler une fonction pour créer un code promo réel)
        await supabase.from('transactions')
          .update({ 
            status: "Bon Généré", 
            updated_at: new Date().toISOString() 
          })
          .eq('id', trx.id);
        
        alert("✅ Bon d'achat généré et envoyé au client !");
      } else {
        // 🔄 Refus : On annule et on rembourse le solde virtuel
        await supabase.from('transactions')
          .update({ status: "Annulé (Solde restitué)", updated_at: new Date().toISOString() })
          .eq('id', trx.id);
        
        const userId = trx.user_id || trx.userId;
        const userToRefund = users.find(u => u.id === userId);
        
        if (userToRefund) {
          const newBalance = (userToRefund.balance || 0) + (trx.amount || trx.montant || 0);
          await supabase.from('users').update({ balance: newBalance }).eq('id', userId);
        }
        alert("✅ Demande refusée, solde virtuel recrédité.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de traitement.");
    }
  };

  // 💰 AJUSTEMENT MANUEL DU SOLDE
  const handleManualTransaction = async (e) => {
    e.preventDefault();
    if (!adjustAmount || isNaN(adjustAmount) || adjustAmount <= 0) return;
    if (!adjustMotif.trim()) { alert("Veuillez saisir un motif pour l'audit."); return; }

    setIsProcessing(true);
    const amount = Number(adjustAmount);
    const finalAmount = adjustType === "add" ? amount : -amount;

    if (adjustType === "subtract" && (selectedUser.balance || 0) < amount) {
      alert("❌ Opération impossible : le solde virtuel ne peut pas être négatif.");
      setIsProcessing(false);
      return;
    }

    try {
      const newBalance = (selectedUser.balance || 0) + finalAmount;
      await supabase.from('users').update({ balance: newBalance }).eq('id', selectedUser.id);
      
      await supabase.from('transactions').insert([{
        user_id: selectedUser.id,
        user_email: selectedUser.email,
        type: "system",
        title: adjustType === "add" ? "Crédit Cadeau/SAV (Admin)" : "Correction Solde (Admin)",
        amount: amount,
        motif: adjustMotif,
        status: "Complété",
        created_at: new Date().toISOString()
      }]);

      alert("✅ Ajustement du portefeuille virtuel exécuté !");
      setIsEditModalOpen(false);
      setAdjustAmount("");
      setAdjustMotif("");
    } catch (error) {
      console.error(error);
      alert("❌ Échec de la transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 👑 RETRAIT ADMINISTRATEUR (Le seul vrai retrait cash)
  const handleAdminWithdrawal = async (e) => {
    e.preventDefault();
    if (!adminWithdrawAmount || isNaN(adminWithdrawAmount) || adminWithdrawAmount <= 0) return;
    
    const adminId = currentAdmin?.id;
    const currentAdminData = users.find(u => u.id === adminId);
    
    if ((currentAdminData?.balance || 0) < Number(adminWithdrawAmount)) {
      alert("❌ Ton solde Admin est insuffisant pour ce retrait cash.");
      return;
    }

    setIsProcessing(true);
    try {
      const newAdminBalance = (currentAdminData.balance || 0) - Number(adminWithdrawAmount);
      await supabase.from('users').update({ balance: newAdminBalance }).eq('id', adminId);
      
      await supabase.from('transactions').insert([{
        user_id: adminId,
        user_email: currentAdmin.email,
        type: "admin_withdrawal",
        title: "Retrait Cash (Admin)",
        amount: Number(adminWithdrawAmount),
        method: adminWithdrawMotif || "Virement Bancaire / Cash",
        status: "Complété",
        created_at: new Date().toISOString()
      }]);

      alert("👑 Retrait Cash Admin validé avec succès !");
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

  // 📊 KPIs ADAPTÉS AUX BONS D'ACHAT
  const voucherRequests = transactions.filter(t => t.type === "withdrawal" || t.type === "voucher_request");
  const pendingVouchers = voucherRequests.filter(t => t.status === "En attente");
  const stats = {
    totalCredits: users.reduce((acc, u) => acc + (u.balance || 0), 0),
    totalPendingVouchers: pendingVouchers.reduce((acc, t) => acc + (t.amount || t.montant || 0), 0),
    totalGeneratedVouchers: voucherRequests.filter(t => t.status === "Bon Généré" || t.status === "Complété").reduce((acc, t) => acc + (t.amount || t.montant || 0), 0)
  };

  const adminProfile = users.find(u => u.id === currentAdmin?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      
      {/* 🔹 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500"><Icons.Gift size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Crédits Clients (Non convertis)</p>
            <h3 className="text-3xl font-black text-white">{stats.totalCredits.toLocaleString()} <span className="text-sm text-emerald-500">F</span></h3>
          </div>
        </div>
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-orange-500/20 shadow-2xl flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500"><Icons.Clock size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Demandes de Bons</p>
            <h3 className="text-3xl font-black text-white">{stats.totalPendingVouchers.toLocaleString()} <span className="text-sm text-orange-500">F</span></h3>
          </div>
        </div>
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-blue-500/20 shadow-2xl flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500"><Icons.Ticket size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bons Générés</p>
            <h3 className="text-3xl font-black text-white">{stats.totalGeneratedVouchers.toLocaleString()} <span className="text-sm text-blue-500">F</span></h3>
          </div>
        </div>
      </div>

      {/* 🔹 HEADER & ONGLETS */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Centre <span className="text-red-500">Financier</span></h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Supervision des Bons d'Achat & Crédits</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="flex bg-[#0f172a] p-1.5 rounded-2xl border border-white/5 shadow-inner w-full sm:w-auto">
            <button onClick={() => setActiveTab("Bons_Achat")} className={`flex-1 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "Bons_Achat" ? "bg-red-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>Demandes de Bons</button>
            <button onClick={() => setActiveTab("Soldes")} className={`flex-1 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "Soldes" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>Crédits Virtuels</button>
          </div>

          {/* 👑 BOUTON RETRAIT ADMIN */}
          <button 
            onClick={() => setIsAdminWithdrawOpen(true)}
            className="px-6 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex justify-center items-center gap-2"
          >
            <Icons.Crown size={16} /> Mon Retrait Cash
          </button>
        </div>
      </div>

      {/* 🔹 VUE 1 : DEMANDES DE BONS D'ACHAT */}
      {activeTab === "Bons_Achat" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {pendingVouchers.length === 0 ? (
            <div className="bg-[#0f172a] p-16 rounded-[2.5rem] text-center border border-white/5 shadow-2xl">
              <Icons.Ticket size={48} className="text-emerald-500 mx-auto mb-4" />
              <p className="text-white font-black uppercase tracking-widest">Aucune demande de bon d'achat</p>
            </div>
          ) : (
            pendingVouchers.map((trx) => (
              <div key={trx.id} className="bg-[#0f172a] p-6 rounded-[2rem] border border-orange-500/30 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center"><Icons.Gift size={20}/></div>
                  <div>
                    <h4 className="text-white font-black uppercase text-sm">{users.find(u => u.id === (trx.user_id || trx.userId))?.full_name || "Client Anonyme"}</h4>
                    <p className="text-slate-400 text-xs font-bold mt-1">Sujet : <span className="text-orange-400 uppercase tracking-widest">Conversion en Bon d'Achat</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-8 justify-between w-full md:w-auto">
                  <h2 className="text-3xl font-black text-white">{(trx.amount || trx.montant || 0).toLocaleString()} <span className="text-sm text-orange-500">F</span></h2>
                  <div className="flex gap-2">
                    <button onClick={() => handleProcessVoucher(trx, "approve")} className="px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-colors font-black text-[10px] uppercase flex items-center gap-2">
                      <Icons.Check size={16} /> Générer le bon
                    </button>
                    <button onClick={() => handleProcessVoucher(trx, "reject")} className="p-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors" title="Refuser et rembourser le crédit">
                      <Icons.X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* 🔹 VUE 2 : SOLDES (Crédits virtuels) */}
      {activeTab === "Soldes" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Membre</th><th className="p-8">Rôle</th><th className="p-8">Crédit Disponible</th><th className="p-8 text-right">Contrôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.sort((a, b) => (b.balance || 0) - (a.balance || 0)).map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-8"><div className="flex flex-col"><span className="font-black text-white text-xs uppercase">{u.full_name || u.displayName || "Client"}</span><span className="text-[10px] text-slate-500">{u.email}</span></div></td>
                  <td className="p-8"><span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${u.role === 'admin' || u.is_admin ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{u.role || "user"}</span></td>
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

      {/* 👑 MODALE : RETRAIT ADMINISTRATEUR (inchangée, le boss prend du cash) */}
      <AnimatePresence>
        {isAdminWithdrawOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0f172a] rounded-[3rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-red-500/30">
              <div className="flex items-center gap-3 mb-6">
                <Icons.Crown className="text-red-500" size={28} />
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Retrait Boss (Cash)</h2>
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
                    {isProcessing ? <Icons.Loader2 className="animate-spin" size={18} /> : "Sortir les fonds en Cash"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔹 MODALE : AJUSTEMENT CRÉDITS CLIENTS */}
      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0f172a] rounded-[3rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-white/10">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-1">Ajustement Crédit Virtuel</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Client : {selectedUser.email}</p>
              
              <div className="bg-white/5 p-4 rounded-2xl mb-6 text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Crédit Actuel</p>
                <h3 className="text-2xl font-black text-emerald-400">{(selectedUser.balance || 0).toLocaleString()} F</h3>
              </div>

              <form onSubmit={handleManualTransaction} className="space-y-5">
                <div className="flex bg-white/5 p-1 rounded-2xl">
                  <button type="button" onClick={() => setAdjustType("add")} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adjustType === "add" ? "bg-emerald-500 text-white" : "text-slate-400"}`}>Offrir (+)</button>
                  <button type="button" onClick={() => setAdjustType("subtract")} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adjustType === "subtract" ? "bg-red-500 text-white" : "text-slate-400"}`}>Retirer (-)</button>
                </div>

                <div className="space-y-4">
                  <input type="number" required min="1" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} placeholder="Montant en FCFA" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-lg font-black text-white focus:border-red-500 outline-none transition-all" />
                  <input type="text" required value={adjustMotif} onChange={(e) => setAdjustMotif(e.target.value)} placeholder="Motif (ex: Cadeau bienvenue, Remboursement SAV...)" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:border-red-500 outline-none transition-all" />
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="button" disabled={isProcessing} onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-white/5 text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10">Annuler</button>
                  <button type="submit" disabled={isProcessing} className={`flex-[2] py-4 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex justify-center items-center ${adjustType === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                    {isProcessing ? <Icons.Loader2 className="animate-spin" size={18} /> : "Valider l'ajustement"}
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