import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

export default function PopupMarketing({ isOpen, onClose }) {
  // ⏱️ SÉCURITÉ : On s'assure que le popup reste au moins 15-20 secondes 
  // sauf si l'utilisateur ferme manuellement.
  useEffect(() => {
    if (!isOpen) return;

    // Optionnel : Tu peux décider qu'il se ferme tout seul après 20s
    // const timer = setTimeout(() => {
    //   onClose();
    // }, 20000);
    // return () => clearTimeout(timer);
  }, [isOpen]);

  const features = [
    "Campagnes Facebook, Google & TikTok Ads",
    "Email marketing & automatisation",
    "Retargeting multi-plateformes",
    "Analyse des performances en direct"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // On change l'animation pour être sûr qu'elle ne "glisse" pas hors de l'écran par erreur
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, type: "spring", damping: 20 }}
          className="fixed bottom-6 left-6 z-[999] w-[calc(100%-3rem)] max-w-sm bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-slate-800 overflow-hidden"
        >
          {/* 🔹 EN-TÊTE */}
          <div className="flex justify-between items-start p-6 border-b border-gray-50 dark:border-slate-800/50 relative overflow-hidden bg-gray-50/50 dark:bg-slate-900/50">
            <div className="absolute -right-4 -top-4 text-emerald-500/10 rotate-12 pointer-events-none">
              <Icons.Target size={100} />
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
                <Icons.Megaphone size={20} />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Marketing & Ads</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 text-emerald-500">Boostez vos ventes</p>
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Évite les conflits de clic
                onClose();
              }} 
              className="relative z-10 p-2 bg-white dark:bg-slate-800 text-gray-400 hover:text-red-500 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 transition-colors"
            >
              <Icons.X size={14} />
            </button>
          </div>

          {/* 🔹 CORPS */}
          <div className="p-6">
            <ul className="space-y-4">
              {features.map((item, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="mt-0.5 p-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
                    <Icons.Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-xs font-bold text-gray-600 dark:text-slate-300 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <button 
              onClick={onClose}
              className="mt-8 w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              Découvrir nos offres 
              <Icons.ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}