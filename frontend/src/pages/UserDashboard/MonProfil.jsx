import { useState } from "react";
import { useAuth } from "../../contexte/AuthContext";
import { supabase } from "../../utils/supabaseClient"; // 🔄 Import Supabase
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function MonProfil() {
  const { user } = useAuth();
  // Supabase stocke souvent le nom dans user_metadata
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || user?.display_name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // 1️⃣ Mise à jour des métadonnées d'Authentification (pour la session actuelle)
      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });
      if (authError) throw authError;

      // 2️⃣ Mise à jour dans ta table 'users' (pour la base de données)
      const { error: dbError } = await supabase
        .from('users')
        .update({ display_name: displayName }) // Assure-toi que la colonne s'appelle ainsi
        .eq('id', user.id); // ⚠️ Utilise .id et non .uid

      if (dbError) throw dbError;

      setMessage({ type: "success", text: "Profil Rynek mis à jour avec succès !" });
    } catch (error) {
      console.error("Erreur de mise à jour:", error.message);
      setMessage({ type: "error", text: "Erreur lors de la synchronisation du profil." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Mon Profil</h2>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gérez vos informations personnelles</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* Section Avatar / Statut */}
          <div className="flex items-center gap-6 mb-10 p-4 bg-gray-50 rounded-3xl">
            {/* On utilise la couleur primaire dynamique pour l'avatar ! */}
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-theme-text text-2xl font-black shadow-lg transition-colors duration-500">
              {displayName.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest transition-colors duration-500">Statut du compte</p>
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
                className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Votre nom"
              />
            </div>
          </div>

          {/* Champ Email (Lecture seule) */}
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

          {/* Message de Feedback */}
          <AnimatePresence>
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className={`p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest ${
                  message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

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
          Pour modifier votre adresse email ou votre mot de passe, veuillez contacter le support <span className="text-blue-700 font-black">Rynek Force</span>.
        </p>
      </div>
    </div>
  );
}