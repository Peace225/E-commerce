import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingBag, ArrowRight, Share2, TrendingUp, X, ShoppingCart } from "lucide-react";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import CheckoutPopup from "../components/CheckoutPopup";
import { produitsBeaute } from "../data/productsData"; // ⚡ Données centralisées

export default function Beaute({ user }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleProductAction = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart({ ...product, quantity: 1 });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-12 relative">
      
      {/* 🔹 EN-TÊTE BEAUTÉ (Thème Rose / Or Luxueux) */}
      <div className="bg-gradient-to-r from-[#ffafbd] to-[#ffc3a0] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        
        {/* Motifs de fond (Éclats brillants) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Sparkles className="absolute top-4 left-10 text-white animate-pulse" size={40} />
          <Sparkles className="absolute bottom-4 right-20 text-white animate-bounce" size={30} />
        </div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/40">
             <Sparkles className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-sm">
              Espace <span className="text-[#d4af37]">Beauté</span>
            </h2>
            <p className="text-[10px] md:text-xs text-white/80 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              Révélez votre éclat • Jusqu'à -65%
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/categories/beaute')}
          className="group relative z-10 flex items-center gap-2 bg-white text-[#ffafbd] hover:bg-rose-50 px-6 py-3 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-widest shadow-md"
        >
          <span>Découvrir</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 🔹 GRILLE DE PRODUITS */}
      <div className="p-6 md:p-8 bg-rose-50/20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {produitsBeaute.map((item) => (
            <div
              key={item.id}
              onClick={() => handleProductAction(item)}
              className="group cursor-pointer bg-white rounded-3xl border border-gray-100 hover:border-rose-300 shadow-sm hover:shadow-[0_20px_40px_rgba(255,175,189,0.2)] transition-all duration-500 flex flex-col h-full overflow-hidden relative"
            >
              {/* Badge Discount */}
              <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-md">
                {item.discount}
              </div>

              {/* Image */}
              <div className="relative aspect-square w-full flex items-center justify-center p-6">
                <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110" />
                <button 
                  onClick={(e) => handleAddToCart(e, item)}
                  className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-md p-2 rounded-full text-rose-500 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all duration-300"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>

              {/* Infos */}
              <div className="p-4 pt-0 flex flex-col flex-1">
                <h3 className="text-[12px] font-bold text-gray-700 line-clamp-2 mb-2 min-h-[36px]">{item.name}</h3>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-gray-900 leading-none">{item.price}</span>
                  </div>
                  <span className="text-[10px] line-through text-gray-300 font-bold block mb-3">{item.oldPrice}</span>

                  {/* Badge Gain (Commission) */}
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-2 flex items-center justify-between mb-4">
                    <TrendingUp size={12} className="text-rose-400" />
                    <span className="text-[10px] font-black text-rose-600">+{item.commission}</span>
                  </div>

                  <button className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95">
                    Acheter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 POPUP PRODUIT DÉTAILLÉ */}
      <AnimatePresence>
        {selectedProduct && !showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="relative w-full max-w-md bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 text-gray-400 hover:text-rose-500"><X /></button>
              
              <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-48 object-contain mb-6" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">{selectedProduct.name}</h3>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-black text-rose-500">{selectedProduct.price}</span>
                <span className="text-sm line-through text-gray-300">{selectedProduct.oldPrice}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="bg-rose-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all"
                >
                  Payer
                </button>
                <button 
                  onClick={() => { handleAddToCart({stopPropagation:()=>{}}, selectedProduct); setSelectedProduct(null); }}
                  className="border-2 border-rose-500 text-rose-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all"
                >
                  + Panier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔹 POPUP CHECKOUT */}
      {showCheckout && selectedProduct && (
        <CheckoutPopup 
          product={selectedProduct} 
          onClose={() => setShowCheckout(false)} 
        />
      )}

      {/* 🔹 TOAST NOTIFICATION */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-full shadow-2xl z-[200] flex items-center gap-3 border border-rose-500/30"
          >
            <div className="bg-rose-500 rounded-full p-1"><ShoppingCart size={14} /></div>
            <span className="text-sm font-bold">Produit ajouté avec succès !</span>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}