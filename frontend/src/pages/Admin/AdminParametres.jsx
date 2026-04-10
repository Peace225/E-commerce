import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../../utils/supabaseClient"; // 🔄 Import Supabase

export default function AdminParametres() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [commissionRate, setCommissionRate] = useState(10); // Taux par défaut 10%
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // 🔄 Charger les paramètres globaux depuis Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // ⚠️ Assure-toi d'avoir une table 'settings' avec les colonnes : key (texte) et value (jsonb ou text)
        const { data, error } = await supabase
          .from('settings')
          .select('key, value')
          .in('key', ['maintenance_mode', 'commission_rate']);

        if (error) throw error;

        if (data) {
          const maintenanceSetting = data.find(s => s.key === 'maintenance_mode');
          const commissionSetting = data.find(s => s.key === 'commission_rate');

          // Conversion sécurisée des valeurs (Supabase peut renvoyer du texte selon la configuration de ta table)
          if (maintenanceSetting) setIsMaintenance(maintenanceSetting.value === "true" || maintenanceSetting.value === true);
          if (commissionSetting) setCommissionRate(Number(commissionSetting.value));
        }
      } catch (error) {
        console.error("Erreur chargement paramètres:", error);
      } finally {
        setFetchLoading(false);
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

  // 💾 SAUVEGARDE DANS SUPABASE (Upsert)
  const handleSaveGlobal = async () => {
    setLoading(true);
    try {
      // Upsert : Met à jour si la clé existe, sinon l'insère.
      const { error } = await supabase
        .from('settings')
        .upsert([
          { key: 'maintenance_mode', value: String(isMaintenance), updated_at: new Date().toISOString() },
          { key: 'commission_rate', value: String(commissionRate), updated_at: new Date().toISOString() }
        ], { onConflict: 'key' }); // 'key' doit être une contrainte UNIQUE ou PRIMARY KEY dans ta table Supabase

      if (error) throw error;
      
      // 📝 Log de l'action
      await supabase.from('logs').insert([{
        module: "Système",
        action: "Mise à jour des paramètres globaux",
        details: `Maintenance: ${isMaintenance ? 'ON' : 'OFF'} | Commission: ${commissionRate}%`,
        created_at: new Date().toISOString()
      }]);

      alert("✅ Paramètres globaux mis à jour !");
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      alert("❌ Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader2 className="animate-spin text-red-500" size={40} />
      </div>
    );
  }

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
        <section className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
          <Icons.Settings className="absolute -right-10 -bottom-10 text-white/5 group-hover:rotate-45 transition-transform duration-700" size={150} />
          
          <h2 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 relative z-10">
            <Icons.ShieldCheck className="text-red-500" size={16} /> Contrôle de sécurité
          </h2>

          {/* Mode Maintenance */}
          <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl transition-all ${isMaintenance ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-400'}`}>
                <Icons.Construction size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Mode Maintenance</h3>
                <p className="text-[10px] text-slate-500 font-medium">Bloquer l'accès public au site</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMaintenance(!isMaintenance)}
              className={`w-14 h-8 rounded-full relative transition-all ${isMaintenance ? 'bg-red-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isMaintenance ? 'left-7' : 'left-1 shadow-sm shadow-black/50'}`} />
            </button>
          </div>

          {/* Taux de Commission */}
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4 relative z-10">
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
                min="0"
                max="100"
                value={commissionRate} 
                onChange={(e) => setCommissionRate(e.target.value)}
                className="flex-1 bg-[#020617] border border-white/10 rounded-xl p-4 text-white font-black text-lg focus:border-red-500 outline-none transition-colors"
              />
              <span className="text-slate-400 font-black text-xl">%</span>
            </div>
          </div>

          <button 
            onClick={handleSaveGlobal}
            disabled={loading}
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-red-600/20 flex justify-center items-center gap-3 relative z-10 disabled:opacity-50"
          >
            {loading ? <Icons.Loader2 className="animate-spin" size={18} /> : <Icons.Save size={18} />}
            Sauvegarder les réglages
          </button>
        </section>

        {/* 🎨 SECTION 2 : PRÉFÉRENCES INTERFACE */}
        <section className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
          <h2 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <Icons.Palette className="text-blue-500" size={16} /> Préférences Visuelles
          </h2>

          {/* Thème */}
          <div className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 transition-colors rounded-3xl border border-white/5 group cursor-pointer" onClick={toggleDarkMode}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 text-blue-500 rounded-2xl group-hover:rotate-12 transition-transform">
                {darkMode ? <Icons.Moon size={20} /> : <Icons.Sun size={20} />}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Thème Visuel (Admin)</h3>
                <p className="text-[10px] text-slate-500 font-medium">Mode {darkMode ? 'Sombre' : 'Clair'} activé</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-3 py-1 bg-blue-500/10 rounded-lg">Basculer</span>
          </div>

          {/* Sécurité */}
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 text-purple-500 rounded-2xl">
                <Icons.Lock size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Accès Administrateur</h3>
                <p className="text-[10px] text-slate-500 font-medium">Gestion du mot de passe maître</p>
              </div>
            </div>
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              <Icons.Key size={14} /> Demander une réinitialisation
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}