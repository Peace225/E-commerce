import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, RefreshCcw } from "lucide-react";
import dayjs from "dayjs";

export default function MultiCanaux() {
  const [platforms, setPlatforms] = useState([
    { name: "Shopify", url: "https://shopify.com", logo: "https://cdn.shopify.com/assets/images/logos/shopify-bag.png", status: "Synchronisé", lastSync: dayjs().subtract(1, "day").format('YYYY-MM-DD HH:mm'), history: [], success: 0, error: 0 },
    { name: "WooCommerce", url: "https://woocommerce.com", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/WooCommerce_logo.svg", status: "En attente", lastSync: null, history: [], success: 0, error: 0 },
    { name: "Amazon", url: "https://amazon.com", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", status: "Erreur", lastSync: null, history: [], success: 0, error: 0 },
  ]);

  const [newPlatform, setNewPlatform] = useState({ name: "", url: "", logo: "" });
  const [showForm, setShowForm] = useState(false);
  const [syncing, setSyncing] = useState("");

  const handleAddPlatform = () => {
    if (!newPlatform.name || !newPlatform.url || !newPlatform.logo) return;
    setPlatforms(prev => [...prev, { ...newPlatform, status: "En attente", lastSync: null, history: [], success: 0, error: 0 }]);
    setNewPlatform({ name: "", url: "", logo: "" });
    setShowForm(false);
  };

  const handleSynchronize = (name) => {
    setSyncing(name);

    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% réussite
      const now = dayjs().format('YYYY-MM-DD HH:mm');

      setPlatforms(prev =>
        prev.map(p =>
          p.name === name
            ? {
                ...p,
                status: success ? "Synchronisé" : "Erreur",
                lastSync: success ? now : p.lastSync,
                success: success ? p.success + 1 : p.success,
                error: !success ? p.error + 1 : p.error,
                history: [{ time: now, status: success ? "Succès" : "Erreur" }, ...p.history],
              }
            : p
        )
      );
      setSyncing("");
    }, 2000);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-600">Gestion Multi-Canaux</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col"
            >
              <img src={platform.logo} alt={platform.name} className="h-16 w-16 object-contain mx-auto mb-4" />
              <h3 className="text-lg font-bold text-center mb-1">{platform.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">{platform.url}</p>

              <span className={`text-xs font-semibold mx-auto px-3 py-1 rounded-full mb-2 ${
                platform.status === "Synchronisé" ? "bg-green-100 text-green-600" :
                platform.status === "En attente" ? "bg-yellow-100 text-yellow-600" :
                "bg-red-100 text-red-600"
              }`}>
                {platform.status}
              </span>

              {platform.status === "Erreur" && (
                <p className="text-red-500 text-xs text-center my-2">❌ Dernière synchronisation échouée.</p>
              )}

              {platform.lastSync && (
                <p className="text-xs text-gray-400 text-center mb-2">Dernière synchro : {platform.lastSync}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={syncing === platform.name}
                onClick={() => handleSynchronize(platform.name)}
                className={`flex items-center justify-center gap-2 mt-4 px-4 py-2 rounded-full font-semibold transition-all ${
                  syncing === platform.name ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                } text-white w-full`}
              >
                {syncing === platform.name ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                {syncing === platform.name ? "Synchronisation..." : "Synchroniser"}
              </motion.button>

              {/* Statistiques */}
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>✅ Succès : {platform.success}</p>
                <p>❌ Échecs : {platform.error}</p>
              </div>

              {/* Timeline Historique */}
              {platform.history.length > 0 && (
                <div className="mt-4 text-xs">
                  <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Historique :</h4>
                  <ul className="space-y-1 max-h-32 overflow-y-auto">
                    {platform.history.map((h, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <span>{h.time}</span>
                        <span className={`ml-2 ${
                          h.status === "Succès" ? "text-green-500" : "text-red-500"
                        }`}>
                          {h.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}

          {/* Carte ajout plateforme */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="border-2 border-dashed border-green-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 dark:hover:bg-green-900"
            onClick={() => setShowForm(true)}
          >
            <PlusCircle className="h-10 w-10 text-green-500" />
            <p className="text-green-600 mt-2 font-semibold">Ajouter une plateforme</p>
          </motion.div>
        </div>

        {/* Formulaire modal ajout */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
              <h2 className="text-xl font-bold text-center text-green-600 mb-4">Nouvelle plateforme</h2>
              <input
                type="text"
                placeholder="Nom de la plateforme"
                value={newPlatform.name}
                onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="URL (ex: https://exemple.com)"
                value={newPlatform.url}
                onChange={(e) => setNewPlatform({ ...newPlatform, url: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Lien du logo"
                value={newPlatform.logo}
                onChange={(e) => setNewPlatform({ ...newPlatform, logo: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-2 pt-4">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Annuler</button>
                <button onClick={handleAddPlatform} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}