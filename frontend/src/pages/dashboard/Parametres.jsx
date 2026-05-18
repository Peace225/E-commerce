import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export default function Parametres({ wallet, user, onUpdate }) {
  const [activeTab, setActiveTab] = useState("profil");

  // Données de base
  const [shopName, setShopName] = useState(wallet?.nom_boutique || "");
  const [managerName, setManagerName] = useState(wallet?.full_name || "");
  const email = user?.email || "contact@boutique.com";

  // États pour les images
  const [shopLogoUrl, setShopLogoUrl] = useState(wallet?.logo_url || null);
  const [managerAvatarUrl, setManagerAvatarUrl] = useState(user?.user_metadata?.avatar_url || wallet?.avatar_url || null);
  
  // États UI
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // 📸 GESTION DE L'UPLOAD DES IMAGES
  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: "L'image est trop grande (Max 2MB).", type: "error" });
      return;
    }

    setIsSaving(true);
    setMessage({ text: "Téléchargement de l'image...", type: "info" });

    try {
      const filePath = `${user.id}/${type}_${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (type === "logo") setShopLogoUrl(publicUrl);
      if (type === "avatar") setManagerAvatarUrl(publicUrl);

      setMessage({ text: "Image téléchargée avec succès !", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);

    } catch (error) {
      console.error(error);
      setMessage({ text: "Erreur lors du téléchargement.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // 💾 SAUVEGARDE DU PROFIL COMPLET
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const updates = {
        nom_boutique: shopName,
        full_name: managerName,
        logo_url: shopLogoUrl,
        avatar_url: managerAvatarUrl,
      };

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await supabase.auth.updateUser({
        data: { 
          full_name: managerName,
          avatar_url: managerAvatarUrl 
        }
      });

      onUpdate(updates);
      setMessage({ text: "Profil mis à jour avec succès !", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);

    } catch (error) {
      console.error(error);
      setMessage({ text: "Erreur lors de la sauvegarde.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-10 px-4 sm:px-0">
      
      {/* HEADER DE LA PAGE */}
      <div className="bg-slate-950 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 space-y-1 sm:space-y-2">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter">Configuration Pro</h1>
          <p className="text-slate-400 text-[10px] sm:text-sm font-medium">Gérez l'identité de votre entreprise et du gérant.</p>
        </div>
        <Icons.Settings className="absolute -right-10 -bottom-10 text-white/5 rotate-45 hidden sm:block" size={200} />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        
        {/* NAVIGATION DES PARAMÈTRES (TABS) */}
        <div className="w-full lg:w-64 shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
          {[
            { id: "profil", label: "Profil & Identité", icon: <Icons.Building2 size={16} /> },
            { id: "securite", label: "Sécurité & Accès", icon: <Icons.Lock size={16} /> },
            { id: "notifications", label: "Alertes & Notifs", icon: <Icons.Bell size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMessage({ text: "", type: "" }); }}
              className={`flex items-center gap-2 px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black uppercase text-[8px] sm:text-[10px] tracking-wider sm:tracking-widest transition-all whitespace-nowrap shrink-0 lg:w-full
                ${activeTab === tab.id 
                  ? "bg-white text-orange-500 shadow-md lg:shadow-xl border border-slate-100" 
                  : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENU DES PARAMÈTRES */}
        <div className="flex-1 bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-slate-100 overflow-hidden">
          
          {/* BANNIÈRE DE MESSAGE (SUCCÈS/ERREUR) */}
          <AnimatePresence>
            {message.text && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-3 sm:p-4 mb-5 sm:mb-6 rounded-xl sm:rounded-2xl flex items-center gap-2.5 text-[10px] sm:text-xs font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {message.type === 'error' ? <Icons.AlertCircle size={14} /> : message.type === 'success' ? <Icons.CheckCircle2 size={14} /> : <Icons.Loader2 size={14} className="animate-spin" />}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            
            {/* TAB : PROFIL & IDENTITÉ */}
            {activeTab === "profil" && (
              <motion.div key="profil" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 sm:space-y-8">
                
                {/* ZONE DES PHOTOS DE PROFIL */}
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pb-6 sm:pb-8 border-b border-slate-100">
                  
                  {/* Logo Boutique */}
                  <div className="flex items-center gap-4">
                    <label className="relative w-16 h-16 sm:w-24 sm:h-24 bg-slate-50 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center border-2 border-dashed border-slate-200 hover:border-orange-500 transition-colors cursor-pointer group overflow-hidden shadow-sm shrink-0">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} disabled={isSaving} />
                      {shopLogoUrl ? (
                        <img src={shopLogoUrl} alt="Logo" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                      ) : (
                        <Icons.Store size={22} className="text-slate-300 group-hover:text-orange-500" />
                      )}
                      {shopLogoUrl && <Icons.Camera size={20} className="absolute text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </label>
                    <div>
                      <h3 className="font-black text-slate-900 uppercase tracking-tight text-xs sm:text-sm">Boutique</h3>
                      <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider sm:tracking-widest mt-0.5 sm:mt-1">Logo Pro (500x500px)</p>
                    </div>
                  </div>

                  {/* Photo Gérant */}
                  <div className="flex items-center gap-4 pl-0 sm:pl-8 sm:border-l border-slate-100">
                    <label className="relative w-14 h-14 sm:w-20 sm:h-20 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200 hover:border-orange-500 transition-colors cursor-pointer group overflow-hidden shadow-sm shrink-0">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} disabled={isSaving} />
                      {managerAvatarUrl ? (
                        <img src={managerAvatarUrl} alt="Gérant" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                      ) : (
                        <Icons.User size={20} className="text-slate-300 group-hover:text-orange-500" />
                      )}
                      {managerAvatarUrl && <Icons.Camera size={16} className="absolute text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </label>
                    <div>
                      <h3 className="font-black text-slate-900 uppercase tracking-tight text-xs sm:text-sm">Gérant</h3>
                      <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider sm:tracking-widest mt-0.5 sm:mt-1">Photo d'identité</p>
                    </div>
                  </div>

                </div>

                {/* FORMULAIRE TEXTE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider sm:tracking-widest">Nom de la Boutique</label>
                    <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-slate-900" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider sm:tracking-widest">Nom et Prénom du Gérant</label>
                    <input type="text" value={managerName} onChange={(e) => setManagerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-slate-900" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                    <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider sm:tracking-widest">Email Professionnel</label>
                    <div className="relative">
                       <input type="email" defaultValue={email} disabled className="w-full bg-slate-100 border border-slate-200 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed font-bold" />
                       <Icons.Lock size={14} className="absolute right-4 top-3.5 sm:top-4 text-slate-300" />
                    </div>
                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1"><Icons.ShieldAlert size={12} className="text-orange-500 shrink-0"/> Pour modifier l'email lié au compte, contactez l'administration.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-orange-500 text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-black uppercase text-[8px] sm:text-[10px] tracking-wider sm:tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Icons.Loader2 size={14} className="animate-spin" /> : <Icons.Save size={14} />}
                    {isSaving ? "Enregistrement..." : "Enregistrer le profil"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB : SÉCURITÉ */}
            {activeTab === "securite" && (
              <motion.div key="securite" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tighter mb-4 sm:mb-6 flex items-center gap-2">
                  <Icons.ShieldCheck className="text-emerald-500" size={18} /> Sécurité du compte
                </h3>
                
                <form onSubmit={(e) => { e.preventDefault(); }}>
                  <div className="space-y-4 sm:space-y-5">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider sm:tracking-widest">Mot de passe actuel</label>
                      <input type="password" autoComplete="current-password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold" />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider sm:tracking-widest">Nouveau mot de passe</label>
                      <input type="password" autoComplete="new-password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-5 border-t border-slate-100 mt-5 sm:mt-6">
                    <button type="submit" className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-black uppercase text-[8px] sm:text-[10px] tracking-wider sm:tracking-widest hover:bg-slate-800 transition-all active:scale-95">
                      Mettre à jour le mot de passe
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* TAB : NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tighter mb-4 sm:mb-6 flex items-center gap-2">
                  <Icons.BellRing className="text-blue-500" size={18} /> Préférences d'alertes
                </h3>
                
                <div className="space-y-3">
                  {[
                    { title: "Nouvelle Commande", desc: "Être alerté immédiatement à chaque vente (Email & Push)", active: true },
                    { title: "Rapport Hebdomadaire", desc: "Recevoir le bilan financier chaque lundi matin", active: true },
                    { title: "Messages Clients", desc: "Notifications pour les messages du chat en direct", active: false },
                    { title: "Alertes SuperAdmin", desc: "Messages urgents de conformité et plateforme", active: true, locked: true },
                  ].map((notif, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 sm:p-5 border rounded-xl sm:rounded-2xl transition-colors ${notif.active ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100 bg-white'}`}>
                      <div className="pr-4">
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-tight">{notif.title}</h4>
                        <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">{notif.desc}</p>
                      </div>
                      <div className={`w-10 h-5.5 sm:w-12 sm:h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer shrink-0 ${notif.active ? "bg-orange-500 justify-end" : "bg-slate-300 justify-start"} ${notif.locked && "opacity-50 cursor-not-allowed"}`}>
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}