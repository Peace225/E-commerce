import { useState, useEffect } from "react";
import { useAuth } from "../../contexte/AuthContext";
import { supabase } from "../../utils/supabaseClient"; 
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Loader2, ShieldCheck, Camera, CheckCircle } from "lucide-react";

export default function MonProfil({ userData, onProfileUpdate }) {
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.full_name || "");
      setAvatarUrl(userData.avatar_url || "");
    }
  }, [userData]);

  // 📸 1. LOGIQUE D'UPLOAD PHOTO
  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      setMessage({ type: "", text: "" });

      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // ✅ AJOUT DU .select() POUR VÉRIFIER L'ÉCRITURE RÉELLE
      const { data: updatedData, error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)
        .select();

      if (updateError) throw updateError;
      
      // Si Supabase a bloqué l'écriture (RLS), updatedData sera vide
      if (!updatedData || updatedData.length === 0) {
        throw new Error("Base de données : Écriture bloquée par les politiques de sécurité (RLS).");
      }

      setAvatarUrl(publicUrl);
      if (onProfileUpdate) {
        onProfileUpdate({ avatar_url: publicUrl }); 
      }
      
      setMessage({ type: "success", text: "Photo de profil mise à jour !" });

    } catch (error) {
      setMessage({ type: "error", text: error.message || "Erreur lors de l'envoi." });
      console.error(error);
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    }
  };

  // 📝 2. SAUVEGARDE DES INFOS TEXTUELLES
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // ✅ AJOUT DU .select() ICI AUSSI
      const { data: updatedData, error } = await supabase
        .from('users')
        .update({ full_name: displayName })
        .eq('id', user.id)
        .select();

      if (error) throw error;

      if (!updatedData || updatedData.length === 0) {
        throw new Error("Base de données : Impossible de modifier ce profil (Vérifiez les RLS).");
      }

      if (onProfileUpdate) {
        onProfileUpdate({ full_name: displayName }); 
      }

      setMessage({ type: "success", text: "Modifications enregistrées !" });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Impossible de mettre à jour le nom." });
      console.error(error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Mon Profil</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Identité numérique Rynek</p>
        </div>
        
        <AnimatePresence>
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase max-w-xs text-right ${
                message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}
            >
              {message.type === "success" && <CheckCircle size={14} className="shrink-0" />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <form onSubmit={handleUpdateProfile} className="space-y-8">
          
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-36 h-36 bg-primary/5 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center transition-all duration-500">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-primary/20 uppercase">
                    {displayName ? displayName.charAt(0) : "U"}
                  </span>
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={32} />
                  </div>
                )}
              </div>

              <label className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-4 rounded-2xl cursor-pointer hover:bg-primary transition-all shadow-xl active:scale-90 group-hover:rotate-12">
                <Camera size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
              </label>
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 mt-6 tracking-widest italic opacity-60">
              Cliquez sur l'icône pour changer la photo
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Nom complet d'affichage</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ex: Jean Kouassi"
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 pl-14 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 opacity-60">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Adresse Email (Non modifiable)</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="email" 
                  value={user?.email || ""} 
                  disabled
                  className="w-full bg-gray-100 border-none rounded-2xl p-5 pl-14 text-sm font-bold cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving || uploading}
            className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : "Enregistrer les modifications"}
          </button>
        </form>
      </div>

      <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
        <ShieldCheck className="text-blue-600 shrink-0" size={20} />
        <p className="text-[10px] font-bold text-blue-600/70 leading-relaxed uppercase">
          Rynek sécurise vos données. Seule votre photo et votre nom sont utilisés pour la personnalisation de votre espace et le suivi de vos colis.
        </p>
      </div>
    </div>
  );
}