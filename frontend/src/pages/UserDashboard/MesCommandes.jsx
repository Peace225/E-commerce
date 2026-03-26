import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient"; // 🔄 Import Supabase
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, Loader2, MapPin, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../components/CartContext"; 

export default function MesCommandes({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const { addToCart } = useCart(); 

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // 🔄 Requête Supabase : On filtre par l'ID du client et on trie par date
        const { data, error } = await supabase
          .from('commandes') // Assure-toi que ta table s'appelle 'commandes'
          .select('*')
          .eq('client_id', user.id) // ⚠️ Supabase utilise 'client_id' et 'user.id'
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Erreur de récupération des commandes:", err.message);
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

  const handleReorder = (e, item) => {
    e.stopPropagation(); 
    const productToAdd = { ...item, quantity: 1 };
    addToCart(productToAdd);
    // On utilise la couleur primaire du thème pour l'alerte si tu veux pousser le détail !
    alert(`${item.nom} ajouté au panier !`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
        <Package size={64} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Aucune commande</h2>
        <p className="text-gray-400 font-bold uppercase text-xs">Vous n'avez pas encore passé de commande sur Rynek.</p>
        <button onClick={() => navigate("/")} className="mt-6 bg-primary text-theme-text px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
          Commencer mes achats
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER AVEC COULEURS DYNAMIQUES */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Mes Commandes</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Suivez vos livraisons en temps réel</p>
          </div>
          <div className="bg-primary/10 text-primary font-black text-xl w-12 h-12 flex items-center justify-center rounded-2xl shadow-inner transition-colors duration-500">
            {orders.length}
          </div>
      </div>

      {orders.map((order, index) => {
        const isExpanded = expandedOrderId === order.id;
        const currentStepIndex = getStepIndex(order.statut || "en_attente");
        // 🔄 Conversion de la date Supabase (string) en date lisible
        const date = order.created_at ? new Date(order.created_at).toLocaleDateString("fr-FR") : "Date inconnue";

        return (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
            key={order.id} 
            className={`bg-white rounded-[2rem] shadow-sm border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-primary/30 shadow-md' : 'border-gray-100 hover:border-primary/20'}`}
          >
            {/* EN TÊTE */}
            <div onClick={() => toggleOrder(order.id)} className="p-6 cursor-pointer group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                   <Package size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Commande #{String(order.id).slice(-6).toUpperCase()}</p>
                  <p className="text-sm font-bold text-gray-800">{date} • {order.items?.length || 1} Article(s)</p>
                  <p className="text-lg font-black tracking-tighter text-gray-900 mt-1">{Number(order.total)?.toLocaleString() || 0} FCFA</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusBadge(order.statut)}`}>
                  {trackingSteps[currentStepIndex]?.label || "En traitement"}
                </span>
                <button className="text-gray-400 group-hover:text-primary transition-colors p-2 bg-gray-50 rounded-full">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {/* DÉTAILS */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-50 bg-gray-50/50"
                >
                  <div className="p-6 md:p-8 space-y-8">
                    {/* TIMELINE PROGRESSIVE */}
                    <div className="relative">
                      <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                      <div 
                        className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-500" 
                        style={{ width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
                      ></div>
                      
                      <div className="relative flex justify-between">
                        {trackingSteps.map((step, idx) => {
                          const isCompleted = idx <= currentStepIndex;
                          const isActive = idx === currentStepIndex;
                          return (
                            <div key={step.id} className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 ${
                                isCompleted ? 'bg-primary border-white text-theme-text shadow-md' : 'bg-white border-gray-200 text-gray-300'
                              } ${isActive ? 'ring-4 ring-primary/10 scale-110' : ''}`}>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      {/* ARTICLES */}
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Articles commandés</h4>
                        <div className="space-y-4">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm font-medium border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                              <div className="flex flex-col gap-1 pr-4">
                                <span className="text-gray-800 line-clamp-1">{item.quantite || item.quantity}x {item.nom}</span>
                                <span className="font-black text-gray-900 text-xs">{Number(item.prix).toLocaleString()} FCFA</span>
                              </div>
                              <button 
                                onClick={(e) => handleReorder(e, item)}
                                className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-theme-text p-2 md:px-3 rounded-xl transition-all active:scale-95 shrink-0"
                              >
                                <ShoppingCart size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Racheter</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* LIVRAISON */}
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Détails de livraison</h4>
                        <div className="flex items-start gap-3">
                          <MapPin className="text-primary shrink-0 mt-0.5" size={18} />
                          <div className="text-sm font-medium text-gray-800 leading-relaxed">
                            <p className="font-bold text-gray-900">{order.adresse_livraison?.nom_complet || user.display_name}</p>
                            <p>{order.adresse_livraison?.telephone || "Contact non spécifié"}</p>
                            <p className="text-gray-500 text-xs mt-1">{order.adresse_livraison?.adresse_complete || "Abidjan, Côte d'Ivoire"}</p>
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