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
    <section className="bg-gray-50 py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 SECTION TITRE & INTRODUCTION */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Rocket size={16} />
              L'avenir du E-commerce
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none mb-8">
              RYNEK – Bien plus qu'une <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Simple Plateforme.</span>
            </h1>
            <p className="text-ls text-gray-600 leading-relaxed font-medium mb-6">
              Rynek connecte vendeurs professionnels, fournisseurs et clients dans un écosystème complet, accessible et automatisé. C'est le moteur de l'e-commerce moderne en Afrique.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Accédez à un large catalogue de produits neufs ou reconditionnés : high-tech, mode, beauté, électroménager, gaming et bien plus. Chaque commande est protégée, et chaque vendeur est évalué pour garantir une expérience sans faille.
            </p>
          </motion.div>

          {/* Visuel décoratif (Globe / Network) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 h-40 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-3xl font-black text-blue-600">98%</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-tighter">Satisfaction</span>
                  </div>
                  <div className="bg-blue-600 h-40 rounded-2xl flex flex-col items-center justify-center p-4 text-center text-white">
                      <Globe size={32} className="animate-spin-slow mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Disponible partout</span>
                  </div>
                  <div className="col-span-2 bg-gray-900 h-24 rounded-2xl flex items-center justify-between px-8 text-white">
                      <span className="font-bold">Vendeurs certifiés</span>
                      <div className="flex -space-x-3">
                         {[1,2,3,4].map(i => (
                           <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-700"></div>
                         ))}
                      </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* 🔹 GRILLE DE SERVICES (CARTES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pointsForts.map((point, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              key={i}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                {point.icon}
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-3 tracking-tight">{point.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {point.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 🔹 CALL TO ACTION FINAL */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-gray-900 rounded-[3rem] p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px]"></div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Prêt à lancer votre business ?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Débutez dès aujourd'hui et profitez de nos ressources gratuites, webinaires et supports d'aide pour devenir un expert de l'e-commerce.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
              Créer ma boutique
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
              Consulter la FAQ
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}