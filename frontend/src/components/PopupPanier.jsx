import { useState } from "react";
import * as Icons from "lucide-react"; 
import { X, Plus, Minus, Trash2, Ticket, Loader2, ShoppingBag } from "lucide-react"; 
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext"; 
 

export default function PopupPanier({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart(); 

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState({ type: "", text: "" });
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.prix * (item.quantity || 1)), 0);
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.reduction) / 100 : 0;
  const total = subtotal - discountAmount;

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setIsChecking(true);
    setPromoMessage({ type: "", text: "" });

    try {
      const q = query(collection(db, "promo_codes"), where("code", "==", promoInput.toUpperCase().trim()));
      const snap = await getDocs(q);
      if (snap.empty) {
        setPromoMessage({ type: "error", text: "Code invalide." });
        return;
      }
      const promoData = snap.docs[0].data();
      if (!promoData.actif) {
        setPromoMessage({ type: "error", text: "Code expiré." });
        return;
      }
      setAppliedPromo({ code: promoData.code, reduction: promoData.reduction });
      setPromoMessage({ type: "success", text: `-${promoData.reduction}%` });
      setPromoInput("");
    } catch (error) {
      setPromoMessage({ type: "error", text: "Erreur serveur." });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <AnimatePresence>
      {/* 1. OVERLAY TRANSPARENT : Permet de fermer en cliquant n'importe où ailleurs */}
      <div className="fixed inset-0 z-[90]" onClick={onClose} />

      {/* 2. LE POPUP DROPDOWN */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute top-full right-0 mt-3 z-[100] w-96 bg-white dark:bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-[2rem] border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col origin-top-right"
      >
        {/* HEADER MINI */}
        <div className="flex justify-between items-center p-5 border-b dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
          <h2 className="text-sm font-black uppercase tracking-widest dark:text-white">
            Mon Panier ({cartItems.length})
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* LISTE ARTICLES MINI */}
        <div className="overflow-y-auto max-h-[350px] p-5 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="text-gray-200 mx-auto mb-2" size={32} />
              <p className="text-[10px] text-gray-400 font-black uppercase">Votre panier est vide</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center gap-4 group">
                  <img src={item.image} alt={item.nom} className="w-12 h-12 rounded-xl object-cover bg-gray-100 border dark:border-slate-700" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase truncate">{item.nom}</h3>
                    <p className="text-[11px] font-bold text-orange-600">{item.prix.toLocaleString()} F</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-black dark:hover:text-white"><Minus size={12}/></button>
                    <span className="text-[10px] font-black w-3 text-center dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-black dark:hover:text-white"><Plus size={12}/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* FOOTER MINI */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t dark:border-slate-800 bg-gray-50/30 space-y-4">
            {!appliedPromo ? (
              <form onSubmit={handleApplyPromo} className="relative">
                <input 
                  type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Code promo ?" 
                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2.5 pl-4 pr-16 text-[10px] font-bold outline-none focus:border-orange-500"
                />
                <button type="submit" className="absolute right-1 top-1 bottom-1 px-3 bg-gray-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                  OK
                </button>
              </form>
            ) : (
              <div className="flex justify-between items-center bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest ml-2">Code {appliedPromo.code} Actif</span>
                <button onClick={() => setAppliedPromo(null)} className="text-emerald-700 p-1"><X size={14}/></button>
              </div>
            )}

            <div className="pt-2">
              <div className="flex justify-between text-[10px] font-black text-gray-400 mb-1">
                <span>SOUS-TOTAL</span><span>{subtotal.toLocaleString()} F</span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white">
                <span className="tracking-tighter italic uppercase">TOTAL</span>
                <span className="text-orange-600">{total.toLocaleString()} F</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link to="/checkout" onClick={onClose} className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white text-center rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-orange-600/20 transition-all active:scale-95">
                Commander
              </Link>
              <button onClick={() => { if(window.confirm("Vider ?")) clearCart(); }} className="text-[9px] font-black uppercase text-gray-400 hover:text-red-500 tracking-widest transition-colors">
                Vider le panier
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}