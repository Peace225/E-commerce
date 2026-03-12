import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Filter, Search, ShoppingBag, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { produitsBeaute } from "../data/productsData";

export default function PageBeaute() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fffafa] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 HEADER ÉLÉGANT */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-xl shadow-sm border border-rose-100 hover:bg-rose-50 transition-all group"
            >
              <ArrowLeft className="text-gray-600 group-hover:text-rose-500" size={24} />
            </button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                <Sparkles className="text-rose-400" size={36} />
                Catalogue <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Beauté</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1">Soins, maquillage et bien-être au meilleur prix.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un soin..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-300 transition-all"
              />
            </div>
            <button className="p-3 bg-white border border-rose-100 rounded-xl text-gray-600 hover:bg-rose-50">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* 🔹 GRILLE DE PRODUITS BEAUTÉ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {produitsBeaute.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={item.id}
              className="group cursor-pointer overflow-hidden rounded-[2rem] border border-rose-50 bg-white transition-all hover:shadow-2xl hover:shadow-rose-500/10"
            >
              <div className="relative aspect-square p-6 bg-rose-50/20">
                <img src={item.img} alt={item.name} className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-md px-3 py-1 text-[10px] font-black text-rose-500 shadow-sm border border-rose-100">
                  {item.discount}
                </div>
              </div>

              <div className="p-5">
                <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-gray-800 leading-tight">{item.name}</h3>
                
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-black text-gray-900">{item.price}</p>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50 px-3 py-1.5">
                    <TrendingUp size={14} className="text-rose-400" />
                    <span className="text-[11px] font-black text-rose-600">
                      Commission: {item.commission}
                    </span>
                  </div>

                  <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-rose-500">
                    <ShoppingBag size={16} /> Voir détails
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