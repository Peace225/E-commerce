import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md"
      >
        <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/20">
          <Icons.Construction size={48} className="animate-pulse" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-4">
          Maintenance <span className="text-red-500">En cours</span>
        </h1>
        <p className="text-slate-400 font-bold text-sm leading-relaxed mb-8">
          Rynek Pro s'actualise pour vous offrir une meilleure expérience. 
          Nous serons de retour dans quelques instants. Merci de votre patience !
        </p>
        <div className="h-1 w-20 bg-red-600 mx-auto rounded-full" />
      </motion.div>
    </div>
  );
}