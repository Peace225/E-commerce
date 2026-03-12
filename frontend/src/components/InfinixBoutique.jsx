import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPopup({ product, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("Carte Bancaire");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Commande confirmée 🎉 Merci pour votre achat !");
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        // Wrapper global pour gérer le centrage Desktop vs Mobile
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
          
          {/* Overlay noir */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          {/* Popup principal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-[2rem] md:rounded-[2rem] shadow-2xl p-5 sm:p-6 md:p-8 overflow-y-auto max-h-[90vh] pointer-events-auto"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* 🔹 En-tête */}
            <div className="flex justify-between items-center mb-6">
              <h2 id="checkout-title" className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Finaliser l'achat
              </h2>
              <button 
                onClick={onClose} 
                className="bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                aria-label="Fermer"
              >
                &times;
              </button>
            </div>

            {/* 🔹 Récapitulatif Produit */}
            <div className="flex items-center gap-4 mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl p-2 shrink-0 shadow-sm flex items-center justify-center">
                <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2">{product.name}</h3>
                <p className="text-lg font-black text-gray-900 dark:text-white mt-1">{product.price}</p>
              </div>
            </div>

            {/* 🔹 Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Nom et Prénom</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Nom et Prénom"
                  required
                  className="w-full p-3.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-3.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                />
              </div>

              <div>
                <label htmlFor="phone" className="sr-only">Téléphone</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Téléphone"
                  required
                  className="w-full p-3.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                />
              </div>

              <div>
                <label htmlFor="address" className="sr-only">Adresse de livraison</label>
                <textarea
                  id="address"
                  placeholder="Adresse de livraison complète"
                  rows="2"
                  required
                  className="w-full p-3.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all outline-none resize-none"
                />
              </div>

              {/* 🔹 Paiement */}
              <div className="pt-2">
                <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3 uppercase tracking-wider">Mode de paiement</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === "Carte Bancaire" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="Carte Bancaire"
                      checked={paymentMethod === "Carte Bancaire"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <span className="text-xs font-bold">Carte Bancaire</span>
                  </label>

                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === "PayPal" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="PayPal"
                      checked={paymentMethod === "PayPal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <span className="text-xs font-bold">PayPal</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl mt-6 transition-all shadow-lg active:scale-95"
              >
                Confirmer et Payer
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}