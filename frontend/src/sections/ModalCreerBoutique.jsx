import { useState } from "react";
import { db, storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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
      if (file) {
        const fileRef = ref(storage, `logos/${wallet.referralCode}_${Date.now()}`);
        await uploadBytes(fileRef, file);
        finalLogoUrl = await getDownloadURL(fileRef);
      }
      await setDoc(doc(db, "boutiques", wallet.referralCode), {
        ...form,
        logo: finalLogoUrl,
        proprietaireUid: wallet.uid,
        proprietaireEmail: wallet.email,
        referralCode: wallet.referralCode,
        status: "active",
        createdAt: serverTimestamp()
      });
      alert("Félicitations ! Votre boutique est maintenant en ligne sur Rynek. 🚀");
      onClose();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-[#0f172a] w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-y-auto max-h-[90vh] custom-scrollbar text-white"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Lancer ma <span className="text-orange-500">Boutique</span></h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Espace Vendeur Rynek Pro</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
            <Icons.X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-8">
          
          {/* 🖼️ ZONE D'UPLOAD LOGO (PRO DESIGN) */}
          <div className="flex flex-col items-center gap-4">
            <label className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group-hover:border-orange-500 transition-all shadow-inner">
                {preview ? (
                  <img src={preview} alt="Aperçu logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Icons.Camera size={32} className="text-slate-500 group-hover:text-orange-500 transition-colors" />
                    <span className="text-[8px] font-black uppercase text-slate-500">Logo Shop</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-orange-500 ml-2 tracking-widest">Identité du Shop</label>
              <input 
                type="text" required
                placeholder="Ex: Imane Boutik"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                onChange={(e) => setForm({...form, nom: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-orange-500 ml-2 tracking-widest">Numéro téléphone whatsApp</label>
              <input 
                type="tel" required
                placeholder="+225 07 18..."
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                onChange={(e) => setForm({...form, telephone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-orange-500 ml-2 tracking-widest">Description Stratégique</label>
            <textarea 
              required rows="3"
              placeholder="Décrivez votre proposition de valeur en quelques mots..."
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-600 resize-none"
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-orange-500 ml-2 tracking-widest">Siège Social</label>
              <input 
                type="text" required
                placeholder="Abidjan, Côte d'Ivoire"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                onChange={(e) => setForm({...form, localisation: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-orange-500 ml-2 tracking-widest">Adresse Physique</label>
              <input 
                type="text" required
                placeholder="Ex: Angré 7ème Tranche"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                onChange={(e) => setForm({...form, adresseGerant: e.target.value})}
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-6 flex flex-col md:flex-row gap-6">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-white/5 text-slate-400 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-white/10 hover:text-white transition-all"
            >
              Plus tard
            </button>
            <button 
              type="submit" 
              disabled={uploading}
              className="flex-[2] bg-orange-600 text-white py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_10px_30px_rgba(234,88,12,0.3)] hover:bg-orange-500 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Déploiement...
                </>
              ) : "Activer ma Boutique"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}