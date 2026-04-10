import { useEffect, useState, useMemo } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient";

// Sections
import ModalAjouterArticle from "../../sections/ModalAjouterArticle";
import ModalCreerBoutique from "../../sections/ModalCreerBoutique";
import MesArticles from "../../sections/MesArticles";
import CommandesBoutique from "../../sections/CommandesBoutique";
import ThemeBoutique from "../../sections/ThemeBoutique";
import StatsBoutique from "../../sections/StatsBoutique";

export default function MaBoutique({ wallet, user }) {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("mes-articles");
  const [searchTerm, setSearchTerm] = useState("");

  // États UI (Modales)
  const [openAdd, setOpenAdd] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // 🎨 Notification Système Unique
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const notify = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  // 🔄 1. CHARGEMENT INITIAL & TEMPS RÉEL
  const fetchInitialData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .eq('vendeur_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProduits(data || []);
    } catch (err) {
      notify(err.message.includes("localisation") 
        ? "Erreur : Colonne 'localisation' manquante dans la DB." 
        : "Erreur de connexion aux produits.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // Ecoute en temps réel des changements sur les produits du vendeur
    const channel = supabase
      .channel(`db-changes-${user?.id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'produits', filter: `vendeur_id=eq.${user?.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') setProduits(prev => [payload.new, ...prev]);
          if (payload.eventType === 'DELETE') setProduits(prev => prev.filter(p => p.id !== payload.old.id));
          if (payload.eventType === 'UPDATE') setProduits(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  // 🔍 2. LOGIQUE DE RECHERCHE
  const filteredProduits = useMemo(() => {
    return produits.filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [produits, searchTerm]);

  // 🗑️ 3. ACTION : SUPPRIMER
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet article définitivement ?")) return;
    try {
      const { error } = await supabase.from('produits').delete().eq('id', id).eq('vendeur_id', user.id);
      if (error) throw error;
      notify("Article retiré du stock.");
    } catch (err) {
      notify("Erreur lors de la suppression.", "error");
    }
  };

  // 🔘 Configuration des Boutons
  const menuButtons = [
    { id: "ajouter", label: "Nouvel Article", icon: <Icons.PlusCircle size={20} />, color: "bg-orange-600", isModal: true },
    { id: "mes-articles", label: "Mon Stock", icon: <Icons.Package size={20} />, color: "bg-slate-700", isModal: false },
    { id: "commandes", label: "Commandes", icon: <Icons.ShoppingBag size={20} />, color: "bg-emerald-600", isModal: false },
    { id: "stats", label: "Analyses", icon: <Icons.BarChart3 size={20} />, color: "bg-red-600", isModal: false },
    { id: "themes", label: "Personnalisation", icon: <Icons.Palette size={20} />, color: "bg-purple-600", isModal: false },
    { id: "creer", label: "Identité Boutique", icon: <Icons.Settings size={20} />, color: "bg-blue-600", isModal: true },
  ];

  return (
    <div className="space-y-8 pb-20">
      
      {/* 🔹 TOAST NOTIFICATION PREMIUM */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed bottom-10 right-6 z-[999] min-w-[350px]">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className={`absolute -right-10 -top-10 w-32 h-32 blur-[50px] opacity-30 ${toast.type === 'error' ? 'bg-red-500' : 'bg-orange-500'}`} />
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${toast.type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                  {toast.type === 'error' ? <Icons.ShieldAlert size={24} /> : <Icons.CheckCircle2 size={24} />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-bold uppercase tracking-tighter">{toast.message}</p>
                </div>
                <button onClick={() => setToast({ ...toast, show: false })} className="text-slate-500 hover:text-white"><Icons.X size={18} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 HEADER */}
      <div className="bg-[#0f172a] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="relative z-10">
          <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2">
            {wallet?.nom_boutique || "Ma Boutique"} <span className="text-orange-500">PRO</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] italic">Écosystème de vente Rynek</p>
        </div>

        <div className="relative z-10 flex gap-4">
           <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 text-center min-w-[120px]">
              <p className="text-orange-500 text-3xl font-black">{produits.length}</p>
              <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">Articles</p>
           </div>
        </div>
        <Icons.Store className="absolute -left-10 -bottom-10 text-white/5" size={250} />
      </div>

      {/* 🔹 RECHERCHE */}
      <div className="relative group">
         <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
         <input 
           type="text" 
           placeholder="Filtrer votre stock..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full bg-white border border-slate-100 rounded-full py-5 pl-14 pr-6 text-xs font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
         />
      </div>

      {/* 🔹 NAVIGATION TACTIQUE (Boutons fonctionnels) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {menuButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => {
              if (btn.id === "creer") setOpenCreate(true);
              else if (btn.id === "ajouter") setOpenAdd(true);
              else setActiveView(btn.id);
            }}
            className={`group p-6 rounded-[2.5rem] border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95
              ${activeView === btn.id && !btn.isModal
                ? "bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20" 
                : "bg-white border-slate-100 text-slate-400 hover:border-orange-500 hover:text-orange-500 shadow-sm"}`}
          >
            <div className={`p-4 rounded-2xl shadow-md transition-transform group-hover:rotate-12
              ${activeView === btn.id && !btn.isModal ? "bg-white/20" : btn.color + " text-white"}`}>
              {btn.icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-center">{btn.label}</span>
          </button>
        ))}
      </section>

      {/* 🔹 ZONE D'AFFICHAGE DYNAMIQUE */}
      <main className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
               <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div key={activeView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {activeView === "mes-articles" && (
                <MesArticles 
                  produits={filteredProduits} 
                  onDelete={handleDelete} 
                  onEdit={(p) => setEditingProduct(p)} 
                />
              )}
              {activeView === "commandes" && <CommandesBoutique user={user} />}
              {activeView === "stats" && <StatsBoutique produits={produits} wallet={wallet} />}
              {activeView === "themes" && <ThemeBoutique />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 🔹 MODALES (Avec rafraîchissement des données) */}
      <ModalAjouterArticle 
        isOpen={openAdd} 
        onClose={() => setOpenAdd(false)} 
        user={user} 
        onSuccess={() => { fetchInitialData(); notify("Article ajouté au catalogue !"); }}
      />

      <ModalCreerBoutique 
        isOpen={openCreate} 
        onClose={() => setOpenCreate(false)} 
        wallet={wallet} 
        user={user}
        onSuccess={() => { notify("Profil boutique mis à jour !"); }}
      />

      {/* 🔹 MODALE ÉDITION PRODUIT */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-10 rounded-[3rem] w-full max-w-lg shadow-2xl relative">
              <button onClick={() => setEditingProduct(null)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500"><Icons.X size={24} /></button>
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center"><Icons.Edit3 size={28} /></div>
                 <h2 className="font-black text-2xl uppercase tracking-tighter">Édition Rapide</h2>
              </div>
              <p className="text-xs font-bold text-slate-500 mb-6 italic">Modification de : <span className="text-orange-500">"{editingProduct.nom}"</span></p>
              
              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                 <p className="text-[10px] font-black uppercase text-slate-400 mb-4">Module d'édition en cours...</p>
                 <button onClick={() => setEditingProduct(null)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500">Fermer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}