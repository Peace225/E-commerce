import { useState } from "react";
import { db, storage } from "../utils/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ModalAjouterArticle({ isOpen, onClose, wallet, refreshData }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prix: "",
    description: "",
    isAffiliationActive: false, // Crochet Affiliation
    isCommissionActive: false,  // Crochet Commission
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
      // 1. Upload de l'image sur Firebase Storage
      const storageRef = ref(storage, `produits/${wallet.referralCode}_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snap) => {
          setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        },
        (error) => { console.error(error); setIsUploading(false); },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // 2. Enregistrement dans Firestore
          await addDoc(collection(db, "produits"), {
            ...form,
            prix: Number(form.prix),
            image: downloadURL,
            boutiqueId: wallet.referralCode,
            vendeurEmail: wallet.email,
            createdAt: serverTimestamp()
          });

          refreshData();
          setIsUploading(false);
          setUploadProgress(0);
          onClose();
          setForm({ nom: "", prix: "", description: "", isAffiliationActive: false, isCommissionActive: false });
          setPreview(null);
        }
      );
    } catch (error) {
      console.error("Erreur ajout article:", error);
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

            {isUploading && (
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-orange-500" 
                  initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* NOM ET PRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="text" placeholder="Nom de l'article" required
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
              onChange={(e) => setForm({...form, nom: e.target.value})}
            />
            <input 
              type="number" placeholder="Prix (FCFA)" required
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
              onChange={(e) => setForm({...form, prix: e.target.value})}
            />
          </div>

          <textarea 
            placeholder="Description détaillée de l'article..."
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 transition-all placeholder:text-slate-600 resize-none"
            rows="3"
            onChange={(e) => setForm({...form, description: e.target.value})}
          />

          {/* 🔗 OPTIONS DE CROCHET (AFFILIATION / COMMISSION) */}
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
            {isUploading ? `Envoi en cours... ${uploadProgress}%` : "Publier l'article"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}