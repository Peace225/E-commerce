import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient"; // 🔄 Import Supabase

export default function AdminMarketing() {
  const [activeTab, setActiveTab] = useState("Bannières");
  const [bannieres, setBannieres] = useState([]);
  const [codesPromo, setCodesPromo] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les modales d'ajout
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Formulaires (Gestion de l'image ajoutée pour les bannières)
  const [bannerForm, setBannerForm] = useState({ titre: "", sousTitre: "", lien: "", imageFile: null });
  const [promoForm, setPromoForm] = useState({ code: "", reduction: "", dateExpiration: "" });
  const [bannerPreview, setBannerPreview] = useState(null);

  // 🔄 SYNCHRONISATION SUPABASE
  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        const { data: bannersData } = await supabase
          .from('marketing_banners')
          .select('*')
          .order('created_at', { ascending: false });
        if (bannersData) setBannieres(bannersData);

        const { data: promosData } = await supabase
          .from('promo_codes')
          .select('*')
          .order('created_at', { ascending: false });
        if (promosData) setCodesPromo(promosData);
      } catch (error) {
        console.error("Erreur chargement marketing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketingData();

    // ⚡ Souscription temps réel
    const channel = supabase.channel('admin-marketing-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketing_banners' }, () => fetchMarketingData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promo_codes' }, () => fetchMarketingData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // 🖼️ ACTION : AJOUTER UNE BANNIÈRE (Avec Upload Storage)
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!bannerForm.imageFile || !bannerForm.titre) {
      alert("Le titre et l'image sont obligatoires.");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Upload de l'image dans le bucket 'banners' (⚠️ À créer dans Supabase)
      const fileExt = bannerForm.imageFile.name.split('.').pop();
      const fileName = `banner_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, bannerForm.imageFile);

      if (uploadError) throw uploadError;

      // 2. Récupération URL publique
      const { data: publicUrlData } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Sauvegarde dans la base de données
      const { error: dbError } = await supabase.from('marketing_banners').insert([{
        titre: bannerForm.titre,
        sous_titre: bannerForm.sousTitre, // Adaptation snake_case
        image_url: imageUrl,
        lien: bannerForm.lien,
        actif: true,
        created_at: new Date().toISOString()
      }]);

      if (dbError) throw dbError;

      setIsBannerModalOpen(false);
      setBannerForm({ titre: "", sousTitre: "", lien: "", imageFile: null });
      setBannerPreview(null);
      alert("✅ Bannière ajoutée au carrousel !");
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de l'ajout de la bannière.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 🎟️ ACTION : AJOUTER UN CODE PROMO
  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (!promoForm.code || !promoForm.reduction) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase.from('promo_codes').insert([{
        code: promoForm.code.toUpperCase(),
        reduction: Number(promoForm.reduction),
        date_expiration: promoForm.dateExpiration || null, // Adaptation snake_case
        actif: true,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      setIsPromoModalOpen(false);
      setPromoForm({ code: "", reduction: "", dateExpiration: "" });
      alert("✅ Code promotionnel activé !");
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de la création du code.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ⚙️ ACTIONS COMMUNES (Activer/Désactiver/Supprimer)
  const toggleStatus = async (collectionName, id, currentStatus) => {
    try {
      await supabase.from(collectionName).update({ actif: !currentStatus }).eq('id', id);
    } catch (error) {
      console.error("Erreur de mise à jour du statut:", error);
    }
  };

  const handleDelete = async (collectionName, id) => {
    if (window.confirm("Supprimer définitivement cet élément ?")) {
      try {
        await supabase.from(collectionName).delete().eq('id', id);
      } catch (error) {
        console.error("Erreur de suppression:", error);
      }
    }
  };

  // Gestion preview image bannière
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerForm({ ...bannerForm, imageFile: file });
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // 📊 KPIs
  const stats = {
    bannersActives: bannieres.filter(b => b.actif).length,
    promosActifs: codesPromo.filter(p => p.actif).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      
      {/* 🔹 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-blue-500/20 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500"><Icons.Image size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bannières en ligne</p>
              <h3 className="text-3xl font-black text-white">{stats.bannersActives} <span className="text-sm text-slate-500">/ {bannieres.length}</span></h3>
            </div>
          </div>
          <button onClick={() => setIsBannerModalOpen(true)} className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-lg shadow-blue-600/20">
            <Icons.Plus size={20} />
          </button>
        </div>

        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500"><Icons.Ticket size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Codes Promo Actifs</p>
              <h3 className="text-3xl font-black text-white">{stats.promosActifs} <span className="text-sm text-slate-500">/ {codesPromo.length}</span></h3>
            </div>
          </div>
          <button onClick={() => setIsPromoModalOpen(true)} className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all shadow-lg shadow-emerald-600/20">
            <Icons.Plus size={20} />
          </button>
        </div>
      </div>

      {/* 🔹 HEADER & ONGLETS */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Pôle <span className="text-red-500">Marketing</span></h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Animation commerciale & Réductions</p>
        </div>
        <div className="flex bg-[#0f172a] p-1.5 rounded-2xl border border-white/5 shadow-inner w-full sm:w-auto">
          <button onClick={() => setActiveTab("Bannières")} className={`flex-1 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "Bannières" ? "bg-red-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>Carrousel Accueil</button>
          <button onClick={() => setActiveTab("Promos")} className={`flex-1 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "Promos" ? "bg-red-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>Codes Promo</button>
        </div>
      </div>

      {/* 🔹 VUE 1 : BANNIÈRES */}
      {activeTab === "Bannières" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {bannieres.length === 0 && <p className="text-slate-500 font-bold p-10 col-span-2 text-center">Aucune bannière configurée.</p>}
          {bannieres.map(b => (
            <div key={b.id} className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden group flex flex-col sm:flex-row">
              <div className="sm:w-1/3 h-48 sm:h-auto bg-slate-800 relative">
                {/* Sécurisation nom image Supabase */}
                <img src={b.image_url || b.imageUrl} alt={b.titre} className={`w-full h-full object-cover transition-all ${!b.actif && 'grayscale opacity-40'}`} />
                {!b.actif && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><span className="bg-red-600 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg">Inactif</span></div>}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-black uppercase tracking-tighter text-lg">{b.titre}</h3>
                  <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">{b.sous_titre || b.sousTitre}</p>
                  {b.lien && <p className="text-blue-500 text-xs font-mono mt-3 truncate">{b.lien}</p>}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => toggleStatus("marketing_banners", b.id, b.actif)} className={`p-3 rounded-xl transition-all ${b.actif ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-600 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-600 hover:text-white'}`} title={b.actif ? "Désactiver" : "Activer"}>
                    {b.actif ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                  </button>
                  <button onClick={() => handleDelete("marketing_banners", b.id)} className="p-3 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all">
                    <Icons.Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* 🔹 VUE 2 : CODES PROMO */}
      {activeTab === "Promos" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Code Promo</th><th className="p-8 text-center">Réduction</th><th className="p-8 text-center">Expiration</th><th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {codesPromo.map(p => {
                const dateExp = p.date_expiration || p.dateExpiration;
                return (
                  <tr key={p.id} className={`hover:bg-white/[0.02] transition-colors ${!p.actif && 'opacity-50'}`}>
                    <td className="p-8"><div className="flex items-center gap-3"><Icons.Ticket className="text-emerald-500" size={18} /><span className="font-mono text-white font-black text-lg tracking-widest">{p.code}</span></div></td>
                    <td className="p-8 text-center"><span className="text-emerald-400 font-black text-xl">-{p.reduction}%</span></td>
                    <td className="p-8 text-center"><span className="text-slate-400 font-bold text-xs">{dateExp ? new Date(dateExp).toLocaleDateString('fr-FR') : "Illimité"}</span></td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => toggleStatus("promo_codes", p.id, p.actif)} className={`p-3 rounded-xl transition-all ${p.actif ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-600 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-600 hover:text-white'}`} title={p.actif ? "Désactiver" : "Activer"}>
                          {p.actif ? <Icons.Pause size={16}/> : <Icons.Play size={16}/>}
                        </button>
                        <button onClick={() => handleDelete("promo_codes", p.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Icons.Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* 🖼️ MODALE : AJOUTER BANNIÈRE */}
      <AnimatePresence>
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0f172a] rounded-[3rem] p-8 md:p-10 w-full max-w-lg shadow-2xl border border-white/10">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-6">Nouvelle Bannière</h2>
              
              <form onSubmit={handleAddBanner} className="space-y-4">
                
                {/* Upload Image local (Storage) */}
                <div className="w-full h-32 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center relative overflow-hidden bg-black/20 group">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-all" />
                  ) : (
                    <div className="text-center text-slate-500">
                      <Icons.UploadCloud className="mx-auto mb-2" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Choisir une image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                </div>

                <input type="text" required value={bannerForm.titre} onChange={e => setBannerForm({...bannerForm, titre: e.target.value})} placeholder="Titre (Ex: Événement Awards MAMADI DIANE)" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all" />
                <input type="text" value={bannerForm.sousTitre} onChange={e => setBannerForm({...bannerForm, sousTitre: e.target.value})} placeholder="Sous-titre (Ex: Réservez vos places dès maintenant)" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all" />
                <input type="url" value={bannerForm.lien} onChange={e => setBannerForm({...bannerForm, lien: e.target.value})} placeholder="Lien de redirection au clic (Optionnel)" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all" />
                
                <div className="flex gap-4 mt-8">
                  <button type="button" disabled={isProcessing} onClick={() => setIsBannerModalOpen(false)} className="flex-1 py-4 bg-white/5 text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Annuler</button>
                  <button type="submit" disabled={isProcessing} className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex justify-center items-center transition-all disabled:opacity-50">
                    {isProcessing ? <Icons.Loader2 className="animate-spin" size={18} /> : "Publier"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🎟️ MODALE : AJOUTER CODE PROMO */}
      <AnimatePresence>
        {isPromoModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0f172a] rounded-[3rem] p-8 md:p-10 w-full max-w-sm shadow-2xl border border-white/10">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-6">Générer Code</h2>
              <form onSubmit={handleAddPromo} className="space-y-4">
                <input type="text" required value={promoForm.code} onChange={e => setPromoForm({...promoForm, code: e.target.value})} placeholder="Ex: AUTOLIFE26 ou DAJISFOOD10" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-lg font-black text-white uppercase focus:border-emerald-500 outline-none transition-all" />
                <div className="relative">
                  <input type="number" required min="1" max="99" value={promoForm.reduction} onChange={e => setPromoForm({...promoForm, reduction: e.target.value})} placeholder="Pourcentage de réduction" className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm font-bold text-white focus:border-emerald-500 outline-none transition-all" />
                  <Icons.Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-2">Date d'expiration (Optionnel)</label>
                  <input type="date" value={promoForm.dateExpiration} onChange={e => setPromoForm({...promoForm, dateExpiration: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-slate-400 focus:border-emerald-500 outline-none transition-all" />
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button type="button" disabled={isProcessing} onClick={() => setIsPromoModalOpen(false)} className="flex-1 py-4 bg-white/5 text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Annuler</button>
                  <button type="submit" disabled={isProcessing} className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex justify-center items-center transition-all disabled:opacity-50">
                    {isProcessing ? <Icons.Loader2 className="animate-spin" size={18} /> : "Créer le code"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}