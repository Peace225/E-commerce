import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Link as LinkIcon } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

export default function CheckoutPopup({ product, onClose, user }) {
  if (!product) return null;

  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleAddToCart = () => alert(`Produit ajouté au panier : ${product.name}`);

  const handleShareClick = () => {
    if (!user) {
      alert("Vous devez être connecté pour partager ce produit !");
      return;
    }
    setShowShareOptions(!showShareOptions);
  };

  const handleShareLink = (platform) => {
    const url = window.location.origin + (product.link || "/");
    let shareUrl = "";

    switch(platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(product.name)}`;
        break;
      case "instagram":
        alert("Instagram ne permet pas le partage direct depuis le web, copiez le lien manuellement !");
        return;
      case "tiktok":
        alert("TikTok ne permet pas le partage direct depuis le web, copiez le lien manuellement !");
        return;
      default:
        navigator.clipboard.writeText(url);
        alert("Lien copié dans le presse-papiers ✅");
        return;
    }

    window.open(shareUrl, "_blank");
    setShowShareOptions(false); // ferme le menu après partage
  };

  const marketingDesc = product.marketingDesc || 
    "Découvrez ce produit premium qui transformera votre quotidien avec style et performance !";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-gradient-to-br from-white via-orange-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                     p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl cursor-pointer overflow-hidden"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          {/* Badge Stock limité */}
          {product.stockLimited && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full animate-pulse shadow-lg z-20">
              Stock limité
            </span>
          )}

          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white z-20"
          >
            <X size={24} />
          </button>

          {/* Image */}
          <motion.div className="relative mb-4 rounded-xl shadow-xl overflow-hidden">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-40 sm:h-44 md:h-52 lg:h-60 object-contain rounded-xl transition-transform duration-500 hover:scale-105"
            />
          </motion.div>

          {/* Infos produit */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-1">{product.name}</h2>
          <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm md:text-base mb-2 line-clamp-4">{product.description}</p>
          <p className="text-orange-600 font-semibold mb-3 italic text-xs sm:text-sm md:text-base">{marketingDesc}</p>

          {/* Prix */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{product.price}</span>
            {product.oldPrice && (
              <span className="text-xs sm:text-sm md:text-base line-through text-gray-400">{product.oldPrice}</span>
            )}
          </div>

          {/* ⭐ Étoiles */}
          <div className="flex items-center mb-4 text-sm sm:text-base md:text-lg">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`mr-1 ${i < Math.floor(product.rating || 5) ? "text-yellow-400" : "text-gray-300"}`}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:gap-3 mb-4">
            <motion.button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 sm:py-3 rounded-xl shadow-md text-sm sm:text-base md:text-lg"
              whileHover={{ scale: 1.05 }}
            >
              <ShoppingCart size={20} /> Ajouter au panier
            </motion.button>

            {/* Bouton Partage */}
            <motion.button
              onClick={handleShareClick}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-xl text-sm sm:text-base md:text-lg"
              whileHover={{ scale: 1.03 }}
            >
              <LinkIcon size={20} /> Partager le lien
            </motion.button>

            {/* Menu réseaux sociaux */}
            {showShareOptions && (
              <div className="flex flex-wrap gap-2 mt-2 justify-between">
                <motion.button
                  onClick={() => handleShareLink("facebook")}
                  className="flex-1 min-w-[45%] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaFacebookF /> Facebook
                </motion.button>
                <motion.button
                  onClick={() => handleShareLink("twitter")}
                  className="flex-1 min-w-[45%] flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaTwitter /> Twitter
                </motion.button>
                <motion.button
                  onClick={() => handleShareLink("instagram")}
                  className="flex-1 min-w-[45%] flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaInstagram /> Instagram
                </motion.button>
                <motion.button
                  onClick={() => handleShareLink("tiktok")}
                  className="flex-1 min-w-[45%] flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaTiktok /> TikTok
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}