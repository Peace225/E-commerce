import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Megaphone, Zap, ChevronRight, PlusCircle, LayoutPanelTop, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DecompteAnime from "./DecompteAnime";

const publicites = [
  {
    id: 1,
    image: "/images/pub-electro.jpg",
    title: "VOTRE PUBLICITÉ ICI",
    desc: "Boostez votre visibilité auprès de milliers de clients Rynek.",
    link: "/contact-pub",
    type: "invitation",
    cta: "Réserver l'espace"
  },
  {
    id: 2,
    image: "/images/pub-food.jpg",
    title: "Daji's Food - Gourmet",
    desc: "Découvrez l'authentique cuisine africaine livrée chez vous.",
    link: "/boutique/dajis-food",
    type: "real",
    cta: "Commander"
  },
  {
    id: 3,
    image: "/images/pub-imane.jpg",
    title: "Imane Boutik - Chic",
    desc: "Nouvelle collection d'accessoires pour toute la famille.",
    link: "/boutique/imane-boutik",
    type: "real",
    cta: "Découvrir"
  },
  {
    id: 4,
    image: "/images/pub-placeholder.jpg",
    title: "BOOSTEZ VOS VENTES",
    desc: "Devenez partenaire Rynek et affichez vos produits en Top Accueil.",
    link: "/contact-pub",
    type: "invitation",
    cta: "Nous contacter"
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
    /* ⚡ Hauteur augmentée à 720px */
    <div className="w-full h-[720px] flex flex-col gap-4 p-4 rounded-[2.5rem] shadow-2xl bg-[#0f172a] border border-slate-800 transition-all duration-300 relative overflow-hidden group/main">
      
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[80px] pointer-events-none group-hover/main:bg-blue-600/20 transition-colors duration-700" />

      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <LayoutPanelTop className="text-blue-500" size={16} />
          </div>
          <h3 className="text-white text-[11px] font-black uppercase tracking-[0.2em]">
            Espaces Pub
          </h3>
        </div>
        <div className="flex items-center gap-1">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-tighter">Premium</span>
        </div>
      </div>

      {/* 🔹 SLIDER D'AFFICHAGE (Agrandi verticalement avec flex-grow) */}
      <div className="relative w-full flex-[3] overflow-hidden rounded-[1.5rem] group border border-slate-800 shadow-inner">
        <AnimatePresence mode="wait">
          {publicites.map((pub, i) => i === index && (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Link to={pub.link} className="block w-full h-full relative group/card">
                <img 
                  src={pub.image} 
                  alt={pub.title} 
                  className="w-full h-full object-cover opacity-60 group-hover/card:scale-110 transition-transform duration-[5000ms]" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-950 flex flex-col items-center justify-center p-8 text-center">
                  
                  {pub.type === "invitation" ? (
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30 animate-pulse">
                        <PlusCircle className="text-blue-400" size={32} />
                    </div>
                  ) : (
                    <div className="bg-orange-500 text-[9px] font-black text-white px-3 py-1 rounded-full mb-4 uppercase tracking-widest shadow-lg shadow-orange-900/20">
                        Partenaire Rynek
                    </div>
                  )}
                  
                  <h4 className="text-white font-black text-2xl leading-tight uppercase tracking-tighter mb-3 drop-shadow-lg">
                    {pub.title}
                  </h4>
                  <p className="text-sm text-slate-300 mb-8 px-4 leading-relaxed font-medium">
                    {pub.desc}
                  </p>
                  
                  <div className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-xl
                    ${pub.type === "invitation" ? "bg-blue-600 text-white shadow-blue-900/40" : "bg-white text-black shadow-black/40"}`}>
                    {pub.cta}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 py-1">
        {publicites.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800'}`}
          />
        ))}
      </div>

      {/* 🔹 BLOC VENTE FLASH (Compacté légèrement pour laisser la place aux images) */}
      <div className="flex-1 bg-gradient-to-br from-orange-600 to-red-800 rounded-[1.5rem] p-5 shadow-lg relative overflow-hidden border border-white/10 min-h-[160px]">
        <Zap className="absolute -right-2 -bottom-2 text-black/10 rotate-12" size={100} strokeWidth={4} />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-center gap-2">
               <div className="bg-yellow-400 p-1 rounded-md shadow-sm">
                 <Zap size={14} className="text-orange-900 fill-orange-900" />
               </div>
               <span className="text-white text-xs font-black uppercase tracking-widest italic">Ventes Flash</span>
          </div>
          
          <div className="w-[125%] -ml-5 transform scale-[0.80] origin-left">
            <DecompteAnime
              label=""
              targetDate={new Date().getTime() + 3600 * 1000 * 4.5} 
            />
          </div>

          <Link 
            to="/vente-flash" 
            className="w-full bg-black/20 hover:bg-black/40 backdrop-blur-md py-3 rounded-xl text-[10px] text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/5"
          >
            Saisir l'opportunité
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}