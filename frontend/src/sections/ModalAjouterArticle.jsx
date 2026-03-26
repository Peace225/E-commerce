import { useState } from "react";
import { supabase } from "../utils/supabaseClient"; // 🔄 Import Supabase
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ModalAjouterArticle({ isOpen, onClose, wallet, refreshData }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prix: "",
    description: "",
    isAffiliationActive: false,
    isCommissionActive: false,
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Veuillez uploader une image pour le produit.");
    
    setIsUploading(true);

    try {
      // 1️⃣ Upload de l'image sur Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${wallet.referralCode}_${Date.now()}.${fileExt}`;
      const filePath = `produits/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('produits') // ⚠️ Assure-toi que ce bucket existe
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Récupération de l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('produits')
        .getPublicUrl(filePath);

      // 2️⃣ Enregistrement dans la table 'produits' (PostgreSQL)
      const { error: dbError } = await supabase
        .from('produits')
        .insert([{
          ...form,
          prix: Number(form.prix),
          image: publicUrl,
          boutique_id: wallet.referralCode,
          vendeur_email: wallet.email,
          vendeur_id: wallet.id, // Supabase utilise 'id'
          // created_at est géré par défaut par la DB
        }]);

      if (dbError) throw dbError;

      // Succès !
      if (refreshData) refreshData();
      onClose();
      // Reset du formulaire
      setForm({ nom: "", prix: "", description: "", isAffiliationActive: false, isCommissionActive: false });
      setPreview(null);
      setFile(null);
      alert("Article publié avec succès ! 🚀");

    } catch (error) {
      console.error("Erreur ajout article:", error.message);
      alert("Erreur lors de la publication : " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0f172a] w-full max-w-xl rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/10 overflow-y-auto max-h-[90vh] custom-scrollbar text-white"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Nouvel <span className="text-orange-500">Article</span></h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><Icons.X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 🖼️ UPLOAD IMAGE PRODUIT */}
          <div className="flex flex-col items-center gap-4">
            <label className="relative cursor-pointer group w-full h-44 rounded-[2rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden hover:border-orange-500 transition-all">
              {preview ? (
                <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Icons.ImagePlus size={40} className="mx-auto text-slate-600 mb-2" />
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Cliquer pour uploader la photo</span>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          {/* NOM ET PRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="text" placeholder="Nom de l'article" required
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
              value={form.nom}
              onChange={(e) => setForm({...form, nom: e.target.value})}
            />
            <input 
              type="number" placeholder="Prix (FCFA)" required
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
              value={form.prix}
              onChange={(e) => setForm({...form, prix: e.target.value})}
            />
          </div>

          <textarea 
            placeholder="Description détaillée de l'article..."
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 transition-all placeholder:text-slate-600 resize-none"
            rows="3"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          />

          {/* 🔗 OPTIONS DE CROCHET */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${form.isAffiliationActive ? 'bg-orange-500/10 border-orange-500' : 'bg-white/5 border-white/10'}`}>
              <input 
                type="checkbox" className="hidden" 
                checked={form.isAffiliationActive}
                onChange={(e) => setForm({...form, isAffiliationActive: e.target.checked})}
              />
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 ${form.isAffiliationActive ? 'bg-orange-500 border-orange-500' : 'border-slate-600'}`}>
                {form.isAffiliationActive && <Icons.Check size={14} className="text-white" />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Activer l'Affiliation</span>
            </label>

            <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${form.isCommissionActive ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-white/10'}`}>
              <input 
                type="checkbox" className="hidden"
                checked={form.isCommissionActive}
                onChange={(e) => setForm({...form, isCommissionActive: e.target.checked})}
              />
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 ${form.isCommissionActive ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                {form.isCommissionActive && <Icons.Check size={14} className="text-white" />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Calcul Commissions</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg transition-all disabled:opacity-50"
          >
            {isUploading ? "Publication..." : "Publier l'article"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}