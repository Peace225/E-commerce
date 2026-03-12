import { AnimatePresence, motion } from "framer-motion";

export default function AlertMessage({ message, type = "error", onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md text-white text-sm ${
            type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
        >
          <div className="flex items-center gap-2">
            <span>{message}</span>
            <button onClick={onClose} className="text-white font-bold ml-2">
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}