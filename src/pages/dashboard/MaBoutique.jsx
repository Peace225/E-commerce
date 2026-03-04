import { useEffect, useState } from "react";
import { db } from "../../utils/firebaseConfig";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Importation des Modales (Sections)
import ModalAjouterArticle from "../../sections/ModalAjouterArticle";
import ModalCreerBoutique from "../../sections/ModalCreerBoutique";

// Importation des Vues de Contenu
import MesArticles from "../../sections/MesArticles";
import CommandesBoutique from "../../sections/CommandesBoutique";
import ThemeBoutique from "../../sections/ThemeBoutique";
import StatsBoutique from "../../sections/StatsBoutique";

export default function MaBoutique({ wallet }) {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("mes-articles");

  // États des Modales
  const [openAdd, setOpenAdd] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // 🔄 Chargement des produits depuis Firebase
  const fetchProduits = async () => {
    if (!wallet?.referralCode) return;
    try {
      setLoading(true);
      const q = query(collection(db, "produits"), where("boutiqueId", "==", wallet.referralCode));
      const snap = await getDocs(q);
      setProduits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, [wallet]);

  // 🗑️ Fonction de suppression
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      try {
        await deleteDoc(doc(db, "produits", id));
        setProduits(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  // 🔘 Configuration des Boutons (Actions + Navigation)
  const menuButtons = [
    { id: "creer", label: "Créer Boutique", icon: <Icons.Store size={20} />, color: "bg-blue-600", isModal: true },
    { id: "ajouter", label: "Ajouter Article", icon: <Icons.PlusCircle size={20} />, color: "bg-orange-600", isModal: true },
    { id: "mes-articles", label: "Mes Articles", icon: <Icons.Package size={20} />, color: "bg-slate-700", isModal: false },
    { id: "commandes", label: "Commandes", icon: <Icons.ShoppingBag size={20} />, color: "bg-emerald-600", isModal: false },
    { id: "themes", label: "Thèmes", icon: <Icons.Palette size={20} />, color: "bg-purple-600", isModal: false },
    { id: "stats", label: "Statistiques", icon: <Icons.BarChart3 size={20} />, color: "bg-red-600", isModal: false },
  ];

  return (
    <div className="space-y-10 pb-20">
      
      {/* 🔹 HEADER RYNEK PRO */}
      <div className="bg-[#0f172a] p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
            Ma Boutique <span className="text-orange-500">Pro</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-3 italic">Écosystème de vente ultra-performant</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Icons.Layers size={24} />
          </div>
          <div className="pr-4">
            <p className="text-white text-2xl font-black leading-none">{produits.length}</p>
            <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Articles en ligne</p>
          </div>
        </div>
      </div>

      {/* 🔹 NAVIGATION & ACTIONS RAPIDES */}
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
                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "bg-white border-slate-100 text-slate-400 hover:border-orange-500 hover:text-orange-500"}`}
          >
            <div className={`p-4 rounded-2xl shadow-md transition-transform group-hover:rotate-12 
              ${activeView === btn.id && !btn.isModal ? "bg-white/20" : btn.color + " text-white"}`}>
              {btn.icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{btn.label}</span>
          </button>
        ))}
      </section>

      {/* 🔹 ZONE D'AFFICHAGE DYNAMIQUE */}
      <main className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === "mes-articles" && (
              <MesArticles 
                produits={produits} 
                onDelete={handleDelete} 
                onEdit={(p) => setEditingProduct(p)} 
              />
            )}
            {activeView === "commandes" && <CommandesBoutique />}
            {activeView === "themes" && <ThemeBoutique />}
            {activeView === "stats" && <StatsBoutique produits={produits} wallet={wallet} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 🔹 MODALES EXTERNES (SECTIONS) */}
      <ModalAjouterArticle 
        isOpen={openAdd} 
        onClose={() => setOpenAdd(false)} 
        wallet={wallet} 
        refreshData={fetchProduits} 
      />

      <ModalCreerBoutique 
        isOpen={openCreate} 
        onClose={() => setOpenCreate(false)} 
        wallet={wallet} 
      />

      {/* Optionnel : Modale spécifique pour l'édition si tu veux séparer de l'ajout */}
      {editingProduct && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
            {/* Ici tu peux mettre un formulaire de modification rapide */}
            <div className="bg-white p-10 rounded-3xl">
               <h2 className="font-black italic uppercase">Mode Édition : {editingProduct.nom}</h2>
               <button onClick={() => setEditingProduct(null)} className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl uppercase font-black text-xs">Fermer</button>
            </div>
         </div>
      )}

    </div>
  );
}