import { useState } from "react";
import { Link } from "react-router-dom"; // 🚀 NOUVEAU : Indispensable pour le SEO
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, TrendingUp, X, ShoppingCart, Shirt } from "lucide-react";
import { useCart } from "../components/CartContext";
import CheckoutPopup from "../components/CheckoutPopup";
import { produitsMode } from "../data/productsData";

export default function Mode({ user }) {
  const { addToCart } = useCart();
  
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
    // 🚀 RESPONSIVE : Marges et arrondis adaptés au mobile
    <section className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden my-6 sm:my-12 relative">
      
      {/* 🔹 EN-TÊTE MODE (Thème Élégance Urbaine) */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black p-5 sm:p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6 relative overflow-hidden">
        
        <div className="flex items-center gap-3 sm:gap-5 relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border border-white/20 shrink-0">
             <Shirt className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
              Fashion <span className="text-gray-400">Hub</span>
            </h2>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-1.5 sm:mt-2">
              Tendances 2026 • Jusqu'à -75%
            </p>
          </div>
        </div>

        {/* 🚀 SEO : Vrai Lien et 100% largeur sur mobile */}
        <Link 
          to="/categories/mode"
          className="group relative z-10 flex items-center justify-center w-full md:w-auto gap-2 bg-white text-black hover:bg-gray-100 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 font-black text-[11px] sm:text-xs uppercase tracking-widest shadow-md"
        >
          <span>Voir la collection</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* 🔹 GRILLE DE PRODUITS */}
      <div className="p-3 sm:p-6 md:p-8 bg-gray-50/30">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {produitsMode.map((item) => (
            // 🚀 SÉMANTIQUE : Article
            <article
              key={item.id}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-black shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full overflow-hidden relative"
            >
              {item.discount && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 bg-black text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg pointer-events-none">
                  {item.discount}
                </div>
              )}

              {/* 🚀 ASTUCE SEO HYBRIDE : C'est un vrai lien pour Google, mais il ouvre la modale pour l'utilisateur */}
              <Link 
                to={`/product-mode/${item.id}`} 
                onClick={(e) => { 
                  e.preventDefault(); // Stoppe la navigation
                  handleProductAction(item); // Ouvre la modale
                }}
                className="flex flex-col flex-1 outline-none focus:ring-2 focus:ring-black"
                aria-label={`Voir les détails de ${item.name}`}
              >
                <div className="relative aspect-[3/4] w-full flex items-center justify-center p-3 sm:p-4 bg-white overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    loading="lazy" 
                    className="max-h-full max-w-full object-cover rounded-lg sm:rounded-xl transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>

                <div className="p-3 pt-1 sm:p-4 sm:pt-2 flex flex-col flex-1 pointer-events-none">
                  <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-700 line-clamp-2 mb-1.5 sm:mb-2 min-h-[32px] sm:min-h-[36px]">{item.name}</h3>
                  <div className="mt-auto">
                    <span className="text-sm sm:text-lg font-black text-gray-900 leading-none">{item.price}</span>
                    <span className="text-[9px] sm:text-[10px] line-through text-gray-300 font-bold block mb-2 sm:mb-3 mt-0.5 min-h-[14px]">
                      {item.oldPrice || ""}
                    </span>

                    <div className="bg-gray-50 border border-gray-100 rounded-lg sm:rounded-xl p-1.5 sm:p-2 flex items-center justify-between mb-3 sm:mb-4">
                      <TrendingUp size={12} className="text-green-600 sm:w-3.5 sm:h-3.5" />
                      <span className="text-[9px] sm:text-[10px] font-black text-green-600">+{item.commission}</span>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                <button 
                  onClick={() => { setSelectedProduct(item); setShowCheckout(true); }}
                  className="w-full bg-gray-900 hover:bg-black text-white py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-[11px] uppercase tracking-widest transition-all shadow-md active:scale-95"
                >
                  Acheter
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 🔹 POPUP PRODUIT DÉTAILLÉ (RESPONSIVE) */}
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black p-2 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
              
              <div className="bg-gray-50 rounded-2xl p-4 mb-5 sm:mb-6 flex justify-center">
                <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-40 sm:h-48 object-contain drop-shadow-sm" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 leading-tight">{selectedProduct.name}</h3>
              <p className="text-2xl sm:text-3xl font-black text-black mb-6">{selectedProduct.price}</p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button 
                  onClick={() => setShowCheckout(true)} 
                  className="bg-black text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                >
                  Payer
                </button>
                <button 
                  onClick={(e) => { handleAddToCart(e, selectedProduct); setSelectedProduct(null); }} 
                  className="border-2 border-black text-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
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
          onClose={() => {
            setShowCheckout(false);
            setSelectedProduct(null);
          }} 
        />
      )}

      {/* 🔹 TOAST NOTIFICATION */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto max-w-sm bg-gray-900 text-white px-5 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-2xl z-[200] flex items-center gap-3 border border-gray-700"
          >
            <div className="bg-green-500 rounded-full p-1.5 shrink-0"><ShoppingCart size={14} className="text-white" /></div>
            <span className="text-xs sm:text-sm font-bold truncate">Ajouté avec succès !</span>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}