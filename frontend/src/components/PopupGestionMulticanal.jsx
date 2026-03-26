import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

export default function PopupGestionMulticanal({ isOpen, onClose }) {
  // ⏳ TIMER : Fermeture automatique après 15 secondes
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 15000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          // 📏 TAILLE RÉDUITE : max-w-[280px] et arrondis plus fins
          className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-[280px] bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden"
        >
          {/* 🔹 EN-TÊTE COMPACTE */}
          <div className="flex justify-between items-start p-4 border-b border-gray-50 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-900/50 relative overflow-hidden">
            {/* Décoration plus discrète */}
            <div className="absolute -right-2 -top-2 text-indigo-500/10 -rotate-12 pointer-events-none">
              <Icons.Share2 size={70} />
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <Icons.ShoppingCart size={18} />
              </div>
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-white leading-none">
                  Multi-Canaux
                </h2>
                <p className="text-[9px] font-bold text-indigo-500 uppercase mt-1">
                  Synchronisation
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Icons.X size={14} />
            </button>
          </div>

          {/* 🔹 CORPS RÉDUIT */}
          <div className="p-4">
            <p className="text-[10px] font-bold text-gray-600 dark:text-slate-300 leading-snug mb-4">
              Vendez sur <span className="text-indigo-500 font-black">Shopify, Amazon</span> et plus encore. 
              <span className="text-gray-900 dark:text-white font-black"> Qwikfy</span> centralise tout pour vous.
            </p>

            {/* 🔹 PIED DE POPUP */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800/50">
              <button
                onClick={onClose}
                className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
              >
                Fermer
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
              >
                Découvrir <Icons.ArrowRight size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}