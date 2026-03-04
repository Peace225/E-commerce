import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LayoutGrid, ArrowRight, Search } from "lucide-react";
import { CategorieContext } from "../contexte/CategoriesContext"; // Ajustez le chemin

// La liste complète de vos catégories
const toutesLesCategories = [
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
  { nom: "Automobile & Moto", image: "/images/categories/auto.jpg" },
  { nom: "Jouets & Bébé", image: "/images/categories/bebe.jpg" },
  { nom: "Bricolage", image: "/images/categories/bricolage.jpg" },
  { nom: "Jardin & Extérieur", image: "/images/categories/jardin.jpg" },
  { nom: "Animalerie", image: "/images/categories/animaux.jpg" },
  { nom: "Fournitures de bureau", image: "/images/categories/bureau.jpg" },
];

export default function ToutesLesCategories() {
  const navigate = useNavigate();
  const { setCategorieActive } = useContext(CategorieContext);

  const handleCategoryClick = (nomCategorie) => {
    // 1. Définir la catégorie active
    setCategorieActive(nomCategorie);
    // 2. Rediriger vers la page d'accueil (qui affichera les produits filtrés)
    navigate("/");
    // 3. Optionnel : scroller vers les produits une fois sur l'accueil
    setTimeout(() => {
      window.scrollBy({ top: 800, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DE LA PAGE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-all group"
            >
              <ArrowLeft className="text-gray-600 group-hover:text-[#e96711]" size={24} />
            </button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                <LayoutGrid className="text-[#e96711]" size={36} strokeWidth={2.5} />
                Toutes les <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e96711] to-[#ff8c42]">Catégories</span>
              </h1>
              <p className="text-gray-500 font-medium mt-2">Découvrez l'intégralité de notre catalogue organisé pour vous.</p>
            </div>
          </div>

          {/* Barre de recherche (Bonus Pro) */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm shadow-sm transition-all"
              placeholder="Chercher une catégorie..."
            />
          </div>
        </div>

        {/* GRILLE COMPLÈTE */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {toutesLesCategories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.nom)}
              className="group relative h-40 md:h-48 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(233,103,17,0.2)] transition-all duration-500 cursor-pointer border border-gray-100 hover:border-orange-300 animate-in fade-in zoom-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.nom}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"></div>
              
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-black text-sm md:text-base leading-tight drop-shadow-lg">
                    {cat.nom}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Voir les produits</span>
                    <ArrowRight size={12} className="text-orange-400" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}