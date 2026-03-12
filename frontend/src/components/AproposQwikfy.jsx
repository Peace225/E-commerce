import { Link } from "react-router-dom"; // 🚀 NOUVEAU : Import pour le SEO
import { ShieldCheck, Rocket, Globe, GraduationCap, Store, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function AproposQwikfy() {
  const pointsForts = [
    {
      icon: <Store className="text-blue-500" size={28} />,
      title: "Boutique en 1 clic",
      desc: "Créez votre interface e-commerce sans aucune compétence technique. Gagnez du temps, vendez plus."
    },
    {
      icon: <Truck className="text-emerald-500" size={28} />,
      title: "Logistique Intégrée",
      desc: "Une infrastructure performante avec suivi en temps réel et livraison optimisée par l'automatisation."
    },
    {
      icon: <GraduationCap className="text-purple-500" size={28} />,
      title: "Académie Rynek",
      desc: "Formations complètes en dropshipping et marketing digital pour propulser votre activité."
    },
    {
      icon: <ShieldCheck className="text-red-500" size={28} />,
      title: "Écosystème Sécurisé",
      desc: "Paiements protégés et vendeurs certifiés pour une satisfaction client garantie à 100%."
    }
  ];

  return (
    // 🚀 RESPONSIVE : px-4 sur mobile au lieu de px-6
    <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 SECTION TITRE & INTRODUCTION */}
        <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 mb-16 sm:mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6">
              <Rocket size={16} className="w-4 h-4 sm:w-auto sm:h-auto" />
              L'avenir du E-commerce
            </div>
            {/* 🚀 SEO : Passage de h1 à h2 */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none mb-6 sm:mb-8">
              RYNEK – Bien plus qu'une <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Simple Plateforme.</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium mb-4 sm:mb-6">
              Rynek connecte vendeurs professionnels, fournisseurs et clients dans un écosystème complet, accessible et automatisé. C'est le moteur de l'e-commerce moderne en Afrique.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Accédez à un large catalogue de produits neufs ou reconditionnés : high-tech, mode, beauté, électroménager, gaming et bien plus. Chaque commande est protégée, et chaque vendeur est évalué pour garantir une expérience sans faille.
            </p>
          </motion.div>

          {/* Visuel décoratif (Globe / Network) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative w-full"
          >
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl"></div>
            {/* 🚀 RESPONSIVE : p-5 sur mobile au lieu de p-8 */}
            <div className="relative bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[3rem] shadow-2xl border border-gray-100">
               <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 h-32 sm:h-40 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-3 sm:p-4 text-center">
                      <span className="text-2xl sm:text-3xl font-black text-blue-600">98%</span>
                      <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase mt-1 sm:mt-2 tracking-tighter">Satisfaction</span>
                  </div>
                  <div className="bg-blue-600 h-32 sm:h-40 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-3 sm:p-4 text-center text-white">
                      <Globe className="animate-[spin_10s_linear_infinite] mb-1 sm:mb-2 w-6 h-6 sm:w-8 sm:h-8" />
                      <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-tighter">Disponible partout</span>
                  </div>
                  {/* 🚀 RESPONSIVE : px-4 sur mobile pour éviter que le texte ne déborde */}
                  <div className="col-span-2 bg-gray-900 h-20 sm:h-24 rounded-xl sm:rounded-2xl flex items-center justify-between px-4 sm:px-8 text-white">
                      <span className="font-bold text-[11px] sm:text-base">Vendeurs certifiés</span>
                      <div className="flex -space-x-2 sm:-space-x-3">
                         {[1,2,3,4].map(i => (
                           <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-900 bg-gray-700 shadow-sm"></div>
                         ))}
                      </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* 🔹 GRILLE DE SERVICES (CARTES) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pointsForts.map((point, i) => (
            // 🚀 SÉMANTIQUE : Ajout de la balise <article>
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              key={i}
              className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-blue-50 transition-colors">
                {point.icon}
              </div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-2 sm:mb-3 tracking-tight">{point.title}</h3>
              <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed font-medium">
                {point.desc}
              </p>
            </motion.article>
          ))}
        </div>

        {/* 🔹 CALL TO ACTION FINAL */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          // 🚀 RESPONSIVE : p-6 sur mobile, p-12 sur desktop
          className="mt-16 sm:mt-24 bg-gray-900 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] pointer-events-none"></div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-6 relative z-10">
            Prêt à lancer votre business ?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 relative z-10">
            Débutez dès aujourd'hui et profitez de nos ressources gratuites, webinaires et supports d'aide pour devenir un expert de l'e-commerce.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 relative z-10">
            {/* 🚀 SEO : Remplacement des <button> par des <Link> */}
            <Link 
              to="/inscription-vendeur" 
              className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Créer ma boutique
            </Link>
            <Link 
              to="/faq" 
              className="w-full sm:w-auto flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-sm uppercase tracking-widest transition-all active:scale-95"
            >
              Consulter la FAQ
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}