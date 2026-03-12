import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ type = "success", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const color = type === "success" ? "bg-green-600" : "bg-red-600";
  const icon = type === "success" ? "✅" : "❌";

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
          className={`fixed bottom-6 right-6 ${color} text-white px-6 py-3 rounded shadow-lg z-50 flex items-center justify-between gap-4 min-w-[250px]`}
        >
          <div className="flex items-center gap-2">
            <span>{icon}</span>
            <span>{message}</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 font-bold text-lg"
            aria-label="Fermer la notification"
          >
            ✖
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}