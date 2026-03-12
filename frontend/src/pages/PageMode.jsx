import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shirt, Filter, Search, ShoppingBag, TrendingUp, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { produitsMode } from "../data/productsData"; // On importe les données centralisées

export default function PageMode() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 HEADER ÉPURÉ */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all duration-300 group"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase">
                Fashion <span className="text-gray-400">HUB</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1">Nouvelle collection Printemps-Été 2026</p>
            </div>
          </div>

          {/* Recherche & Filtre */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Chercher un article, une marque..." 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
            <button className="p-3.5 bg-gray-50 rounded-2xl text-gray-900 hover:bg-black hover:text-white transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* 🔹 GRILLE DE MODE */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {produitsMode.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="group cursor-pointer"
            >
              {/* Image avec Overlay */}
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 mb-4">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Badge Discount */}
                {item.discount && (
                  <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                    {item.discount}
                  </div>
                )}

                {/* Bouton Like Rapide */}
                <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-gray-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110">
                  <Heart size={18} />
                </button>
              </div>

              {/* Infos Produit */}
              <div className="px-2">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:underline decoration-2 underline-offset-4">
                  {item.name}
                </h3>
                
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-gray-900">{item.price}</p>
                    {item.oldPrice && (
                      <p className="text-xs line-through text-gray-400 font-bold">{item.oldPrice}</p>
                    )}
                  </div>

                  {/* Commission Indicator */}
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                    <TrendingUp size={12} className="text-green-600" />
                    <span className="text-[10px] font-black text-green-700">+{item.commission}</span>
                  </div>
                </div>

                <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-black group-hover:shadow-lg group-hover:shadow-gray-200">
                  <ShoppingBag size={14} /> Ajouter au panier
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}