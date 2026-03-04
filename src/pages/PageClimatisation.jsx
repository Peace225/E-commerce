import { useNavigate } from "react-router-dom";
import { ArrowLeft, Snowflake, Filter, Search, ShoppingCart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { climatiseurs } from "../components/ClimatisationVentioateurs"; // Import des données

export default function PageClimatisation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 HEADER DE PAGE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-cyan-50 hover:border-cyan-200 transition-all group"
            >
              <ArrowLeft className="text-gray-600 group-hover:text-cyan-600" size={24} />
            </button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                <Snowflake className="text-cyan-500" size={36} />
                Espace <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">Fraîcheur</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1">Climatiseurs, Ventilateurs et solutions de refroidissement.</p>
            </div>
          </div>

          {/* Recherche & Filtre */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un modèle..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* 🔹 GRILLE DE PRODUITS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {climatiseurs.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={item.id}
              onClick={() => navigate(`/product-clim/${item.id}`)}
              className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all group cursor-pointer"
            >
              <div className="relative aspect-square bg-white p-4">
                <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                {item.discount && (
                  <div className="absolute top-4 left-4 bg-cyan-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                    {item.discount}
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-gray-50">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[40px]">{item.name}</h3>
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-xl font-black text-gray-900">{item.price.toLocaleString()} <span className="text-xs">FCFA</span></p>
                  
                  {/* Badge Commission */}
                  <div className="flex items-center justify-between bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                    <TrendingUp size={14} className="text-green-600" />
                    <span className="text-[11px] font-black text-green-700">
                      +{(item.price * item.commissionRate).toLocaleString()} F
                    </span>
                  </div>

                  <button className="mt-2 w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-cyan-600 transition-colors">
                    <ShoppingCart size={16} /> Acheter
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}