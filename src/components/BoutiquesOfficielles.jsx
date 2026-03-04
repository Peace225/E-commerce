import { useState, useEffect } from "react";
import { Store, BadgeCheck, MapPin, Phone, ArrowRight, X, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ⚡ Ajout de l'import useNavigate

// 📦 Données des boutiques
const boutiques = [
  { 
    nom: "Adidas", 
    image: "/images/boutiques/adidas.jpg",
    description: "Boutique Adidas officielle pour tous vos articles de sport et vêtements.",
    localisation: "Abidjan, Côte d'Ivoire",
    contact: "+225 01 23 45 67 89",
    category: "Sport",
    horaires: { debut: 9, fin: 19, texte: "09:00 - 19:00 (Lun-Sam)" }
  },
  { 
    nom: "L'Oréal", 
    image: "/images/boutiques/oreal.jpg",
    description: "Produits de beauté et soins de la peau de qualité.",
    localisation: "Abidjan, Côte d'Ivoire",
    contact: "+225 01 23 45 67 88",
    category: "Beauté",
    horaires: { debut: 8, fin: 18, texte: "08:00 - 18:00 (Lun-Sam)" }
  },
  { 
    nom: "Taurus", 
    image: "/images/boutiques/toro.jpg",
    description: "Équipements et accessoires de qualité pour la maison et le bureau.",
    localisation: "Bouaké, Côte d'Ivoire",
    contact: "+225 01 23 45 67 77",
    category: "Maison",
    horaires: { debut: 8, fin: 17, texte: "08:00 - 17:00 (Lun-Ven)" }
  },
  { 
    nom: "Douxnid", 
    image: "/images/boutiques/naturel.jpg",
    description: "Produits naturels et bio pour votre santé et votre bien-être.",
    localisation: "San Pedro, Côte d'Ivoire",
    contact: "+225 01 23 45 67 66",
    category: "Santé",
    horaires: { debut: 9, fin: 20, texte: "09:00 - 20:00 (7j/7)" }
  },
  { 
    nom: "DeFacto", 
    image: "/images/boutiques/force.jpg",
    description: "Mode tendance pour hommes et femmes à prix abordables.",
    localisation: "Abidjan, Côte d'Ivoire",
    contact: "+225 01 23 45 67 55",
    category: "Mode",
    horaires: { debut: 10, fin: 21, texte: "10:00 - 21:00 (7j/7)" }
  },
  { 
    nom: "Nivea", 
    image: "/images/boutiques/nivea.jpg",
    description: "Produits de soins et cosmétiques pour toute la famille.",
    localisation: "Yamoussoukro, Côte d'Ivoire",
    contact: "+225 01 23 45 67 44",
    category: "Beauté",
    horaires: { debut: 8, fin: 18, texte: "08:00 - 18:00 (Lun-Sam)" }
  },
  { 
    nom: "Xiaomi", 
    image: "/images/boutiques/xiaomi.jpg",
    description: "Smartphones, accessoires et gadgets technologiques.",
    localisation: "Abidjan, Côte d'Ivoire",
    contact: "+225 01 23 45 67 33",
    category: "High Tech",
    horaires: { debut: 9, fin: 19, texte: "09:00 - 19:00 (Lun-Sam)" }
  },
  { 
    nom: "A3 Home", 
    image: "/images/boutiques/a3.jpg",
    description: "Articles pour la maison, décoration et confort.",
    localisation: "Abidjan, Côte d'Ivoire",
    contact: "+225 01 23 45 67 22",
    category: "Maison",
    horaires: { debut: 8, fin: 18, texte: "08:00 - 18:00 (Lun-Sam)" }
  },
  { 
    nom: "Logitech", 
    image: "/images/boutiques/logitech.jpg",
    description: "Accessoires et périphériques informatiques de qualité.",
    localisation: "Abidjan, Côte d'Ivoire",
    contact: "+225 01 23 45 67 11",
    category: "Informatique",
    horaires: { debut: 8, fin: 17, texte: "08:00 - 17:00 (Lun-Ven)" }
  },
  { 
    nom: "Groupe SEB", 
    image: "/images/boutiques/seb.jpg",
    description: "Électroménager et ustensiles de cuisine performants.",
    localisation: "Bouaké, Côte d'Ivoire",
    contact: "+225 01 23 45 67 10",
    category: "Électroménager",
    horaires: { debut: 9, fin: 18, texte: "09:00 - 18:00 (Lun-Sam)" }
  },
  { 
    nom: "Siera", 
    image: "/images/boutiques/siera.jpg",
    description: "Produits de maison et décoration intérieure.",
    localisation: "Abidjan, Côte d'Ivoire",
    contact: "+225 01 23 45 67 09",
    category: "Maison",
    horaires: { debut: 8, fin: 18, texte: "08:00 - 18:00 (Lun-Sam)" }
  }
];

export default function BoutiquesOfficielles() {
  const [selected, setSelected] = useState(null);
  const [heureActuelle, setHeureActuelle] = useState(new Date().getHours());
  const [afficherTout, setAfficherTout] = useState(false);
  const navigate = useNavigate(); // ⚡ Initialisation de la navigation

  const boutiquesAffichees = afficherTout ? boutiques : boutiques.slice(0, 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeureActuelle(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (typeof document !== "undefined") {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }

  const isOuvert = (debut, fin) => {
    return heureActuelle >= debut && heureActuelle < fin;
  };

  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-12 relative p-6 md:p-8 transition-all duration-500">
      
      {/* 🔹 EN-TÊTE PREMIUM */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3.5 rounded-2xl shadow-inner border border-blue-100 relative">
            <Store className="text-blue-600" size={28} strokeWidth={2.5} />
            <BadgeCheck className="text-blue-500 absolute -top-1.5 -right-1.5 bg-white rounded-full" size={16} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
              Boutiques <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Officielles</span>
            </h2>
            <p className="text-[11px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
              Les plus grandes marques en direct
            </p>
          </div>
        </div>

        {/* ⚡ BOUTON BASCULE (Agrandit la grille sur la page) */}
        <button 
          onClick={() => setAfficherTout(!afficherTout)}
          className="group flex items-center gap-2 bg-gray-50 hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-colors duration-300 border border-gray-200 hover:border-blue-200"
        >
          <span className="text-xs font-black text-gray-700 group-hover:text-blue-600 uppercase tracking-wider">
            {afficherTout ? "Voir moins" : "Toutes les boutiques"}
          </span>
          {afficherTout ? (
            <ChevronUp size={16} className="text-gray-400 group-hover:text-blue-600 transform group-hover:-translate-y-0.5 transition-all" />
          ) : (
            <ChevronDown size={16} className="text-gray-400 group-hover:text-blue-600 transform group-hover:translate-y-0.5 transition-all" />
          )}
        </button>
      </div>

      {/* 🔹 GRILLE DES MARQUES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {boutiquesAffichees.map((b, index) => {
          const statutOuvert = isOuvert(b.horaires.debut, b.horaires.fin);

          return (
            <div
              key={index}
              onClick={() => setSelected(b)}
              className="group relative h-40 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer transition-all duration-300 hover:shadow-[0_10px_30px_rgba(37,99,235,0.1)] hover:-translate-y-1 animate-in fade-in zoom-in duration-300"
            >
              {/* Badge Ouvert / Fermé */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm backdrop-blur-md ${statutOuvert ? 'bg-green-100/90 text-green-700 border border-green-200' : 'bg-red-100/90 text-red-700 border border-red-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statutOuvert ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                  {statutOuvert ? 'Ouvert' : 'Fermé'}
                </div>
              </div>

              {/* Image/Logo de la marque */}
              <div className="absolute inset-0 p-4 pt-8">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm relative overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.nom}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  <BadgeCheck className="absolute top-2 right-2 text-blue-500 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={16} />
                </div>
              </div>

              {/* Hover State : Nom & Catégorie */}
              <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100">
                <h3 className="text-xs font-black text-gray-900 text-center truncate">{b.nom}</h3>
                <p className="text-[9px] font-bold text-blue-600 text-center uppercase tracking-wider mt-0.5">{b.category}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔹 MODALE (POPUP) DÉTAILS DE LA BOUTIQUE */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>

              <div className="h-48 w-full bg-gray-100 relative p-8 flex items-center justify-center">
                <img
                  src={selected.image}
                  alt={selected.nom}
                  className="w-1/2 h-full object-contain relative z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90"></div>
                <div className="absolute bottom-4 left-6 flex items-center gap-2 z-20">
                  <h3 className="text-3xl font-black text-white tracking-tight">{selected.nom}</h3>
                  <BadgeCheck className="text-blue-400 bg-white rounded-full" size={24} />
                </div>
              </div>

              <div className="p-6 md:p-8 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Boutique Officielle • {selected.category}
                  </span>
                  
                  {isOuvert(selected.horaires.debut, selected.horaires.fin) ? (
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-green-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Ouvert
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-red-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Fermé
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {selected.description}
                </p>

                <div className="space-y-2.5 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm">
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <Clock size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Horaires d'ouverture</p>
                      <p className="text-xs font-semibold">{selected.horaires.texte}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm">
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <MapPin size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Localisation</p>
                      <p className="text-xs font-semibold">{selected.localisation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm">
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <Phone size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Contact Direct</p>
                      <p className="text-xs font-semibold">{selected.contact}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => setSelected(null)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Fermer
                  </button>

                  {/* ⚡ BOUTON DE REDIRECTION VERS LA BOUTIQUE */}
                  <button 
                    onClick={() => {
                      setSelected(null);
                      navigate(`/boutique/${encodeURIComponent(selected.nom)}`);
                    }}
                    className="flex-[2] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-blue-500/30"
                  >
                    <span>Visiter la boutique</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}