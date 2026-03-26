import React, { useContext } from "react";
import {
  Smartphone, Tv2, Laptop, Home, WashingMachine, Shirt, Heart,
  Gamepad2, Wrench, Dumbbell, Baby, PackageSearch, LayoutGrid, BookOpen, ChevronRight
} from "lucide-react";
import { CategorieContext } from "../contexte/CategoriesContext";

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

  const renderCategory = (cat) => {
    const Icon = iconsMap[cat] || PackageSearch;
    const active = categorieActive === cat;

    return (
      <button
        onClick={() => setCategorieActive(cat)}
        aria-pressed={active}
        className={`flex items-center group transition-all duration-300 relative w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          ${mode === "horizontal" 
            ? "px-5 py-2 whitespace-nowrap gap-2 text-xs font-bold uppercase tracking-tight rounded-full snap-start" 
            : "py-3 px-4 text-left gap-3 border-l-4"}
          ${active 
            ? (mode === "horizontal" ? "bg-blue-600 text-white shadow-md" : "bg-blue-50 text-blue-700 border-blue-600 font-bold") 
            : (mode === "horizontal" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600 border-transparent")}
        `}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 
          ${active ? (mode === "horizontal" ? "text-white" : "text-blue-600") : "text-gray-400 group-hover:text-blue-500"}`} 
        /> 
        
        <span className="flex-1 text-left text-sm">{cat}</span>

        {mode === "sidebar" && !active && (
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-300" />
        )}
      </button>
    );
  };

  if (mode === "horizontal") {
    return (
      <nav aria-label="Catégories rapides" className="bg-white border-b sticky top-[64px] z-30 shadow-sm overflow-hidden w-full">
        <ul className="flex items-center max-w-[1400px] mx-auto px-3 overflow-x-auto gap-2 py-3 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((cat, i) => (
            <li key={`horiz-${i}`} className="flex-shrink-0">
              {renderCategory(cat)}
            </li>
          ))}
        </ul>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </nav>
    );
  }

  return (
    <aside
      // Suppression de overflow-hidden ici pour éviter de couper la barre de défilement
      className={`bg-white rounded-2xl shadow-sm border border-primary flex flex-col sticky top-28 z-20 
        ${isMobile ? "block md:hidden mb-6" : "hidden md:block"}`}
      aria-label="Navigation des rayons"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-5 flex items-center gap-3 relative overflow-hidden rounded-t-2xl flex-shrink-0">
        <LayoutGrid size={20} className="relative z-10" />
        <h2 className="text-[13px] font-black uppercase tracking-[0.1em] relative z-10">
          Rayons <span className="opacity-60 font-medium italic">Rynek</span>
        </h2>
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full" />
      </div>

      {/* ZONE SCROLLABLE */}
      {/* L'ajout de max-h-[60vh] FORCE le scroll à apparaître si on dépasse 60% de l'écran */}
      <div className="overflow-y-auto max-h-[60vh] custom-scrollbar">
        <ul className="flex flex-col">
          <li className="border-b border-gray-100 sticky top-0 bg-white z-10 shadow-sm">
            {renderCategory("Toutes")}
          </li>
          
          {categories
            .filter((cat) => cat !== "Toutes")
            .map((cat, i) => (
              <li key={`sidebar-${i}`} className="border-b border-gray-50 last:border-0">
                {renderCategory(cat)}
              </li>
            ))}
        </ul>
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100 rounded-b-2xl flex-shrink-0">
         <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[10px] font-bold text-blue-800 leading-tight">Besoin d'aide ?</p>
            <p className="text-[9px] text-blue-600 mt-1">Nos experts vous guident dans vos choix.</p>
         </div>
      </div>
    </aside>
  );
}