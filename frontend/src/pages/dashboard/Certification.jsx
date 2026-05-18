import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export default function Certification({ wallet, user }) {
  // États pour les fichiers
  const [idFile, setIdFile] = useState(null);
  const [kbisFile, setKbisFile] = useState(null);
  
  // États de l'UI
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  // Statut actuel de la boutique
  const currentStatus = wallet?.status || "unsubmitted";

  // 📂 GESTION DE LA SÉLECTION DE FICHIERS
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier est trop volumineux (Max 5MB).");
      return;
    }

    setError("");
    if (type === "id") setIdFile(file);
    if (type === "kbis") setKbisFile(file);
  };

  // 🚀 SOUMISSION VERS SUPABASE
  const handleSubmitKYC = async () => {
    if (!idFile || !kbisFile) {
      setError("Veuillez fournir les deux documents requis.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // 1. Upload de la Pièce d'Identité
      const idFilePath = `kyc/${user.id}/id_document_${Date.now()}`;
      const { error: idError } = await supabase.storage
        .from('documents')
        .upload(idFilePath, idFile);
      if (idError) throw idError;

      // 2. Upload du Kbis/RCCM
      const kbisFilePath = `kyc/${user.id}/kbis_document_${Date.now()}`;
      const { error: kbisError } = await supabase.storage
        .from('documents')
        .upload(kbisFilePath, kbisFile);
      if (kbisError) throw kbisError;

      // 3. Mise à jour du statut du vendeur
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          status: 'pending', 
          kyc_submitted_at: new Date().toISOString() 
        })
        .eq('id', user.id);
      if (updateError) throw updateError;

      setUploadSuccess(true);
      setTimeout(() => window.location.reload(), 2000);

    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsUploading(false);
    }
  };

  // 🎨 COMPOSANT ZONE DE DÉPÔT (Optimisé police/paddings en mobile)
  const FileUploadZone = ({ title, description, file, type, icon: Icon }) => (
    <label className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border-2 border-dashed cursor-pointer transition-all group overflow-hidden
      ${file ? "border-emerald-500 bg-emerald-500/5" : "border-slate-200 bg-white hover:border-orange-500 hover:bg-orange-50/50"}`}
    >
      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, type)} disabled={currentStatus === "pending" || currentStatus === "approved"} />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 transition-transform group-hover:scale-110 group-hover:-translate-y-1
          ${file ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-orange-500 group-hover:text-white"}`}
        >
          {file ? <Icons.CheckCircle size={22} className="sm:w-7 sm:h-7" /> : <Icon size={22} className="sm:w-7 sm:h-7" />}
        </div>
        
        <h4 className={`text-xs sm:text-sm font-black uppercase tracking-tight mb-1 ${file ? "text-emerald-700" : "text-slate-900"}`}>
          {file ? "Fichier Sélectionné" : title}
        </h4>
        
        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest max-w-[200px] sm:max-w-none truncate px-2">
          {file ? file.name : description}
        </p>
        
        {!file && (
           <div className="mt-3 px-3 py-1 bg-slate-100 rounded-full text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
             Parcourir
           </div>
        )}
      </div>

      {!file && <Icon className="absolute -right-10 -bottom-10 text-slate-50 opacity-50 group-hover:text-orange-500/5 transition-colors duration-500 hidden sm:block" size={150} />}
    </label>
  );

  // --- RENDU SELON LE STATUT (Adapté mobile) ---
  if (currentStatus === "approved") {
    return (
      <div className="bg-emerald-500 rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white text-emerald-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-xl">
            <Icons.ShieldCheck size={32} className="sm:w-12 sm:h-12" />
          </div>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tighter mb-1 sm:mb-2">Boutique Certifiée</h2>
          <p className="text-emerald-100 text-[11px] sm:text-sm font-medium max-w-md">Votre dossier légal a été validé par nos SuperAdmins. Vous avez un accès complet aux outils de vente Rynek Pro.</p>
        </div>
        <Icons.CheckCircle2 className="absolute -left-10 -bottom-10 text-black/10 hidden sm:block" size={300} />
      </div>
    );
  }

  if (currentStatus === "pending" || uploadSuccess) {
    return (
      <div className="bg-slate-900 rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-orange-500/20 text-orange-500 border border-orange-500/30 rounded-xl sm:rounded-[2rem] flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <Icons.Clock size={28} className="animate-spin-slow sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tighter mb-1 sm:mb-2 italic">Audit en cours...</h2>
          <p className="text-slate-400 text-[11px] sm:text-sm font-medium max-w-md mx-auto">
            Vos documents ont été transmis de manière sécurisée. Notre équipe de conformité examine actuellement votre dossier. Délai estimé : 24 à 48h.
          </p>
        </div>
        <Icons.FileSearch className="absolute -right-10 -top-10 text-white/5 hidden sm:block" size={250} />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-10 px-4 sm:px-0">
      
      {/* 🔹 HEADER SÉCURITÉ */}
      <div className="bg-slate-950 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div className="relative z-10 space-y-2 sm:space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Icons.Lock size={10} className="text-blue-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">Chiffrement AES-256</span>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter">Certification Vendeur</h1>
          <p className="text-slate-400 text-[11px] sm:text-sm font-medium leading-relaxed max-w-lg">
            Pour garantir la sécurité de nos acheteurs et maintenir le standard Premium de Life Shop, nous devons vérifier l'identité légale de votre entreprise.
          </p>
        </div>
        <div className="relative z-10 w-16 h-16 sm:w-24 sm:h-24 shrink-0 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-md">
          <Icons.ShieldAlert size={28} className="text-orange-500 sm:w-10 sm:h-10" />
        </div>
        <Icons.Server className="absolute -left-10 -bottom-10 text-white/5 hidden sm:block" size={200} />
      </div>

      {/* 🔹 MESSAGE D'ERREUR */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }} 
            className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 border border-red-100"
          >
            <Icons.AlertTriangle size={16} className="shrink-0" />
            <p className="text-[10px] sm:text-xs font-bold">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 ZONES D'UPLOAD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <FileUploadZone 
          title="Pièce d'Identité" 
          description="CNI, Passeport ou Permis" 
          file={idFile} 
          type="id" 
          icon={Icons.UserSquare2} 
        />
        <FileUploadZone 
          title="Registre de Commerce" 
          description="Kbis, RCCM ou DFE (< 3 mois)" 
          file={kbisFile} 
          type="kbis" 
          icon={Icons.Building2} 
        />
      </div>

      {/* 🔹 BOUTON DE SOUMISSION */}
      <div className="flex justify-center sm:justify-end pt-4 sm:pt-6 border-t border-slate-200">
        <button 
          onClick={handleSubmitKYC}
          disabled={!idFile || !kbisFile || isUploading}
          className={`w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-[11px] tracking-wider sm:tracking-widest flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-xl
            ${(!idFile || !kbisFile) 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
              : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95 hover:shadow-orange-500/20"}`}
        >
          {isUploading ? (
            <><Icons.Loader2 size={14} className="animate-spin sm:w-4 sm:h-4" /> Envoi...</>
          ) : (
            <><Icons.Send size={14} className="sm:w-4 sm:h-4" /> Soumettre le dossier</>
          )}
        </button>
      </div>

      <p className="text-center text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest mt-2 sm:mt-4 flex items-center justify-center gap-1.5">
        <Icons.Info size={11} /> Documents strictement confidentiels et chiffrés.
      </p>

    </div>
  );
}