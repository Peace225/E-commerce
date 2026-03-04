import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

export default function PopupGestionMulticanal({ isOpen, onClose }) {
  // ⏳ TON TIMER : Fermeture automatique après 15 secondes
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
          // Animation fluide d'entrée par la droite
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden"
        >
          {/* 🔹 EN-TÊTE DU POPUP (Thème Indigo/Tech) */}
          <div className="flex justify-between items-start p-6 border-b border-gray-50 dark:border-slate-800/50 relative overflow-hidden bg-gray-50/50 dark:bg-slate-900/50">
            {/* Décoration de fond dynamique */}
            <div className="absolute -right-4 -top-4 text-indigo-500/10 -rotate-12 pointer-events-none">
              <Icons.Share2 size={100} />
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                <Icons.ShoppingCart size={20} />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
                  Multi-Canaux
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Synchronisation active
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="relative z-10 p-2 bg-white dark:bg-slate-800 text-gray-400 hover:text-red-500 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 transition-colors"
            >
              <Icons.X size={14} />
            </button>
          </div>

          {/* 🔹 CORPS DU POPUP */}
          <div className="p-6">
            <p className="text-xs font-bold text-gray-600 dark:text-slate-300 leading-relaxed mb-6">
              Synchronisez vos ventes et inventaires sur plusieurs plateformes : <span className="text-indigo-500 font-black">Shopify, WooCommerce, Amazon</span>, et plus encore.
              <br /><br />
              <span className="text-gray-900 dark:text-white font-black">Qwikfy</span> facilite la gestion centralisée de votre activité e-commerce.
            </p>

            {/* 🔹 PIED DE POPUP (Boutons) */}
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50 dark:border-slate-800/50">
              <button
                onClick={onClose}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
              >
                Fermer
              </button>
              <button 
                onClick={onClose} // Rediriger vers la page Qwikfy si besoin
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
              >
                Découvrir <Icons.ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}