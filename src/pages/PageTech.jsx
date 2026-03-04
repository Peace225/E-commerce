import { useNavigate } from "react-router-dom";
import { ArrowLeft, Cpu, Filter, Search, ShoppingCart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { produitsTech } from "../data/productsData";

export default function PageTech() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 text-white">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
              <ArrowLeft className="text-white group-hover:text-blue-400" size={24} />
            </button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-3 uppercase">
                Tech <span className="text-blue-500 underline decoration-blue-500/30">NextGen</span>
              </h1>
              <p className="text-gray-400 font-medium mt-1 uppercase text-[10px] tracking-widest">Hardware • Smartphones • Audio</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {produitsTech.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              key={item.id}
              className="bg-[#161621] rounded-[2rem] border border-white/5 overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer"
            >
              <div className="relative aspect-square p-6 bg-white">
                <img src={item.img} alt={item.name} className="h-full w-full object-contain" />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-gray-200 line-clamp-2 min-h-[40px]">{item.name}</h3>
                <p className="text-xl font-black text-blue-400 mt-4">{item.price}</p>
                <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700">
                  Acheter
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}