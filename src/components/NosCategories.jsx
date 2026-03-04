import { useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { setCategorieActive } = useContext(CategorieContext);

  const handleCategoryClick = (nomCategorie) => {
    setCategorieActive(nomCategorie);
    window.scrollBy({ top: 600, behavior: "smooth" });
  };

  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-12 p-6 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-orange-50 p-3.5 rounded-2xl shadow-inner border border-orange-100">
            <LayoutGrid className="text-[#e96711]" size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e96711] to-[#ff8c42]">Catégories</span>
            </h2>
            <p className="text-[11px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
              Explorez notre catalogue complet
            </p>
          </div>
        </div>

        {/* ⚡ REDIRECTION VERS LA NOUVELLE PAGE */}
        <button 
          onClick={() => navigate("/toutes-les-categories")}
          className="group flex items-center gap-2 bg-gray-50 hover:bg-orange-50 px-5 py-2.5 rounded-xl transition-colors duration-300 border border-gray-200 hover:border-orange-200"
        >
          <span className="text-xs font-black text-gray-700 group-hover:text-[#e96711] uppercase tracking-wider">
            Tout voir
          </span>
          <ArrowRight size={16} className="text-gray-400 group-hover:text-[#e96711] transform group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
        {categoriesAccueil.map((cat, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(cat.nom)}
            className="group relative h-36 md:h-44 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(233,103,17,0.2)] transition-all duration-500 cursor-pointer border border-gray-100 hover:border-orange-300"
          >
            <img src={cat.image} alt={cat.nom} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-black text-sm md:text-[15px] leading-tight drop-shadow-lg">{cat.nom}</h3>
                <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Explorer</span>
                  <ArrowRight size={12} className="text-orange-400" strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}