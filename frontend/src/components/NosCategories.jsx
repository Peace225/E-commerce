import { useContext } from "react";
import { Link } from "react-router-dom"; // 🚀 NOUVEAU : Import de Link
import { LayoutGrid, ArrowRight } from "lucide-react";
import { CategorieContext } from "../contexte/CategoriesContext";

const categoriesAccueil = [
  { nom: "Maison & cuisine", image: "/images/categories/maison.jpg" },
  { nom: "Beauté & Santé", image: "/images/categories/beaute.jpg" },
  { nom: "TV & High Tech", image: "/images/categories/tv.jpg" },
  { nom: "Téléphonie", image: "/images/categories/telephone.jpg" },
  { nom: "Mode homme", image: "/images/categories/mode-homme.jpg" },
  { nom: "Mode femme", image: "/images/categories/mode-femme.jpg" },
  { nom: "Électroménager", image: "/images/categories/electromenager.jpg" },
  { nom: "Informatique", image: "/images/categories/informatique.jpg" },
  { nom: "Sport", image: "/images/categories/sport.jpg" },
  { nom: "Jeux vidéos & Consoles", image: "/images/categories/jeux.jpg" },
  { nom: "Mode enfants", image: "/images/categories/enfants.jpg" },
  { nom: "Livres & Romans", image: "/images/categories/livres.jpg" },
];

export default function NosCategories() {
  const { setCategorieActive } = useContext(CategorieContext);

  const handleCategoryClick = (nomCategorie) => {
    setCategorieActive(nomCategorie);
    window.scrollBy({ top: 600, behavior: "smooth" });
  };

  return (
    // 🚀 RESPONSIVE : p-4 sur mobile, p-6 sur tablette, p-8 sur desktop
    <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-8 sm:my-12 p-4 sm:p-6 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
        
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-orange-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-inner border border-orange-100 shrink-0">
            <LayoutGrid className="text-[#e96711] w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tighter leading-none">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e96711] to-[#ff8c42]">Catégories</span>
            </h2>
            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
              Explorez notre catalogue complet
            </p>
          </div>
        </div>

        {/* 🚀 SEO : Utilisation d'un vrai lien <Link> à la place d'un <button onClick> */}
        <Link 
          to="/toutes-les-categories"
          className="group flex items-center gap-2 bg-gray-50 hover:bg-orange-50 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-colors duration-300 border border-gray-200 hover:border-orange-200 w-full md:w-auto justify-center md:justify-start"
        >
          <span className="text-[11px] sm:text-xs font-black text-gray-700 group-hover:text-[#e96711] uppercase tracking-wider">
            Tout voir
          </span>
          <ArrowRight size={16} className="text-gray-400 group-hover:text-[#e96711] transform group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* 🚀 RESPONSIVE : gap-3 sur mobile, gap-4 sur tablette, gap-5 sur desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {categoriesAccueil.map((cat, index) => (
          // 🚀 ACCESSIBILITÉ / DOM : Remplacement de la <div> par un <button>
          <button
            key={index}
            onClick={() => handleCategoryClick(cat.nom)}
            className="group relative h-32 sm:h-36 md:h-44 rounded-2xl sm:rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(233,103,17,0.2)] transition-all duration-500 cursor-pointer border border-gray-100 hover:border-orange-300 text-left w-full"
            aria-label={`Filtrer par la catégorie ${cat.nom}`}
          >
            {/* 🚀 SEO : Ajout de loading="lazy" pour les performances de la page */}
            <img 
              src={cat.image} 
              alt={cat.nom} 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
            
            <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
              <div className="transform translate-y-2 sm:translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-black text-xs sm:text-sm md:text-[15px] leading-tight drop-shadow-lg">{cat.nom}</h3>
                <div className="flex items-center gap-1.5 mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                  <span className="text-[9px] sm:text-[10px] font-bold text-orange-400 uppercase tracking-widest hidden sm:inline">Explorer</span>
                  <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest sm:hidden">Voir</span>
                  <ArrowRight className="text-orange-400 w-3 h-3 sm:w-auto sm:h-auto" strokeWidth={3} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}