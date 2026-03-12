import { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export default function MaBoutique({ wallet }) {
  const [produits, setProduits] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger uniquement les produits de CETTE boutique
  useEffect(() => {
    const fetchMaBoutique = async () => {
      try {
        // On filtre par le referralCode de l'utilisateur pour identifier sa boutique
        const q = query(collection(db, "produits"), where("boutiqueId", "==", wallet?.referralCode));
        const snap = await getDocs(q);
        setProduits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Erreur chargement produits:", error);
      } finally {
        setLoading(false);
      }
    };
    if (wallet?.referralCode) fetchMaBoutique();
  }, [wallet]);

  if (loading) return <div className="p-10 text-center animate-pulse">Chargement de votre inventaire...</div>;

  return (
    <div className="space-y-8 pb-20">
      
      {/* 🔹 HEADER MA BOUTIQUE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Ma Boutique Pro</h1>
          <p className="text-gray-500 text-sm font-medium">Gérez votre catalogue et boostez vos commissions Rynek.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-orange-200"
        >
          <Icons.Plus size={18} /> Ajouter un produit
        </button>
      </div>

      {/* 🔹 STATS RAPIDES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Articles en ligne</p>
          <h3 className="text-3xl font-black text-emerald-900">{produits.length}</h3>
        </div>
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
          <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Visites Boutique</p>
          <h3 className="text-3xl font-black text-blue-900">128</h3>
        </div>
        <div className="bg-purple-50 p-6 rounded-[2rem] border border-purple-100">
          <p className="text-[10px] font-black text-purple-600 uppercase mb-1">Rang Boutique</p>
          <h3 className="text-3xl font-black text-purple-900">{wallet?.level?.toUpperCase()}</h3>
        </div>
      </div>

      {/* 🔹 GRILLE DE PRODUITS */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-black uppercase tracking-tighter mb-8">Mon Catalogue</h2>
        
        {produits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {produits.map((prod) => (
              <div key={prod.id} className="group border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all">
                <div className="h-48 bg-gray-100 relative">
                  <img src={prod.image || "https://via.placeholder.com/300"} alt={prod.nom} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-orange-600 shadow-sm">
                    {prod.prix} FCFA
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-black text-gray-900 uppercase text-sm mb-2">{prod.nom}</h4>
                  <div className="flex justify-between items-center mt-4">
                    <button className="text-gray-400 hover:text-orange-500 transition-colors"><Icons.Edit3 size={18} /></button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors"><Icons.Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <Icons.ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold">Votre boutique est vide. Commencez par ajouter votre premier produit !</p>
          </div>
        )}
      </div>

      {/* 🔹 CONSEIL ÉDUCATIF */}
      <div className="bg-gray-900 text-white p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Besoin d'aide pour vendre ?</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Les boutiques qui utilisent des photos claires et des descriptions détaillées génèrent <strong>3x plus de commissions</strong>. N'oubliez pas de partager votre lien boutique sur vos réseaux sociaux !
          </p>
          <button className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest hover:text-white transition-colors">
            Consulter le guide vendeur <Icons.ChevronRight size={16} />
          </button>
        </div>
        <Icons.Store className="absolute -right-10 -bottom-10 text-white/5" size={200} />
      </div>

    </div>
  );
}