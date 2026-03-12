import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Filter, Search, ShoppingCart, TrendingUp, Package } from "lucide-react";
import { motion } from "framer-motion";
import { produitsDestockage } from "../data/productsData"; // Import de tes données centralisées

export default function PageDestockage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 HEADER DE PAGE IMPACTANT */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-yellow-50 hover:border-yellow-400 transition-all group"
            >
              <ArrowLeft className="text-gray-600 group-hover:text-black" size={24} />
            </button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                <Package className="text-yellow-500" size={36} />
                Arrivages <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-600">Déstockage</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Objets neufs • Fins de séries • Prix sacrifiés</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Chercher une affaire..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* 🔹 GRILLE DE DÉSTOCKAGE */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {produitsDestockage.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="group cursor-pointer overflow-hidden rounded-[2rem] border border-gray-100 bg-white transition-all hover:shadow-2xl hover:shadow-yellow-500/10"
            >
              <div className="relative aspect-square p-6 bg-gray-50/50">
                <img src={item.img} alt={item.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-black text-white shadow-lg uppercase">
                  Vente Finale
                </div>
              </div>

              <div className="p-5">
                <div className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded w-fit mb-2">{item.discount}</div>
                <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-gray-900 leading-tight">{item.name}</h3>
                
                <div className="mt-4 flex flex-col gap-2">
                  <div>
                    <p className="text-xl font-black text-gray-900">{item.price}</p>
                    <p className="text-xs line-through text-gray-400 font-bold">{item.oldPrice}</p>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5 mt-2">
                    <TrendingUp size={14} className="text-yellow-700" />
                    <span className="text-[11px] font-black text-yellow-800 uppercase tracking-tighter">
                      Gagnez {item.commission}
                    </span>
                  </div>

                  <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800">
                    <ShoppingCart size={16} className="text-yellow-400" /> Vendre
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 🔹 FOOTER DE PAGE (Rassurance) */}
        <div className="mt-16 bg-black rounded-[2.5rem] p-8 text-center border border-yellow-500/30">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Besoin d'un arrivage massif ?</h2>
          <p className="text-gray-400 text-sm mt-2">Contactez notre service logistique pour les commandes groupées.</p>
          <button className="mt-6 bg-yellow-500 text-black px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all">
            Nous contacter
          </button>
        </div>
      </div>
    </div>
  );
}