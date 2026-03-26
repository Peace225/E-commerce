import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

export default function PopupMarketing({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  const features = [
    "Ads Facebook, Google & TikTok",
    "Email marketing & automation",
    "Retargeting multi-plateformes",
    "Analyse des perfs en direct"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, type: "spring", damping: 25 }}
          // 📏 TAILLE RÉDUITE : max-w-[280px] et padding p-4
          className="fixed bottom-6 left-6 z-[999] w-[calc(100%-3rem)] max-w-[280px] bg-white dark:bg-[#0f172a] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-slate-800 overflow-hidden"
        >
          {/* 🔹 EN-TÊTE PLUS COMPACTE */}
          <div className="flex justify-between items-start p-4 border-b border-gray-50 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3 relative z-10">
              {/* Icône plus petite (w-10) */}
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Icons.Megaphone size={18} />
              </div>
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-white leading-none">Marketing & Ads</h2>
                <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1">Boostez vos ventes</p>
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }} 
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Icons.X size={14} />
            </button>
          </div>

          {/* 🔹 CORPS RÉDUIT */}
          <div className="p-4">
            <ul className="space-y-2">
              {features.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="p-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 shrink-0">
                    <Icons.Check size={10} strokeWidth={4} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-slate-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <button 
              onClick={onClose}
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              Découvrir
              <Icons.ArrowRight size={12} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}