import { useState } from "react";
import { useAuth } from "../contexte/AuthContext";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export default function Parametres({ wallet, user }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || wallet?.displayName || "",
    whatsapp: wallet?.whatsapp || "",
    ville: wallet?.ville || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        whatsapp: formData.whatsapp,
        ville: formData.ville,
        updatedAt: new Date(),
      });
      alert("✅ Profil mis à jour avec succès !");
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      
      {/* 🔹 HEADER PROFIL */}
      <header className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-orange-500 rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-orange-500/20">
          {formData.displayName?.charAt(0).toUpperCase() || "A"}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            {formData.displayName || "Ambassadeur"}
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Membre {wallet?.level || "Bronze"} • {user?.email}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 📝 FORMULAIRE DE MISE À JOUR */}
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
            <Icons.UserPen size={20} className="text-orange-500" /> Informations Personnelles
          </h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Nom complet</label>
                <input 
                  name="displayName" value={formData.displayName} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all"
                  placeholder="Ex: Kevin Gael"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Numéro WhatsApp</label>
                <input 
                  name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all"
                  placeholder="Ex: +225 07000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Ville de résidence</label>
              <input 
                name="ville" value={formData.ville} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all"
                placeholder="Ex: Abidjan, Côte d'Ivoire"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-[#0f172a] hover:bg-orange-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl flex justify-center items-center gap-3"
            >
              {loading ? <Icons.Loader2 className="animate-spin" size={18} /> : <Icons.Save size={18} />}
              Sauvegarder les modifications
            </button>
          </form>
        </div>

        {/* 📊 RÉCAPITULATIF STATS */}
        <aside className="space-y-6">
          <div className="bg-[#0f172a] p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <Icons.Zap size={100} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
            <p className="text-orange-500 text-[9px] font-black uppercase tracking-widest mb-1">Affiliation</p>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Votre Réseau</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Filleuls directs</span>
                <span className="font-black text-xl">{wallet?.referralCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Code Promo</span>
                <span className="font-mono text-orange-500 font-black tracking-widest">{wallet?.referralCode}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center">
            <Icons.ShieldCheck size={32} className="mx-auto text-emerald-500 mb-4" />
            <h4 className="font-black text-xs uppercase tracking-tight text-slate-900">Compte Vérifié</h4>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Membre de confiance Rynek</p>
          </div>
        </aside>

      </div>
    </div>
  );
}