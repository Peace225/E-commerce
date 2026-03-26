import { useState } from "react";
import { useCart } from "../components/CartContext";
import { useAuth } from "../../contexte/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // État du formulaire de livraison
  const [formData, setFormData] = useState({
    nom: user?.displayName || "",
    telephone: "",
    ville: "Abidjan",
    commune: "",
    adresse: "",
    methodePaiement: "cash" // Par défaut : Cash à la livraison
  });

  // Calculs dynamiques
  const subtotal = cartItems.reduce((acc, item) => acc + (item.prix * (item.quantity || 1)), 0);
  const total = subtotal; // Tu pourras soustraire d'éventuels coupons ici plus tard

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <Icons.ShoppingBag size={64} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-black uppercase tracking-tighter">Votre panier est vide</h2>
        <Link to="/" className="mt-4 text-orange-600 font-bold hover:underline">Continuer mes achats</Link>
      </div>
    );
  }

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!formData.telephone || !formData.commune) {
        alert("Veuillez remplir les informations de livraison.");
        return;
    }

    setLoading(true);

    try {
      // 📦 Structure de la commande pour Firestore
      const orderData = {
        clientUid: user?.uid || "invite",
        clientInfo: {
            nom: formData.nom,
            telephone: formData.telephone,
            adresse: `${formData.adresse}, ${formData.commune}, ${formData.ville}`
        },
        articles: cartItems.map(item => ({
            id: item.id,
            nom: item.nom,
            prix: item.prix,
            quantite: item.quantity
        })),
        montantTotal: total,
        methodePaiement: formData.methodePaiement,
        statut: "En attente",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "commandes"), orderData);
      
      // ✅ Succès : On vide le panier et on redirige
      clearCart();
      navigate(`/payment-success?commandeId=${docRef.id}&total=${total}`);
    } catch (error) {
      console.error("Erreur lors de la commande:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-['Inter',sans-serif]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="p-2 bg-white rounded-full shadow-sm hover:text-orange-600 transition-colors">
                <Icons.ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Validation de commande</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. INFOS DE LIVRAISON ET PAIEMENT */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h2 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                <Icons.Truck className="text-orange-600" size={20} /> Détails de livraison
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                    type="text" placeholder="Nom complet" value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                />
                <input 
                    type="tel" placeholder="N° Téléphone (WhatsApp préféré)" value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                />
                <input 
                    type="text" placeholder="Commune (ex: Cocody, Yopougon...)" value={formData.commune}
                    onChange={(e) => setFormData({...formData, commune: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                />
                <input 
                    type="text" placeholder="Adresse précise (Carrefour, immeuble...)" value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h2 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                <Icons.CreditCard className="text-orange-600" size={20} /> Mode de paiement
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: 'cash', label: 'Cash à la livraison', icon: <Icons.Banknote /> },
                    { id: 'wave', label: 'Wave', icon: <Icons.Smartphone /> },
                    { id: 'orange', label: 'Orange Money', icon: <Icons.SmartphoneNfc /> }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setFormData({...formData, methodePaiement: m.id})}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.methodePaiement === m.id ? 'border-orange-500 bg-orange-50' : 'border-gray-50 hover:border-gray-200'}`}
                  >
                    <span className={formData.methodePaiement === m.id ? 'text-orange-600' : 'text-gray-400'}>{m.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 2. RÉCAPITULATIF PANIER */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 sticky top-24">
              <h2 className="text-lg font-black uppercase mb-6 border-b pb-4">Résumé</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-xs font-black uppercase truncate w-32">{item.nom}</span>
                        <span className="text-[10px] font-bold text-gray-400">Qté: {item.quantity}</span>
                    </div>
                    <span className="text-xs font-bold">{(item.prix * item.quantity).toLocaleString()} F</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                  <span>Sous-total</span>
                  <span>{subtotal.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between text-xl font-black uppercase tracking-tighter pt-2">
                  <span>Total</span>
                  <span className="text-orange-600">{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmOrder}
                disabled={loading}
                className="w-full mt-8 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-orange-600/20 transition-all flex justify-center items-center gap-2"
              >
                {loading ? <Icons.Loader2 className="animate-spin" /> : "Confirmer ma commande"}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <Icons.ShieldCheck size={14} className="text-emerald-500" /> Paiement 100% Sécurisé
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}