import { useState, useEffect } from "react";
import { db } from "../../utils/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, Loader2, MapPin, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 👈 1. IMPORT DU CONTEXTE PANIER (Ajuste le chemin si besoin)
import { useCart } from "../../components/CartContext"; 

export default function MesCommandes({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // 👈 2. RÉCUPÉRATION DE LA FONCTION POUR AJOUTER AU PANIER
  const { addToCart } = useCart(); 

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "commandes"),
          where("clientUid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Erreur de récupération des commandes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const trackingSteps = [
    { id: "en_attente", label: "Validée", icon: <Clock size={16} /> },
    { id: "preparation", label: "Préparation", icon: <Package size={16} /> },
    { id: "en_cours", label: "En route", icon: <Truck size={16} /> },
    { id: "livree", label: "Livrée", icon: <CheckCircle size={16} /> }
  ];

  const getStepIndex = (statut) => {
    const index = trackingSteps.findIndex(step => step.id === statut);
    return index === -1 ? 0 : index;
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "en_attente": return "bg-orange-100 text-orange-600";
      case "preparation": return "bg-blue-100 text-blue-600";
      case "en_cours": return "bg-indigo-100 text-indigo-600";
      case "livree": return "bg-emerald-100 text-emerald-700";
      case "annulee": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // 👈 3. FONCTION POUR GÉRER LE CLIC "ACHETER À NOUVEAU"
  const handleReorder = (e, item) => {
    e.stopPropagation(); // Empêche la carte de se refermer quand on clique sur le bouton
    
    // On recrée l'objet produit tel qu'attendu par le panier (quantité par défaut : 1)
    const productToAdd = {
      ...item,
      quantity: 1 
    };
    
    addToCart(productToAdd);
    
    // Optionnel : Tu peux ajouter une petite alerte ou un toast ici pour confirmer
    alert(`${item.nom} a été ajouté au panier !`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
        <Package size={64} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Aucune commande</h2>
        <p className="text-gray-400 font-bold uppercase text-xs">Vous n'avez pas encore passé de commande sur Rynek.</p>
        <button className="mt-6 bg-orange-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
          Commencer mes achats
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
         <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Mes Commandes</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Suivez vos livraisons en temps réel</p>
         </div>
         <div className="bg-orange-50 text-orange-600 font-black text-xl w-12 h-12 flex items-center justify-center rounded-2xl shadow-inner">
            {orders.length}
         </div>
      </div>

      {orders.map((order, index) => {
        const isExpanded = expandedOrderId === order.id;
        const currentStepIndex = getStepIndex(order.statut || "en_attente");
        const date = order.createdAt ? order.createdAt.toDate().toLocaleDateString("fr-FR") : "Date inconnue";

        return (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
            key={order.id} 
            className={`bg-white rounded-[2rem] shadow-sm border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-orange-200 shadow-md' : 'border-gray-100 hover:border-orange-100'}`}
          >
            {/* EN TÊTE CLICABLE */}
            <div onClick={() => toggleOrder(order.id)} className="p-6 cursor-pointer group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl transition-colors ${isExpanded ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500'}`}>
                   <Package size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Commande #{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm font-bold text-gray-800">{date} • {order.items?.length || 1} Article(s)</p>
                  <p className="text-lg font-black tracking-tighter text-gray-900 mt-1">{order.total?.toLocaleString() || 0} FCFA</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusBadge(order.statut)}`}>
                  {trackingSteps[currentStepIndex]?.label || "En traitement"}
                </span>
                <button className="text-gray-400 group-hover:text-orange-500 transition-colors p-2 bg-gray-50 rounded-full">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {/* DÉTAILS DÉPLIANTS */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-50 bg-gray-50/50"
                >
                  <div className="p-6 md:p-8 space-y-8">
                    
                    {/* BARRE DE PROGRESSION (TIMELINE) */}
                    <div className="relative">
                      <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                      <div 
                        className="absolute top-5 left-0 h-1 bg-orange-500 rounded-full transition-all duration-500" 
                        style={{ width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
                      ></div>
                      
                      <div className="relative flex justify-between">
                        {trackingSteps.map((step, idx) => {
                          const isCompleted = idx <= currentStepIndex;
                          const isActive = idx === currentStepIndex;
                          return (
                            <div key={step.id} className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 ${
                                isCompleted ? 'bg-orange-500 border-white text-white shadow-md' : 'bg-white border-gray-200 text-gray-300'
                              } ${isActive ? 'ring-4 ring-orange-100 scale-110' : ''}`}>
                                {step.icon}
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest mt-3 transition-colors ${
                                isCompleted ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* LISTE DES ARTICLES ET INFO LIVRAISON */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      
                      {/* 👈 4. NOUVEL AFFICHAGE DES ARTICLES AVEC LE BOUTON PANIER */}
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Articles commandés</h4>
                        <div className="space-y-4">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm font-medium border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                              
                              <div className="flex flex-col gap-1 pr-4">
                                <span className="text-gray-800 line-clamp-1">{item.quantite}x {item.nom}</span>
                                <span className="font-black text-gray-900 text-xs">{(item.prix).toLocaleString()} FCFA / unité</span>
                              </div>
                              
                              <button 
                                onClick={(e) => handleReorder(e, item)}
                                className="flex items-center gap-2 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white p-2 md:px-3 rounded-xl transition-all active:scale-95 shrink-0"
                                title="Acheter à nouveau"
                              >
                                <ShoppingCart size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Racheter</span>
                              </button>

                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info Livraison */}
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Détails de livraison</h4>
                        <div className="flex items-start gap-3">
                          <MapPin className="text-orange-500 shrink-0 mt-0.5" size={18} />
                          <div className="text-sm font-medium text-gray-800 leading-relaxed">
                            <p className="font-bold text-gray-900">{order.adresseLivraison?.nomComplet || user.displayName}</p>
                            <p>{order.adresseLivraison?.telephone || user.whatsapp || "Téléphone non renseigné"}</p>
                            <p className="text-gray-500 text-xs mt-1">{order.adresseLivraison?.adresseComplete || "Abidjan, Côte d'Ivoire"}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>
        );
      })}
    </div>
  );
}