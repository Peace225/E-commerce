import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

export default function AssistantChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Message de bienvenue par défaut
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "👋 Bonjour ! Je suis l'assistant Rynek. Comment puis-je vous aider aujourd'hui ?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // 🔄 AUTO-SCROLL : Descend automatiquement quand un nouveau message arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 💬 GESTION DE L'ENVOI D'UN MESSAGE
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // 🤖 SIMULATION DE RÉPONSE DU BOT (À remplacer par ton API / Firebase / OpenAI)
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Merci pour votre message ! Un conseiller va prendre le relais d'ici peu. Avez-vous votre numéro de commande ?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500); // Le bot "réfléchit" pendant 1.5s
  };

  return (
    <>
      {/* 🔹 BOUTON FLOTTANT (FAB) POUR OUVRIR LE CHAT */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-colors group"
          >
            <Icons.MessageSquare size={24} />
            {/* Petit point de notification (Optionnel) */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 🔹 FENÊTRE DE CHAT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* EN-TÊTE DU CHAT */}
            <div className="flex justify-between items-center p-5 bg-orange-600 text-white relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-white/10 rotate-12 pointer-events-none">
                <Icons.Headphones size={80} />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Icons.Bot size={20} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-orange-600 rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-widest text-sm">Support Rynek</h3>
                  <p className="text-[10px] text-white/80 font-bold tracking-widest uppercase mt-0.5">En ligne</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="relative z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
              >
                <Icons.ChevronDown size={18} />
              </button>
            </div>

            {/* ZONE DES MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#020617] custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${msg.sender === "user" ? "order-1" : "order-2"}`}>
                    <div 
                      className={`p-3.5 shadow-sm text-sm font-medium leading-relaxed ${
                        msg.sender === "user" 
                          ? "bg-orange-600 text-white rounded-2xl rounded-tr-sm" 
                          : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className={`text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* INDICATEUR DE FRAPPE (Typing...) */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </motion.div>
              )}
              {/* L'ancre pour l'auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* ZONE DE SAISIE */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-slate-800 rounded-full py-3 pl-5 pr-12 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-1 w-10 h-10 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Icons.Send size={16} className="mr-0.5" />
                </button>
              </form>
              <div className="text-center mt-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-center gap-1">
                  <Icons.ShieldCheck size={10} /> Protégé par Rynek Secure
                </span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}