import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { db } from "../../utils/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function AdminParametres() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [commissionRate, setCommissionRate] = useState(10); // Taux par défaut 10%
  const [loading, setLoading] = useState(false);

  // 🔄 Charger les paramètres globaux depuis Firebase
  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "settings", "global");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsMaintenance(data.maintenanceMode);
        setCommissionRate(data.commissionRate);
      }
    };
    fetchSettings();
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleSaveGlobal = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "settings", "global");
      await updateDoc(docRef, {
        maintenanceMode: isMaintenance,
        commissionRate: Number(commissionRate),
        updatedAt: new Date()
      });
      alert("✅ Paramètres globaux mis à jour !");
    } catch (error) {
      alert("❌ Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
          Configuration <span className="text-red-500">Système</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
          Gérer les variables critiques de la plateforme
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* ⚙️ SECTION 1 : CONTRÔLE DE LA PLATEFORME */}
        <section className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
          <h2 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <Icons.ShieldCheck className="text-red-500" size={16} /> Contrôle de sécurité
          </h2>

          {/* Mode Maintenance */}
          <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isMaintenance ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-400'}`}>
                <Icons.Construction size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Mode Maintenance</h3>
                <p className="text-[10px] text-slate-500 font-medium">Bloquer l'accès aux utilisateurs</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMaintenance(!isMaintenance)}
              className={`w-14 h-8 rounded-full relative transition-all ${isMaintenance ? 'bg-red-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isMaintenance ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Taux de Commission */}
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-2xl">
                <Icons.Percent size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Taux de Commission Global</h3>
                <p className="text-[10px] text-slate-500 font-medium">Appliqué par défaut sur chaque vente</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                value={commissionRate} 
                onChange={(e) => setCommissionRate(e.target.value)}
                className="flex-1 bg-[#020617] border border-white/10 rounded-xl p-3 text-white font-black text-lg focus:border-red-500 outline-none"
              />
              <span className="text-slate-400 font-black">%</span>
            </div>
          </div>

          <button 
            onClick={handleSaveGlobal}
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg flex justify-center items-center gap-2"
          >
            {loading ? <Icons.Loader2 className="animate-spin" size={16} /> : <Icons.Save size={16} />}
            Sauvegarder les réglages
          </button>
        </section>

        {/* 🎨 SECTION 2 : PRÉFÉRENCES INTERFACE */}
        <section className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
          <h2 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <Icons.Palette className="text-blue-500" size={16} /> Préférences Visuelles
          </h2>

          {/* Thème */}
          <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group cursor-pointer" onClick={toggleDarkMode}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 text-blue-500 rounded-2xl group-hover:rotate-12 transition-transform">
                {darkMode ? <Icons.Moon size={20} /> : <Icons.Sun size={20} />}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Thème Visuel</h3>
                <p className="text-[10px] text-slate-500 font-medium">Mode {darkMode ? 'Sombre' : 'Clair'} activé</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Changer</span>
          </div>

          {/* Sécurité */}
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 text-purple-500 rounded-2xl">
                <Icons.Lock size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Accès Administrateur</h3>
                <p className="text-[10px] text-slate-500 font-medium">Dernière connexion : Aujourd'hui</p>
              </div>
            </div>
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">
              Changer mon mot de passe
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}