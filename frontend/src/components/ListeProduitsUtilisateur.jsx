import { useEffect, useState } from "react";
import { useAuth } from "../contexte/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function ListeProduitsUtilisateur() {
  const { user } = useAuth();
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProduits = async () => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, "produits"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProduits(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduits();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await deleteDoc(doc(db, "produits", id));
      setProduits(produits.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression produit:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  const produitsFiltres = produits.filter((p) =>
    (p.nom || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="mt-10" aria-label="Liste des produits de l'utilisateur">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-lg font-bold text-gray-800">🛒 Vos produits</h2>
        <input
          type="search"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-auto border px-3 py-2 rounded shadow-sm text-sm"
          aria-label="Recherche de produit"
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement...</p>
      ) : produitsFiltres.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {produitsFiltres.map((p) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg shadow-sm p-4 bg-white flex flex-col"
                aria-label={`Produit ${p.nom}`}
              >
                <img
                  src={p.image}
                  alt={`Image du produit ${p.nom}`}
                  title={p.nom}
                  className="w-full h-40 object-cover rounded mb-2"
                  loading="lazy"
                />
                <h3 className="font-semibold text-md text-gray-800">{p.nom}</h3>
                <p className="text-sm text-gray-600 flex-1">{p.description}</p>
                <p className="text-orange-600 font-bold mt-1">{p.prix} FCFA</p>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center justify-center gap-1 text-sm"
                  aria-label={`Supprimer le produit ${p.nom}`}
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}