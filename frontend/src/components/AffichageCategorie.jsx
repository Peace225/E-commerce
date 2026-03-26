import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../utils/supabaseClient"; // On change l'import !
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { CategorieContext } from "../contexte/CategoriesContext";

export default function AffichageCategorie({ categorie }) {
  const [produitsParMarque, setProduitsParMarque] = useState({});
  const [loading, setLoading] = useState(true);
  const { setCategorieActive } = useContext(CategorieContext);

  useEffect(() => {
    const fetchProduitsSupabase = async () => {
      setLoading(true);
      try {
        // 🔄 REQUÊTE SUPABASE : On récupère tout où la catégorie correspond
        let query = supabase.from('produits').select('*');
        
        // Si la catégorie n'est pas "Toutes", on filtre
        if (categorie !== "Toutes") {
          query = query.eq('categorie', categorie);
        }

        const { data, error } = await query;

        if (error) throw error;

        // 📦 Groupement par marque (comme avant)
        const grouped = data.reduce((acc, produit) => {
          const marque = produit.marque ? produit.marque.toUpperCase() : "AUTRES";
          if (!acc[marque]) acc[marque] = [];
          acc[marque].push(produit);
          return acc;
        }, {});

        setProduitsParMarque(grouped);
      } catch (error) {
        console.error("Erreur de récupération Supabase :", error.message);
      }
      setLoading(false);
    };

    if (categorie) {
      fetchProduitsSupabase();
    }
  }, [categorie]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-[#e96711] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // S'il n'y a aucun produit dans cette catégorie
  if (Object.keys(produitsParMarque).length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
        <Package size={48} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-2xl font-black text-gray-800 mb-2">Rayon vide</h2>
        <p className="text-gray-500 mb-8">Nous n'avons pas encore d'articles pour "{categorie}".</p>
        <button 
          onClick={() => setCategorieActive("Toutes")}
          className="bg-[#e96711] text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header Dynamique */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <button 
            onClick={() => setCategorieActive("Toutes")}
            className="flex items-center gap-2 text-blue-200 hover:text-white text-xs font-bold uppercase mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Toutes les catégories
          </button>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2">
            {categorie}
          </h1>
          <p className="text-blue-100 opacity-80 font-medium">Les meilleurs prix Rynek sélectionnés pour vous.</p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Affichage par Marque */}
      {Object.entries(produitsParMarque).map(([marque, produits]) => (
        <section key={marque} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
            <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">
              {marque}
            </h2>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
              {produits.length} Articles
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {produits.map((produit) => (
              <motion.div 
                key={produit.id}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all flex flex-col"
              >
                {/* Image */}
                <Link to={`/product/${produit.id}`} className="relative h-48 bg-gray-50/50 p-4 flex items-center justify-center">
                  <img 
                    src={produit.img} 
                    alt={produit.nom} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                  {produit.discount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                      {produit.discount}
                    </span>
                  )}
                </Link>

                {/* Infos */}
                <div className="p-4 flex flex-col flex-1">
                  <Link to={`/product/${produit.id}`}>
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-2 group-hover:text-blue-600">
                      {produit.nom}
                    </h3>
                  </Link>
                  <div className="mt-auto">
                    <p className="text-lg font-black text-[#e96711]">
                      {produit.prix?.toLocaleString()} <span className="text-[10px]">FCFA</span>
                    </p>
                    <div className="mt-3 flex gap-2">
                       <button className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                         <ShoppingCart size={14} /> Acheter
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}