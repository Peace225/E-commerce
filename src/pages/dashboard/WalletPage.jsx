import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🔥 IMPORTS FIREBASE
import { db } from "../../utils/firebaseConfig";
import { 
  collection, addDoc, serverTimestamp, query, 
  where, orderBy, onSnapshot, doc, updateDoc, increment 
} from "firebase/firestore";

export default function WalletPage({ wallet, user }) {
  // 🔹 ÉTATS
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Wave");
  const [isProcessing, setIsProcessing] = useState(false); // Pour le bouton de chargement
  const [transactions, setTransactions] = useState([]); // Historique depuis Firebase

  const solde = wallet?.balance || 0;

  // 🔄 1. REQUÊTE : RÉCUPÉRER L'HISTORIQUE EN TEMPS RÉEL
  useEffect(() => {
    if (!user) return;

    // On cible la collection "transactions" où l'ID correspond à l'utilisateur
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc") // Du plus récent au plus ancien
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trxData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(trxData);
    });

    return () => unsubscribe();
  }, [user]);

  // 💳 2. REQUÊTE : RECHARGER LE COMPTE (DÉPÔT)
  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    setIsProcessing(true);

    try {
      // ÉTAPE A : Créer la trace de la transaction
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: "deposit",
        title: "Rechargement Compte",
        amount: Number(amount),
        method: paymentMethod,
        status: "Complété",
        createdAt: serverTimestamp()
      });

      // ÉTAPE B : Ajouter l'argent au solde de l'utilisateur
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        balance: increment(Number(amount)) // 🔥 "increment" est sécurisé contre les bugs de synchronisation
      });

      alert(`✅ Rechargement de ${amount} F via ${paymentMethod} réussi !`);
      setIsDepositOpen(false);
      setAmount("");
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
      // ÉTAPE A : Créer la demande de retrait (Statut "En attente")
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: "withdrawal",
        title: `Retrait vers ${paymentMethod}`,
        amount: withdrawAmount,
        method: paymentMethod,
        status: "En attente", // ⏳ L'admin devra valider ça plus tard
        createdAt: serverTimestamp()
      });

      // ÉTAPE B : Déduire l'argent immédiatement pour éviter le double-retrait
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        balance: increment(-withdrawAmount) // 🔥 On met un "moins" pour déduire
      });

      alert(`⏳ Demande de retrait de ${amount} F envoyée. Elle sera traitée sous 24h.`);
      setIsWithdrawOpen(false);
      setAmount("");
    } catch (error) {
      console.error("Erreur de retrait :", error);
      alert("❌ Une erreur est survenue.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Fonction pour formater les dates Firebase
  const formatDate = (timestamp) => {
    if (!timestamp) return "À l'instant";
    return timestamp.toDate().toLocaleDateString('fr-FR', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* 🔹 HEADER : PORTEFEUILLE & CARTE VIRTUELLE */}
      <header className="bg-[#0f172a] p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col xl:flex-row justify-between items-center gap-10">
        
        {/* Infos Solde */}
        <div className="relative z-10 text-center xl:text-left w-full xl:w-auto">
          <div className="bg-emerald-500/20 text-emerald-400 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto xl:mx-0 mb-6 border border-emerald-500/20 flex items-center gap-2">
            <Icons.ShieldCheck size={14} /> Fonds Sécurisés
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Solde Disponible</p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8">
            {solde.toLocaleString()} <span className="text-2xl text-emerald-500">FCFA</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center xl:justify-start">
            <button 
              onClick={() => setIsDepositOpen(true)}
              className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
            >
              <Icons.ArrowDownToLine size={18} className="text-emerald-500" /> Recharger
            </button>
            <button 
              onClick={() => setIsWithdrawOpen(true)}
              className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Icons.ArrowUpFromLine size={18} className="text-orange-500" /> Retirer
            </button>
          </div>
        </div>

        {/* Carte Bancaire Virtuelle Rynek */}
        <div className="relative z-10 w-full max-w-sm aspect-[1.58/1] bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2rem] p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="font-black italic text-xl uppercase tracking-tighter">RYNEK<span className="text-orange-500">.</span></h3>
              <Icons.Wifi size={24} className="text-slate-400 rotate-90" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icons.CreditCard size={32} className="text-slate-300" />
              </div>
              <p className="font-mono text-xl tracking-widest text-slate-200">**** **** **** 4092</p>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-slate-400 mb-1">Titulaire</p>
                  <p className="text-xs font-black uppercase tracking-widest truncate max-w-[150px]">
                    {user?.displayName || "Ambassadeur"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full bg-red-500/80 mix-blend-multiply"></div>
                  <div className="w-6 h-6 rounded-full bg-orange-500/80 mix-blend-multiply -ml-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Icons.Coins className="absolute -left-10 -bottom-10 text-white/5 rotate-12 pointer-events-none" size={300} />
      </header>

      {/* 🔹 HISTORIQUE DES TRANSACTIONS */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black uppercase text-xs tracking-tighter text-slate-900 flex items-center gap-2">
            <Icons.History size={18} className="text-slate-500" /> Historique de vos mouvements
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aucune transaction pour le moment.</p>
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
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPositive ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-600'}`}>
                              {isPositive ? <Icons.ArrowDownLeft size={20} /> : <Icons.ArrowUpRight size={20} />}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-900 uppercase text-xs tracking-tight">{trx.title}</span>
                              <span className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">
                                {formatDate(trx.createdAt)} • {trx.method}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-center hidden md:table-cell">
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{trx.id.slice(0, 8)}...</span>
                        </td>
                        <td className="p-6 text-center">
                          <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border
                            ${trx.status === 'Complété' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                            {trx.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <span className={`font-black text-sm ${isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
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

      {/* 🔹 MODALE : RECHARGER (DEPOSIT) */}
      <AnimatePresence>
        {isDepositOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isProcessing && setIsDepositOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-[3rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-slate-100">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-1 text-slate-900">Recharger</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Ajoutez des fonds à votre portefeuille</p>
              
              <form onSubmit={handleDeposit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-2">Montant (FCFA)</label>
                  <input type="number" required min="1000" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex: 10000" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-lg font-black text-slate-900 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-2">Moyen de paiement</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-900 focus:border-emerald-500 outline-none transition-all appearance-none">
                    <option value="Wave">Wave Mobile Money</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN Momo">MTN Mobile Money</option>
                    <option value="Visa/Mastercard">Carte Bancaire (Visa/Mastercard)</option>
                  </select>
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="button" disabled={isProcessing} onClick={() => setIsDepositOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200">Annuler</button>
                  <button type="submit" disabled={isProcessing} className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 flex justify-center items-center">
                    {isProcessing ? <Icons.Loader2 className="animate-spin" size={18} /> : "Valider le paiement"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔹 MODALE : RETIRER (WITHDRAW) */}
      <AnimatePresence>
        {isWithdrawOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isProcessing && setIsWithdrawOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-[3rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-slate-100">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-1 text-slate-900">Retirer</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Solde disponible : <span className="text-orange-500 font-black">{solde.toLocaleString()} F</span></p>
              
              <form onSubmit={handleWithdraw} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-2">Montant à retirer (FCFA)</label>
                  <input type="number" required max={solde} min="1000" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex: 5000" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-lg font-black text-slate-900 focus:border-orange-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-2">Méthode de réception</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-900 focus:border-orange-500 outline-none transition-all appearance-none">
                    <option value="Wave">Wave Mobile Money</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN Momo">MTN Mobile Money</option>
                    <option value="Virement Bancaire">Virement Bancaire (RIB)</option>
                  </select>
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="button" disabled={isProcessing} onClick={() => setIsWithdrawOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200">Annuler</button>
                  <button type="submit" disabled={isProcessing} className="flex-[2] py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 flex justify-center items-center">
                    {isProcessing ? <Icons.Loader2 className="animate-spin" size={18} /> : "Confirmer le retrait"}
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