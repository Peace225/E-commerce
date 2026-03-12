import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, ChevronRight, PlusCircle, LayoutPanelTop, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DecompteAnime from "./DecompteAnime";

const publicites = [
  {
    id: 1,
    image: "/images/pub-electro.jpg",
    title: "BOOSTEZ VOS VENTES",
    desc: "Devenez partenaire Rynek et affichez vos produits en Top Accueil.",
    link: "/contact-pub",
    type: "invitation",
    cta: "NOUS CONTACTER"
  },
  {
    id: 2,
    image: "/images/pub-food.jpg",
    title: "Daji's Food Gourmet",
    desc: "Découvrez l'authentique cuisine africaine livrée chez vous.",
    link: "/boutique/dajis-food",
    type: "real",
    cta: "COMMANDER"
  }
];

export default function EncartsDroite() {
  const [index, setIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % publicites.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (location.pathname !== "/") return null;

  return (
    /* RESPONSIVE CONFIG:
       - w-full sur mobile
       - w-[320px] sur desktop (lg+)
       - h-auto sur mobile pour éviter de bloquer le scroll
       - h-[720px] sur desktop
    */
    <div className="w-full lg:w-[320px] h-auto lg:h-[720px] flex flex-col gap-4 p-4 lg:p-5 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl bg-[#0b0f1a] border border-white/5 relative overflow-hidden font-['Inter',sans-serif]">
      
      {/* 1. Header Premium */}
      <div className="flex flex-col gap-3 px-2 pt-2 mb-2 lg:mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 lg:p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-inner">
            <LayoutPanelTop className="text-blue-400" size={18} />
          </div>
          
          <div className="flex flex-col gap-1">
            <h3 className="text-white text-[11px] lg:text-[13px] font-black uppercase tracking-[0.2em] leading-none">
              Espaces Publicitaires
            </h3>
            <div className="flex items-center gap-2">
                <Star size={10} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                <span className="text-[9px] text-yellow-400 font-black uppercase tracking-[0.2em] opacity-80">
                  Diffusion Premium
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Zone Publicitaire (Flexible) */}
      <div className="relative w-full min-h-[300px] lg:flex-grow overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] border border-white/5 bg-black">
        <AnimatePresence mode="wait">
          {publicites.map((pub, i) => i === index && (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Link to={pub.link} className="block w-full h-full relative group">
                <img src={pub.image} alt="" className="w-full h-full object-cover opacity-60 transition-transform duration-[6000ms] group-hover:scale-110" />
                
                <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-black/40 to-black flex flex-col items-center justify-end p-5 lg:p-6 text-center">
                  {pub.type === "invitation" && (
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-600/30 rounded-full flex items-center justify-center mb-4 border border-blue-400/30">
                        <PlusCircle className="text-white" size={24} />
                    </div>
                  )}
                  
                  <h4 className="text-white font-black text-xl lg:text-2xl leading-tight uppercase tracking-tighter mb-2 lg:mb-3 w-full break-words">
                    {pub.title}
                  </h4>
                  <p className="text-[10px] lg:text-xs text-gray-300 mb-4 lg:mb-6 px-1 leading-relaxed font-medium">
                    {pub.desc}
                  </p>
                  
                  <div className="w-full py-3 lg:py-3.5 rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg">
                    {pub.cta}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. Section VENTES FLASH (Adaptative) */}
      <div className="h-[180px] lg:h-[210px] bg-gradient-to-br from-orange-600 to-red-700 rounded-[1.5rem] lg:rounded-[2rem] p-4 lg:p-5 relative overflow-hidden border border-white/10 shrink-0">
        <Zap className="absolute -right-4 -bottom-4 text-white/10 rotate-12" size={80} lg:size={100} />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-1 rounded-md">
              <Zap size={12} className="text-orange-900 fill-orange-900" />
            </div>
            <span className="text-white text-[10px] lg:text-xs font-black uppercase tracking-widest italic">Ventes Flash</span>
            <span className="ml-auto bg-black/20 text-[7px] lg:text-[8px] text-white px-2 py-0.5 rounded-full font-black uppercase">Live</span>
          </div>
          
          <div className="py-1 lg:py-2 scale-75 lg:scale-90 origin-center">
            <DecompteAnime
              label=""
              targetDate={new Date().getTime() + 3600 * 1000 * 4.5} 
            />
          </div>

          <Link 
            to="/vente-flash" 
            className="w-full bg-white text-red-600 py-2.5 lg:py-3 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            Saisir l'opportunité
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}