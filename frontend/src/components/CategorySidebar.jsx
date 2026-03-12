import React, { useContext } from "react";
import {
  Smartphone, Tv2, Laptop, Home, WashingMachine, Shirt, Heart,
  Gamepad2, Wrench, Dumbbell, Baby, PackageSearch, LayoutGrid, BookOpen, ChevronRight
} from "lucide-react";
import { CategorieContext } from "../contexte/CategoriesContext";

// 🧩 Map des icônes par catégorie (Identique à ton code)
const iconsMap = {
  Téléphones: Smartphone,
  "TV & HIGH TECH": Tv2,
  Informatique: Laptop,
  "Maison, cuisine & bureau": Home,
  Électroménager: WashingMachine,
  "Vêtements & Chaussures": Shirt,
  "Beauté & Santé": Heart,
  "Jeux vidéos & Consoles": Gamepad2,
  Bricolage: Wrench,
  "Sports & Loisirs": Dumbbell,
  "Bébé & Jouets": Baby,
  Librairie: BookOpen,
  "Autres catégories": PackageSearch,
  Toutes: LayoutGrid,
};

export default function CategorySidebar({ categories, mode = "sidebar", isMobile = false }) {
  const { categorieActive, setCategorieActive } = useContext(CategorieContext);

  const renderCategory = (cat, i) => {
    const Icon = iconsMap[cat] || PackageSearch;
    const active = categorieActive === cat;

    return (
      <button
        key={i}
        onClick={() => setCategorieActive(cat)}
        className={`flex items-center group transition-all duration-300 relative
          ${mode === "horizontal" 
            ? "px-4 py-2 whitespace-nowrap gap-2 text-xs font-bold uppercase tracking-tight" 
            : "w-full py-3 px-4 text-left gap-3 border-l-4"}
          ${active 
            ? "bg-blue-50 text-blue-700 border-blue-600 font-bold" 
            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600 border-transparent"}
        `}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 
          ${active ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"}`} 
        /> 
        
        <span className="flex-1">{cat}</span>

        {/* Petit indicateur visuel en mode sidebar uniquement */}
        {mode === "sidebar" && !active && (
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-300" />
        )}
      </button>
    );
  };

  // --- VERSION HORIZONTALE (MOBILE & TOP BAR) ---
  if (mode === "horizontal") {
    return (
      <nav className="bg-white border-b sticky top-[64px] z-30 shadow-sm overflow-hidden">
        <div className="flex items-center max-w-[1400px] mx-auto px-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {categories.map((cat, i) => renderCategory(cat, i))}
        </div>
        {/* Dégradé pour indiquer qu'il y a plus à défiler à droite */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
      </nav>
    );
  }

  // --- VERSION SIDEBAR (STYLE JUMIA/RYNEK) ---
  return (
    <aside
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit sticky top-24 max-h-[85vh] transition-all duration-500
        ${isMobile ? "block md:hidden mb-6" : "hidden md:block"}`}
      aria-label="Navigation des catégories"
    >
      {/* HEADER PREMIUM */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-5 flex items-center gap-3 relative overflow-hidden">
        <LayoutGrid size={20} className="relative z-10" />
        <h2 className="text-[13px] font-black uppercase tracking-[0.1em] relative z-10">
          Rayons <span className="opacity-60 font-medium italic">Rynek</span>
        </h2>
        {/* Petit cercle décoratif en fond */}
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full" />
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-60px)] custom-scrollbar">
        {/* Option "Toutes" isolée */}
        <div className="border-b border-gray-50">
          {renderCategory("Toutes", "all")}
        </div>

        <ul className="flex flex-col">
          {categories
            .filter((cat) => cat !== "Toutes")
            .map((cat, i) => (
              <li key={i} className="border-b border-gray-50 last:border-0">
                {renderCategory(cat, i)}
              </li>
            ))}
        </ul>
      </div>

      {/* FOOTER DE LA SIDEBAR (Optionnel : Aide/Promo) */}
      <div className="p-4 bg-gray-50/50">
         <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[10px] font-bold text-blue-700 leading-tight">Besoin d'aide ?</p>
            <p className="text-[9px] text-blue-500 mt-1">Nos experts vous guident dans vos choix.</p>
         </div>
      </div>
    </aside>
  );
}