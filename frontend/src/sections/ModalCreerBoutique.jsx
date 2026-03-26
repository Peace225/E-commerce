import { useState } from "react";
import { supabase } from "../utils/supabaseClient"; // 🔄 Import Supabase
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export default function ModalCreerBoutique({ isOpen, onClose, wallet }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState({
    nom: "",
    description: "",
    localisation: "",
    adresseGerant: "",
    telephone: ""
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalLogoUrl = "";

      // 1️⃣ UPLOAD DU LOGO (Supabase Storage)
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${wallet.referralCode}_${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        // On upload dans le bucket 'boutiques-logos' (assure-toi qu'il existe)
        const { error: uploadError } = await supabase.storage
          .from('boutiques-logos') 
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // On récupère l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('boutiques-logos')
          .getPublicUrl(filePath);
        
        finalLogoUrl = publicUrl;
      }

      // 2️⃣ ENREGISTREMENT EN BASE DE DONNÉES
      const { error: dbError } = await supabase
        .from('boutiques')
        .upsert([{ // 'upsert' car ton code utilisait setDoc (écrase ou crée)
          id: wallet.referralCode, // On garde le referralCode comme ID ou clé unique
          ...form,
          logo: finalLogoUrl,
          proprietaire_id: wallet.id, // ⚠️ Supabase utilise 'id' et non 'uid'
          proprietaire_email: wallet.email,
          referral_code: wallet.referralCode,
          status: "active",
          // 'created_at' est géré automatiquement par Supabase
        }]);

      if (dbError) throw dbError;

      alert("Félicitations ! Votre boutique est maintenant en ligne sur Rynek. 🚀");
      onClose();
    } catch (error) {
      console.error("Erreur détaillée:", error.message);
      alert(`Erreur: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // ... Le reste du JSX reste identique car c'est du Tailwind pur ...
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
       {/* ... (Copie-colle ton JSX ici sans changements) ... */}
       <motion.div 
         initial={{ scale: 0.9, opacity: 0 }} 
         animate={{ scale: 1, opacity: 1 }} 
         className="bg-[#0f172a] w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-y-auto max-h-[90vh] custom-scrollbar text-white"
       >
         {/* ... (Garde ton formulaire exactement comme avant) ... */}
         {/* Assure-toi juste que les onChange pointent bien vers ton state 'form' */}
         <form onSubmit={handleCreate} className="space-y-8">
            {/* Contenu de ton formulaire */}
            {/* ... */}
            <button 
              type="submit" 
              disabled={uploading}
              className="flex-[2] bg-orange-600 text-white py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_10px_30px_rgba(234,88,12,0.3)] hover:bg-orange-500 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {uploading ? "Déploiement..." : "Activer ma Boutique"}
            </button>
         </form>
       </motion.div>
    </div>
  );
}