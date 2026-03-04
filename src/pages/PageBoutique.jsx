import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BadgeCheck, MapPin, Phone, Star, ShoppingCart, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

// 📦 Fausse base de données des produits de la boutique (pour l'exemple)
const produitsBoutique = [
  { id: 1, nom: "Ensemble Sport Pro", prix: "25 000", image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=500&auto=format&fit=crop", categorie: "Vêtements", promo: "-20%" },
  { id: 2, nom: "Baskets Ultra Boost", prix: "45 000", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop", categorie: "Chaussures", promo: null },
  { id: 3, nom: "Sac à dos Urban", prix: "15 000", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop", categorie: "Accessoires", promo: "-10%" },
  { id: 4, nom: "Casquette Signature", prix: "8 500", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=500&auto=format&fit=crop", categorie: "Accessoires", promo: null },
  { id: 5, nom: "T-Shirt Training", prix: "12 000", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop", categorie: "Vêtements", promo: null },
  { id: 6, nom: "Gourde Isotherme", prix: "6 000", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=500&auto=format&fit=crop", categorie: "Accessoires", promo: "-15%" },
];

export default function PageBoutique() {
  const { nomBoutique } = useParams(); // Récupère le nom depuis l'URL (ex: /boutique/Adidas)
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Tous");

  // On simule les données de la boutique en fonction du nom passé dans l'URL
  const nomAffiche = nomBoutique ? decodeURIComponent(nomBoutique) : "Boutique Officielle";

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* 🔹 1. BANNIÈRE (COVER) DE LA BOUTIQUE */}
      <div className="relative h-64 md:h-80 w-full bg-blue-900 overflow-hidden">
        {/* Image de fond générique (à remplacer par une vraie cover dans votre DB) */}
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop" 
          alt="Cover" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        {/* Bouton Retour */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-3 rounded-full transition-all"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* 🔹 2. INFORMATIONS DE LA MARQUE (Overlapping) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 border border-gray-100">
          
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white shadow-lg border-4 border-white overflow-hidden flex-shrink-0 -mt-16 md:-mt-24 z-20 relative">
            {/* Dans un cas réel, vous passeriez l'URL de l'image de la boutique */}
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl font-black text-gray-300 uppercase">
              {nomAffiche.substring(0, 2)}
            </div>
            <BadgeCheck className="absolute bottom-2 right-2 text-blue-500 bg-white rounded-full shadow-sm" size={24} />
          </div>

          {/* Textes et Stats */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
              {nomAffiche}
            </h1>
            <p className="text-gray-500 text-sm mt-2 max-w-2xl">
              Bienvenue sur la boutique officielle de {nomAffiche}. Découvrez nos dernières collections, exclusivités et promotions spécialement sélectionnées pour vous.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                <Star size={14} className="text-yellow-500 fill-yellow-500" /> 4.9/5 (2.4k avis)
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                <MapPin size={14} className="text-gray-400" /> Abidjan
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 border border-green-200 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Ouvert
              </span>
            </div>
          </div>

          {/* Action */}
          <div className="w-full md:w-auto flex gap-3">
            <button className="flex-1 md:flex-none px-6 py-3 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2">
              <Phone size={16} /> Contacter
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition flex items-center justify-center gap-2">
              S'abonner
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 3. NAVIGATION & FILTRES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {["Tous", "Nouveautés", "Promotions", "Meilleures ventes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher dans la boutique..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* 🔹 4. GRILLE DES PRODUITS DE LA BOUTIQUE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {produitsBoutique.map((produit, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={produit.id} 
              className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {produit.promo && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                    {produit.promo}
                  </div>
                )}
              </div>
              <div className="p-4 md:p-5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{produit.categorie}</p>
                <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1">{produit.nom}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-black text-blue-600 text-lg">{produit.prix} <span className="text-[10px] font-bold">FCFA</span></p>
                  <button className="bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-900 p-2 rounded-lg transition-colors">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}