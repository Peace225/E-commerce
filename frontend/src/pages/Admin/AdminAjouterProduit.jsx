import { useState, useEffect } from "react";
import { useAuth } from "../../contexte/AuthContext";
import { supabase } from "../../utils/supabaseClient"; // 🔄 Bye bye Firebase !
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export default function AdminAjouterProduit({ onClose, onCreated, productToEdit = null }) {
  const { user } = useAuth();
  const isEditing = !!productToEdit;

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "Téléphones",
    image: null,
  });
  
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);

  // 🔄 Charger les données si on est en mode édition
  useEffect(() => {
    if (isEditing) {
      setFormData({
        nom: productToEdit.nom || "",
        description: productToEdit.description || "",
        prix: productToEdit.prix || "",
        categorie: productToEdit.categorie || "Téléphones",
        image: null, 
      });
      setPreview(productToEdit.image);
    }
  }, [productToEdit, isEditing]);

  const categories = [
    "Téléphones", "TV & HIGH TECH", "Informatique", 
    "Maison & Bureau", "Électroménager", "Mode", 
    "Beauté & Santé", "Jeux vidéos", "Bricolage"
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setSuccess(null);

    try {
      let imageUrl = isEditing ? productToEdit.image : "";

      // 🖼️ GESTION DE L'IMAGE AVEC SUPABASE STORAGE
      if (formData.image) {
        // Nettoyage du nom de fichier pour éviter les bugs
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // ⚠️ Assure-toi d'avoir créé un bucket nommé "produits" dans Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('produits') 
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        // Récupération de l'URL publique
        const { data: publicUrlData } = supabase.storage
          .from('produits')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      // 📦 PRÉPARATION DES DONNÉES
      const productData = {
        nom: formData.nom,
        description: formData.description,
        prix: Number(formData.prix),
        categorie: formData.categorie,
        image: imageUrl,
        updated_at: new Date().toISOString(), // Standardisation date Supabase
      };

      if (isEditing) {
        // ✏️ UPDATE : Mise à jour du produit existant
        const { error: updateError } = await supabase
          .from('produits')
          .update(productData)
          .eq('id', productToEdit.id);

        if (updateError) throw updateError;
        setSuccess("✅ Produit mis à jour !");

      } else {
        // ➕ ADD : Création d'un nouveau produit
        const { error: insertError } = await supabase
          .from('produits')
          .insert([{
            ...productData,
            created_at: new Date().toISOString(),
            uid: user?.id || null, // Supabase utilise 'id', Firebase utilisait 'uid'
            vendeur: user?.user_metadata?.full_name || "Admin",
          }]);

        if (insertError) throw insertError;
        setSuccess("✅ Produit ajouté avec succès !");
      }

      setTimeout(() => {
        if (onCreated) onCreated();
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Erreur d'opération produit:", error);
      setSuccess("❌ Erreur lors de l'opération");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        
        {/* COLONNE GAUCHE : IMAGE (Adapté au thème sombre Admin) */}
        <div className="w-full md:w-5/12 bg-white/5 border-r border-white/5 p-8 flex flex-col items-center justify-center relative">
          <p className="absolute top-8 left-8 text-[10px] font-black uppercase text-slate-500 tracking-widest">Aperçu Visuel</p>
          <div className="w-full aspect-square rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden bg-black/20 shadow-inner">
            {preview ? (
              <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
            ) : (
              <Icons.ImagePlus size={48} className="text-slate-600" />
            )}
          </div>
          <label className="mt-6 cursor-pointer bg-red-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 shadow-lg shadow-red-600/20 transition-all">
            {isEditing ? "Changer la photo" : "Ajouter une photo"}
            <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="flex-1 p-8 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">
                {isEditing ? "Modifier" : "Nouveau"} Produit
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {isEditing ? "Mise à jour du catalogue" : "Mise en ligne catalogue"}
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
              <Icons.X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom du produit"
              className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:border-red-500 outline-none transition-colors"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  name="prix"
                  type="number"
                  value={formData.prix}
                  onChange={handleChange}
                  placeholder="Prix (F CFA)"
                  className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:border-red-500 outline-none transition-colors"
                  required
                />
              </div>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-xs font-bold text-slate-300 focus:border-red-500 outline-none transition-colors"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description détaillée..."
              className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-medium text-white focus:border-red-500 outline-none resize-none transition-colors custom-scrollbar"
              required
            />

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-white text-slate-900 hover:bg-red-600 hover:text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-3 disabled:opacity-50"
            >
              {uploading ? (
                <Icons.Loader2 className="animate-spin" size={18} />
              ) : (
                <Icons.Save size={18} />
              )}
              {isEditing ? "Enregistrer les modifications" : "Publier le produit"}
            </button>
          </form>
          
          {success && (
            <p className={`mt-4 text-center text-[10px] font-black uppercase tracking-widest ${success.includes('❌') ? 'text-red-500' : 'text-emerald-500'}`}>
              {success}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}