import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLATFORMS_DEFAULT = [
  {
    name: "Shopify",
    url: "https://www.shopify.com/",
    logo: "https://cdn.shopify.com/assets/images/logos/shopify-bag.png",
  },
  {
    name: "WooCommerce",
    url: "https://woocommerce.com/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/WooCommerce_logo.svg",
  },
  {
    name: "Amazon",
    url: "https://sell.amazon.com/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
];

export default function GestionMultiCanaux() {
  const [platforms, setPlatforms] = useState(PLATFORMS_DEFAULT);
  const [redirecting, setRedirecting] = useState("");
  const [showManagePopup, setShowManagePopup] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newPlatform, setNewPlatform] = useState({ name: "", url: "", logo: "" });

  const openLink = (url, platform) => {
    setRedirecting(platform);
    setTimeout(() => {
      window.open(url, "_blank");
      setRedirecting("");
    }, 1000);
  };

  const handleAddPlatform = () => {
    if (!newPlatform.name || !newPlatform.url || !newPlatform.logo) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    setPlatforms((prev) => [...prev, newPlatform]);
    setNewPlatform({ name: "", url: "", logo: "" });
    setShowAddForm(false);
  };

  const handleDeletePlatform = (name) => {
    if (confirm(`Supprimer la plateforme "${name}" ?`)) {
      setPlatforms((prev) => prev.filter((p) => p.name !== name));
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-8 relative">
      <h2 className="text-2xl font-bold text-green-600 mb-8 text-center">Gestion Multi-Canaux</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {platforms.map((platform) => (
          <ServiceCard
            key={platform.name}
            {...platform}
            loading={redirecting === platform.name}
            onClick={openLink}
          />
        ))}
      </div>

      {/* Boutons */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowManagePopup(true)}
          className="px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-full hover:bg-green-50 transition-all duration-300 shadow-md"
        >
          Gérer toutes mes plateformes
        </motion.button>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center italic">
        (Bientôt : Synchronisation automatique des ventes et inventaires 🔄)
      </p>

      {/* 🔥 Popup Gestion */}
      <AnimatePresence>
        {showManagePopup && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowManagePopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                ✖
              </button>

              <h3 className="text-xl font-bold text-green-600 mb-6 text-center">Toutes vos plateformes connectées</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 relative"
                  >
                    <img src={platform.logo} alt={platform.name} className="h-10 w-10 object-contain" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white">{platform.name}</h4>
                      <a href={platform.url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                        Voir
                      </a>
                    </div>
                    <button
                      onClick={() => handleDeletePlatform(platform.name)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(!showAddForm)}
                className="block mx-auto px-6 py-2 rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50 transition"
              >
                {showAddForm ? "Annuler" : "+ Ajouter une plateforme"}
              </motion.button>

              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Nom de la plateforme"
                      value={newPlatform.name}
                      onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })}
                      className="w-full border rounded p-2"
                    />
                    <input
                      type="text"
                      placeholder="URL de la plateforme"
                      value={newPlatform.url}
                      onChange={(e) => setNewPlatform({ ...newPlatform, url: e.target.value })}
                      className="w-full border rounded p-2"
                    />
                    <input
                      type="text"
                      placeholder="Logo (URL image)"
                      value={newPlatform.logo}
                      onChange={(e) => setNewPlatform({ ...newPlatform, logo: e.target.value })}
                      className="w-full border rounded p-2"
                    />

                    <button
                      onClick={handleAddPlatform}
                      className="w-full py-2 mt-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Ajouter
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xs text-center text-gray-400 mt-6 italic">
                Bientôt : Synchronisation automatique des ventes 🔄
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ServiceCard({ name, url, logo, loading, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
    >
      <img src={logo} alt={`${name} logo`} className="h-16 w-16 object-contain mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{name}</h3>
      <button
        onClick={() => onClick(url, name)}
        className="mt-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full transition-all duration-300"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <span>Connecter</span>
        )}
      </button>
    </motion.div>
  );
}