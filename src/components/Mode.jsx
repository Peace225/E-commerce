import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, TrendingUp, X, ShoppingCart, Shirt } from "lucide-react";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import CheckoutPopup from "../components/CheckoutPopup";
import { produitsMode } from "../data/productsData"; // ⚡ Données centralisées

export default function Mode({ user }) {
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
      
      {/* 🔹 EN-TÊTE MODE (Thème Élégance Urbaine) */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
             <Shirt className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
              Fashion <span className="text-gray-400">Hub</span>
            </h2>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">
              Tendances 2026 • Jusqu'à -75%
            </p>
          </div>
        </div>

        <button 
  onClick={() => navigate('/categories/mode')} // ⚡ Redirection vers la page mode
  className="group relative z-10 flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-widest shadow-md"
>
  <span>Voir la collection</span>
  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
</button>
      </div>

      {/* 🔹 GRILLE DE PRODUITS */}
      <div className="p-6 md:p-8 bg-gray-50/30">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {produitsMode.map((item) => (
            <div
              key={item.id}
              onClick={() => handleProductAction(item)}
              className="group cursor-pointer bg-white rounded-3xl border border-gray-100 hover:border-black shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full overflow-hidden relative"
            >
              {item.discount && (
                <div className="absolute top-3 left-3 z-10 bg-black text-white text-[9px] font-black px-2 py-1 rounded-lg">
                  {item.discount}
                </div>
              )}

              <div className="relative aspect-[3/4] w-full flex items-center justify-center p-4 bg-white">
                <img src={item.img} alt={item.name} className="max-h-full max-w-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" />
              </div>

              <div className="p-4 pt-2 flex flex-col flex-1">
                <h3 className="text-[12px] font-bold text-gray-700 line-clamp-2 mb-2 min-h-[36px]">{item.name}</h3>
                <div className="mt-auto">
                  <span className="text-lg font-black text-gray-900 leading-none">{item.price}</span>
                  {item.oldPrice && (
                    <span className="text-[10px] line-through text-gray-300 font-bold block mb-3">{item.oldPrice}</span>
                  )}

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-2 flex items-center justify-between mb-4">
                    <TrendingUp size={12} className="text-green-600" />
                    <span className="text-[10px] font-black text-green-600">+{item.commission}</span>
                  </div>

                  <button className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all">
                    Acheter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popups (Produit & Checkout) - Gardez la même logique que pour Beauté */}
      <AnimatePresence>
        {selectedProduct && !showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative w-full max-w-md bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl p-8">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X /></button>
              <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-48 object-contain mb-6" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">{selectedProduct.name}</h3>
              <p className="text-3xl font-black text-black mb-6">{selectedProduct.price}</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowCheckout(true)} className="bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Payer</button>
                <button onClick={(e) => { handleAddToCart(e, selectedProduct); setSelectedProduct(null); }} className="border-2 border-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest">+ Panier</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showCheckout && selectedProduct && <CheckoutPopup product={selectedProduct} onClose={() => setShowCheckout(false)} />}
    </section>
  );
}