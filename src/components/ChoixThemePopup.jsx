import { motion } from "framer-motion";

const themes = [
  {
    name: "Minimaliste",
    image: "https://via.placeholder.com/300x150/ffffff/000000?text=Minimaliste",
  },
  {
    name: "Élégant",
    image: "https://via.placeholder.com/300x150/1f2937/ffffff?text=%C3%89l%C3%A9gant",
  },
  {
    name: "Dynamique",
    image: "https://via.placeholder.com/300x150/10b981/ffffff?text=Dynamique",
  },
];

export default function ChoixThemePopup({ onClose, onSelectTheme, selectedTheme }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-3xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-8">
          Choisissez un Thème pour votre Boutique
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => onSelectTheme(theme.name)}
              className={`border p-2 rounded-lg hover:border-green-600 transition ${
                selectedTheme === theme.name ? "border-green-600" : "border-gray-300"
              }`}
            >
              {/* Affichage de l'image et du nom directement */}
              <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="w-full h-auto object-cover"
                />
                <p className="text-center font-semibold mt-2">{theme.name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Boutons Annuler / Valider */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => onClose(false)}
            className="px-5 py-2 text-gray-500 hover:underline"
          >
            Annuler
          </button>
          <button
            onClick={() => onClose(true)}
            disabled={!selectedTheme}
            className={`px-5 py-2 rounded-full text-white ${
              selectedTheme ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Valider le Thème
          </button>
        </div>
      </div>
    </motion.div>
  );
}
