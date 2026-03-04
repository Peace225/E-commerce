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
        <>
          {/* Overlay noir */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup principal */}
          <motion.div
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg p-6 w-full max-w-lg z-50 overflow-y-auto max-h-[90vh]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-green-600">Finaliser votre achat</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-xl">
                &times;
              </button>
            </div>

            {/* Récapitulatif Produit */}
            <div className="flex items-center gap-4 mb-6">
              <img src={product.img} alt={product.name} className="w-20 h-20 object-contain" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                <p className="text-green-600 font-bold">{product.price}</p>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nom et Prénom"
                required
                className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                required
                className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
              />
              <textarea
                placeholder="Adresse de livraison"
                required
                className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
              />

              {/* Paiement */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Mode de paiement</h4>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="Carte Bancaire"
                    checked={paymentMethod === "Carte Bancaire"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-green-600"
                  />
                  Carte Bancaire
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-green-600"
                  />
                  PayPal
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full mt-6 transition"
              >
                Confirmer et Payer
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}