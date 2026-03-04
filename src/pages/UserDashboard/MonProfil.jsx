import { useState } from "react";
import { useAuth } from "../../contexte/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function MonProfil() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Mise à jour du profil dans Firebase Auth
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
      setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Erreur lors de la mise à jour." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Mon Profil</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gérez vos informations personnelles</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* Section Avatar / Statut */}
          <div className="flex items-center gap-6 mb-10 p-4 bg-gray-50 rounded-3xl">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-600/20">
              {displayName.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Statut du compte</p>
              <p className="text-sm font-black uppercase text-gray-900">Client Certifié Rynek</p>
            </div>
          </div>

          {/* Champ Nom */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nom complet d'affichage</label>
            <div className="relative">
              <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="Votre nom"
              />
            </div>
          </div>

          {/* Champ Email (Lecture seule pour sécurité) */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Adresse Email (Non modifiable)</label>
            <div className="relative opacity-60">
              <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                value={user?.email} 
                disabled 
                className="w-full bg-gray-100 border-none rounded-2xl p-4 pl-12 text-sm font-bold cursor-not-allowed"
              />
            </div>
          </div>

          {/* Feedback Message */}
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest ${
                message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Bouton Sauvegarder */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            {loading ? <Icons.Loader2 className="animate-spin" size={18} /> : "Enregistrer les modifications"}
          </button>
        </form>
      </motion.div>

      {/* Info de sécurité */}
      <div className="mt-8 p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
        <Icons.ShieldCheck className="text-blue-600 shrink-0" size={20} />
        <p className="text-[10px] font-bold text-blue-600/70 leading-relaxed uppercase">
          Pour modifier votre adresse email ou votre mot de passe, veuillez contacter le support <span className="text-blue-700 font-black">Rynek Force</span> pour des raisons de sécurité liées à vos transactions.
        </p>
      </div>
    </div>
  );
}