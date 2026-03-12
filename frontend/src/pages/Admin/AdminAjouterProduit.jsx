import { useState, useEffect } from "react";
import { db, storage } from "../../utils/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../contexte/AuthContext";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

// 📝 On ajoute la prop "productToEdit" pour savoir si on crée ou on modifie
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
        nom: productToEdit.nom,
        description: productToEdit.description,
        prix: productToEdit.prix,
        categorie: productToEdit.categorie || "Téléphones",
        image: null, // On ne stocke pas le fichier ici, juste l'URL pour l'aperçu
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

      // Si une nouvelle image est sélectionnée, on l'upload
      if (formData.image) {
        const imageRef = ref(storage, `produits/${Date.now()}_${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const productData = {
        nom: formData.nom,
        description: formData.description,
        prix: Number(formData.prix),
        categorie: formData.categorie,
        image: imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (isEditing) {
        // ✏️ UPDATE : Mise à jour du produit existant
        const docRef = doc(db, "produits", productToEdit.id);
        await updateDoc(docRef, productData);
        setSuccess("✅ Produit mis à jour !");
      } else {
        // ➕ ADD : Création d'un nouveau produit
        await addDoc(collection(db, "produits"), {
          ...productData,
          createdAt: serverTimestamp(),
          uid: user?.uid || null,
          vendeur: user?.displayName || "Admin",
        });
        setSuccess("✅ Produit ajouté avec succès !");
      }

      setTimeout(() => {
        if (onCreated) onCreated();
        onClose();
      }, 1500);
    } catch (error) {
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
        className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        
        <div className="w-full md:w-5/12 bg-slate-50 border-r border-slate-100 p-8 flex flex-col items-center justify-center relative">
          <p className="absolute top-8 left-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Aperçu Visuel</p>
          <div className="w-full aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-white shadow-inner">
            {preview ? (
              <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
            ) : (
              <Icons.ImagePlus size={48} className="text-slate-200" />
            )}
          </div>
          <label className="mt-6 cursor-pointer bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all">
            {isEditing ? "Changer la photo" : "Ajouter une photo"}
            <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
        </div>

        <div className="flex-1 p-8 md:p-10 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                {isEditing ? "Modifier" : "Nouveau"} Produit
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isEditing ? "Mise à jour des infos" : "Mise en ligne catalogue"}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
              <Icons.X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom du produit"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold focus:border-orange-500 outline-none"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  name="prix"
                  type="number"
                  value={formData.prix}
                  onChange={handleChange}
                  placeholder="Prix"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-black focus:border-orange-500 outline-none"
                  required
                />
              </div>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-xs font-bold text-slate-600 outline-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-medium focus:border-orange-500 outline-none resize-none"
              required
            />

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-[#0f172a] hover:bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-3"
            >
              {uploading ? (
                <Icons.Loader2 className="animate-spin" size={18} />
              ) : (
                <Icons.Save size={18} />
              )}
              {isEditing ? "Enregistrer les modifications" : "Publier le produit"}
            </button>
          </form>
          
          {success && <p className="mt-4 text-center text-[10px] font-black uppercase text-emerald-500 tracking-widest">{success}</p>}
        </div>
      </motion.div>
    </div>
  );
}