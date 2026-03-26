import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient"; // 🔄 ON CHANGE POUR SUPABASE
import { Helmet } from "react-helmet-async";

// Icônes
import { FaFacebookF, FaTwitter, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { ChevronLeft } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const ref = queryParams.get("ref"); 

  // États
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState("");
  const [slide, setSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  // 🔄 RÉCUPÉRATION DEPUIS SUPABASE
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // On cherche dans la table 'produits' l'ID qui correspond à l'URL
        const { data, error } = await supabase
          .from('produits')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setProduct(data);
          // Gestion des tailles
          if (data.tailles && data.tailles.length > 0) setSize(data.tailles[0]);
          else setSize("Standard");
        }
      } catch (error) {
        console.error("Erreur Supabase Details:", error.message);
        setProduct(null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // GESTION DU SLIDER DES AVIS (Statique pour le moment)
  const reviews = [
    { name: "Client Rynek", rating: 5, comment: "Produit de très bonne qualité, je recommande !" },
    { name: "Acheteur Vérifié", rating: 4, comment: "Conforme à la description, livraison rapide." }
  ];

  useEffect(() => {
    if (!product) return;
    const timer = setInterval(() => setSlide(prev => (prev + 1) % reviews.length), 4000);
    return () => clearInterval(timer);
  }, [product]);

  // ⏳ CHARGEMENT
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-[#e96711] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ❌ ERREUR
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10 text-center">
        <h2 className="text-3xl font-black text-gray-800 mb-4">Produit introuvable</h2>
        <p className="text-gray-500 mb-6">Ce produit n'est plus disponible ou l'ID est incorrect.</p>
        <button onClick={() => navigate("/")} className="bg-[#e96711] text-white px-6 py-3 rounded font-bold">Retour à l'accueil</button>
      </div>
    );
  }

  const handleShare = () => {
    const shareURL = `${window.location.origin}/product/${product.id}${ref ? `?ref=${ref}` : ""}`;
    navigator.clipboard.writeText(shareURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // On adapte les noms des colonnes de ta table Supabase
  const imageAffichage = product.img || "/images/placeholder.png";

  return (
    <div className="bg-gray-100 min-h-screen py-6 font-['Inter',sans-serif]">
      <Helmet>
        <title>{product.nom} | Rynek</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#e96711] font-bold text-sm transition-colors">
          <ChevronLeft size={18} /> Retour
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        
        {/* COLONNE 1 : IMAGE */}
        <div className="bg-white p-6 rounded shadow flex flex-col">
          <img
            src={imageAffichage}
            alt={product.nom}
            onClick={() => setZoom(!zoom)}
            className={`w-full h-[300px] md:h-[420px] object-contain cursor-pointer transition-transform duration-300 ${zoom ? "scale-125" : ""}`}
          />
          <p className="text-center text-sm text-gray-400 mt-4 italic">Cliquez sur l'image pour zoomer</p>

          <div className="mt-auto border-t pt-6">
            <p className="font-semibold mb-3 text-sm text-gray-700">PARTAGER CE PRODUIT</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")} className="bg-blue-600 text-white p-3 rounded-full"><FaFacebookF /></button>
              <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${window.location.href}`, "_blank")} className="bg-green-500 text-white p-3 rounded-full"><FaWhatsapp /></button>
              <button onClick={handleShare} className="ml-auto text-sm text-blue-600 font-bold">{copied ? "Lien copié !" : "Copier le lien"}</button>
            </div>
          </div>
        </div>

        {/* COLONNE 2 : DÉTAILS */}
        <div className="bg-white p-6 rounded shadow flex flex-col">
          <p className="text-sm text-[#e96711] font-bold uppercase tracking-widest mb-1">{product.marque}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.nom}</h1>
          
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-3xl md:text-4xl font-black text-gray-900">{product.prix?.toLocaleString('fr-FR')} FCFA</span>
            {product.old_price && <span className="line-through text-gray-400 text-lg">{product.old_price.toLocaleString('fr-FR')} FCFA</span>}
          </div>

          <div className="mt-4 bg-green-50 border border-green-100 p-3 rounded-lg flex items-center text-sm">
            <span className="text-green-600 mr-2">💰</span> Commission : 
            <span className="font-bold text-green-700 ml-1">{product.commission} FCFA</span>
          </div>

          <p className="mt-6 text-gray-600 text-sm leading-relaxed">{product.description}</p>
          
          <button className="mt-8 w-full bg-[#e96711] hover:bg-orange-600 text-white py-4 rounded-lg font-black uppercase shadow-lg transition-transform active:scale-95">
            🛒 Acheter maintenant
          </button>
        </div>

        {/* COLONNE 3 : INFOS VENDEUR & LIVRAISON */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-bold mb-4 uppercase text-gray-800 tracking-wider text-sm border-b pb-2">Livraison & Retours</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p className="font-bold">📍 Expédition Rapide</p>
                <p className="text-gray-500">Livraison partout en Côte d'Ivoire (24h-48h).</p>
              </div>
              <div className="bg-blue-50 p-3 rounded text-sm">
                <p className="font-bold text-blue-800">Vendeur : {product.marque || "Officiel Rynek"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow flex flex-col">
            <h3 className="font-bold mb-4 uppercase text-gray-800 text-sm border-b pb-2">Avis Clients</h3>
            <div className="text-center py-4">
              <p className="font-bold">{reviews[slide].name}</p>
              <p className="text-yellow-400">{"⭐".repeat(reviews[slide].rating)}</p>
              <p className="text-sm text-gray-500 italic mt-2">"{reviews[slide].comment}"</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}