import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient";

export default function WalletPage({ wallet, user }) {
  // 🔹 ÉTATS
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Wave");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const solde = wallet?.balance || 0;

  // 🔄 1. REQUÊTE : RÉCUPÉRER L'HISTORIQUE SUPABASE
  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTransactions(data);
      }
    };

    fetchTransactions();

    // Abonnement Temps Réel Supabase
    const channel = supabase
      .channel('public:transactions')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          setTransactions(current => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // 💳 2. REQUÊTE : RECHARGER LE COMPTE (DÉPÔT)
  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    setIsProcessing(true);

    try {
      const { error: trxError } = await supabase.from('transactions').insert([{
        user_id: user.id,
        type: "deposit",
        title: "Rechargement Compte",
        amount: Number(amount),
        method: paymentMethod,
        status: "Complété"
      }]);

      if (trxError) throw trxError;

      const newBalance = solde + Number(amount);
      const { error: updateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.id);

      if (updateError) throw updateError;

      alert(`✅ Rechargement de ${amount} F via ${paymentMethod} réussi !`);
      setIsDepositOpen(false);
      setAmount("");
      window.location.reload(); 
    } catch (error) {
      console.error("Erreur de rechargement :", error);
      alert("❌ Une erreur est survenue.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 💸 3. REQUÊTE : RETIRER DE L'ARGENT (WITHDRAW)
  const handleWithdraw = async (e) => {
    e.preventDefault();
    const withdrawAmount = Number(amount);

    if (withdrawAmount > solde) {
      alert("❌ Solde insuffisant pour ce retrait.");
      return;
    }
    
    setIsProcessing(true);

    try {
      const { error: trxError } = await supabase.from('transactions').insert([{
        user_id: user.id,
        type: "withdrawal",
        title: `Retrait vers ${paymentMethod}`,
        amount: withdrawAmount,
        method: paymentMethod,
        status: "En attente"
      }]);

      if (trxError) throw trxError;

      const newBalance = solde - withdrawAmount;
      const { error: updateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.id);

      if (updateError) throw updateError;

      alert(`⏳ Demande de retrait de ${amount} F envoyée.`);
      setIsWithdrawOpen(false);
      setAmount("");
      window.location.reload();
    } catch (error) {
      console.error("Erreur de retrait :", error);
      alert("❌ Une erreur est survenue.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "À l'instant";
    return new Date(isoString).toLocaleDateString('fr-FR', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      
      {/* 🔹 HEADER RESPONSIVE : PORTEFEUILLE & CARTE VIRTUELLE */}
      <header className="bg-[#0f172a] p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col xl:flex-row justify-between items-center gap-8 md:gap-10">
        
        {/* Infos Solde */}
        <div className="relative z-10 text-center xl:text-left w-full xl:w-auto">
          <div className="bg-emerald-500/20 text-emerald-400 w-fit px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest mx-auto xl:mx-0 mb-4 md:mb-6 border border-emerald-500/20 flex items-center gap-1.5">
            <Icons.ShieldCheck size={12} className="md:w-3.5 md:h-3.5" /> Fonds Sécurisés
          </div>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1.5">Solde Disponible</p>
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6 md:mb-8">
            {solde.toLocaleString()} <span className="text-lg md:text-2xl text-emerald-500 font-medium">FCFA</span>
          </h1>
          
          {/* Boutons d'action réduits sur mobile */}
          <div className="flex flex-row items-center gap-2.5 sm:gap-4 justify-center xl:justify-start">
            <button 
              onClick={() => setIsDepositOpen(true)}
              className="flex-1 sm:flex-none bg-white text-slate-900 hover:bg-slate-100 px-4 sm:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[11px] tracking-wider md:tracking-widest transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
            >
              <Icons.ArrowDownToLine size={14} className="text-emerald-500 md:w-[18px] md:h-[18px]" /> Recharger
            </button>
            <button 
              onClick={() => setIsWithdrawOpen(true)}
              className="flex-1 sm:flex-none bg-white/10 text-white hover:bg-white/20 px-4 sm:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[11px] tracking-wider md:tracking-widest border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Icons.ArrowUpFromLine size={14} className="text-orange-500 md:w-[18px] md:h-[18px]" /> Retirer
            </button>
          </div>
        </div>

        {/* Carte Bancaire Virtuelle Rynek */}
        <div className="relative z-10 w-full max-w-[320px] sm:max-w-sm aspect-[1.58/1] bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl md:rounded-[2rem] p-5 md:p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden group transition-transform duration-500">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="font-black italic text-lg md:text-xl uppercase tracking-tighter">RYNEK<span className="text-orange-500">.</span></h3>
              <Icons.Wifi size={20} className="text-slate-400 rotate-90 md:w-6 md:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                <Icons.CreditCard size={26} className="text-slate-300 md:w-8 md:h-8" />
              </div>
              <p className="font-mono text-base md:text-xl tracking-widest text-slate-200">**** **** **** 4092</p>
              <div className="flex justify-between items-end mt-3 md:mt-4">
                <div>
                  <p className="text-[7px] md:text-[8px] uppercase tracking-widest text-slate-400 mb-0.5 md:mb-1">Titulaire</p>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-widest truncate max-w-[130px] md:max-w-[150px]">
                    {wallet?.full_name || "Gérant Rynek"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500/80 mix-blend-multiply"></div>
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-orange-500/80 mix-blend-multiply -ml-2.5 md:ml-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Icons.Coins className="absolute -left-10 -bottom-10 text-white/5 rotate-12 pointer-events-none" size={200} />
      </header>

      {/* 🔹 HISTORIQUE DES TRANSACTIONS COHÉRENT */}
      <div className="bg-white rounded-2xl md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black uppercase text-[10px] md:text-xs tracking-tight text-slate-900 flex items-center gap-2">
            <Icons.History size={16} className="text-slate-500 md:w-[18px] md:h-[18px]" /> Historique de vos mouvements
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[450px] md:min-w-full">
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center">
                      <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Aucune transaction pour le moment.</p>
                    </td>
                  </tr>
                ) : (
                  transactions.map((trx, i) => {
                    const isPositive = trx.type === "commission" || trx.type === "deposit";
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        key={trx.id} 
                        className="hover:bg-slate-50/50 transition-colors group cursor-default"
                      >
                        <td className="p-4 md:p-6">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${isPositive ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-600'}`}>
                              {isPositive ? <Icons.ArrowDownLeft size={16} className="md:w-5 md:h-5" /> : <Icons.ArrowUpRight size={16} className="md:w-5 md:h-5" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-900 uppercase text-[11px] md:text-xs tracking-tight leading-tight">{trx.title}</span>
                              <span className="text-[8px] md:text-[10px] text-slate-400 font-bold tracking-wider md:tracking-widest mt-0.5">
                                {formatDate(trx.created_at)} • {trx.method}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 md:p-6 text-center hidden md:table-cell">
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{trx.id.toString().slice(0, 8)}...</span>
                        </td>
                        <td className="p-4 md:p-6 text-center">
                          <span className={`px-2 py-1 rounded-lg text-[7px] md:text-[9px] font-black uppercase tracking-wider border
                            ${trx.status === 'Complété' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                            {trx.status}
                          </span>
                        </td>
                        <td className="p-4 md:p-6 text-right">
                          <span className={`font-black text-xs md:text-sm whitespace-nowrap ${isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {isPositive ? "+" : "-"}{trx.amount.toLocaleString()} F
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 MODALES COMPACTES EN VERSION MOBILE */}
      {/* MODALE : RECHARGER (DEPOSIT) */}
      <AnimatePresence>
        {isDepositOpen && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isProcessing && setIsDepositOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 50 }} className="relative bg-white rounded-t-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 w-full sm:max-w-md shadow-2xl border-t sm:border border-slate-100 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic mb-0.5 text-slate-900">Recharger</h2>
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 sm:mb-8">Ajoutez des fonds à votre portefeuille</p>
              
              <form onSubmit={handleDeposit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-[8px] sm:text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5 px-1">Montant (FCFA)</label>
                  <input type="number" required min="1000" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex: 10000" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-base sm:text-lg font-black text-slate-900 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[8px] sm:text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5 px-1">Moyen de paiement</label>
                  <div className="relative">
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm font-bold text-slate-900 focus:border-emerald-500 outline-none transition-all appearance-none pr-10">
                      <option value="Wave">Wave Mobile Money</option>
                      <option value="Orange Money">Orange Money</option>
                      <option value="MTN Momo">MTN Mobile Money</option>
                      <option value="Visa/Mastercard">Carte Bancaire (Visa/Mastercard)</option>
                    </select>
                    <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6 sm:mt-8">
                  <button type="button" disabled={isProcessing} onClick={() => setIsDepositOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:bg-slate-200">Annuler</button>
                  <button type="submit" disabled={isProcessing} className="flex-[2] py-3 bg-emerald-500 text-white rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:bg-emerald-600 flex justify-center items-center">
                    {isProcessing ? <Icons.Loader2 className="animate-spin" size={14} /> : "Valider"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALE : RETIRER (WITHDRAW) */}
      <AnimatePresence>
        {isWithdrawOpen && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isProcessing && setIsWithdrawOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 50 }} className="relative bg-white rounded-t-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 w-full sm:max-w-md shadow-2xl border-t sm:border border-slate-100 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic mb-0.5 text-slate-900">Retirer</h2>
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 sm:mb-8">Disponible : <span className="text-orange-500 font-black">{solde.toLocaleString()} F</span></p>
              
              <form onSubmit={handleWithdraw} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-[8px] sm:text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5 px-1">Montant à retirer (FCFA)</label>
                  <input type="number" required max={solde} min="1000" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex: 5000" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-base sm:text-lg font-black text-slate-900 focus:border-orange-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[8px] sm:text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5 px-1">Méthode de réception</label>
                  <div className="relative">
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm font-bold text-slate-900 focus:border-orange-500 outline-none transition-all appearance-none pr-10">
                      <option value="Wave">Wave Mobile Money</option>
                      <option value="Orange Money">Orange Money</option>
                      <option value="MTN Momo">MTN Mobile Money</option>
                      <option value="Virement Bancaire">Virement Bancaire (RIB)</option>
                    </select>
                    <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6 sm:mt-8">
                  <button type="button" disabled={isProcessing} onClick={() => setIsWithdrawOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:bg-slate-200">Annuler</button>
                  <button type="submit" disabled={isProcessing} className="flex-[2] py-3 bg-orange-500 text-white rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:bg-orange-600 flex justify-center items-center">
                    {isProcessing ? <Icons.Loader2 className="animate-spin" size={14} /> : "Confirmer"}
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