import { useState } from "react";
import { useAuth } from "../../contexte/AuthContext"; // Vérifie le chemin de ton contexte
import AlertMessage from "../../components/AlertMessage";
import { Package, Tag, Layers, Database, Image as ImageIcon } from "lucide-react";

export default function AddProduct() {
  const { user } = useAuth(); // Récupère l'utilisateur connecté (Vendeur)
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    img: "" // On utilisera une URL pour l'instant
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert("");

    // Préparation du payload pour le Backend
    const productData = {
      ...formData,
      sellerId: user?.uid,
      shopName: user?.displayName || "Ma Boutique",
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      commission: parseFloat(formData.price) * 0.10, // Exemple: 10% de commission parrainage
    };

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${await user.getIdToken()}` // Active ceci quand tu auras le middleware
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (response.ok) {
        setAlert("✅ Produit mis en ligne avec succès !");
        // Réinitialiser le formulaire
        setFormData({ name: "", price: "", description: "", category: "", stock: "", img: "" });
      } else {
        setAlert("❌ Erreur : " + result.error);
      }
    } catch (error) {
      setAlert("❌ Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {alert && <AlertMessage message={alert} onClose={() => setAlert("")} />}

      <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">Nouvel Article</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ajouter au catalogue Rynek</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Nom du produit */}
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="text"
              required
              placeholder="Nom de l'article"
              className="w-full border-2 border-gray-50 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all font-medium text-sm"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Prix */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs italic">CFA</span>
              <input
                type="number"
                required
                placeholder="Prix"
                className="w-full border-2 border-gray-50 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all font-medium text-sm"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            {/* Stock */}
            <div className="relative">
              <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="number"
                required
                placeholder="Stock"
                className="w-full border-2 border-gray-50 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all font-medium text-sm"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>

          {/* Catégorie */}
          <div className="relative">
            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <select
              required
              className="w-full border-2 border-gray-50 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all font-medium text-sm text-gray-500 appearance-none bg-white"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Sélectionner une catégorie...</option>
              <option value="mode">Mode & Beauté</option>
              <option value="high-tech">Électronique</option>
              <option value="maison">Maison & Déco</option>
            </select>
          </div>

          {/* Image URL (En attendant l'upload réel) */}
          <div className="relative">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="url"
              placeholder="URL de l'image (Lien direct)"
              className="w-full border-2 border-gray-50 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all font-medium text-sm"
              value={formData.img}
              onChange={(e) => setFormData({...formData, img: e.target.value})}
            />
          </div>

          {/* Description */}
          <textarea
            placeholder="Description détaillée du produit..."
            rows="4"
            className="w-full border-2 border-gray-50 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all font-medium text-sm"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Publier l'article"}
        </button>
      </form>
    </div>
  );
}