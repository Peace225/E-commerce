import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Filter, Search, ShoppingCart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { produitsMaison } from "../data/productsData";

export default function PageMaison() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-all group">
              <ArrowLeft className="text-gray-600 group-hover:text-emerald-600" size={24} />
            </button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-3 uppercase">
                Maison <span className="text-emerald-600">Pro</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Électroménager • Mobilier • Décoration</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {produitsMaison.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              key={item.id}
              className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all cursor-pointer"
            >
              <div className="relative aspect-square p-6">
                <img src={item.img} alt={item.name} className="h-full w-full object-contain transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-5 border-t border-gray-50">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[40px]">{item.name}</h3>
                <p className="text-xl font-black text-emerald-700 mt-4">{item.price}</p>
                <button className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700">
                  Voir l'offre
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}