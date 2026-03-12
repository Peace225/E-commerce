// src/pages/Search.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function Search() {
  const location = useLocation();
  const q = new URLSearchParams(location.search).get("q") || "";
  const [produits, setProduits] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tri, setTri] = useState("createdAt-desc");

  const observer = useRef();
  const produitsRef = collection(db, "produits");

  const fetchProduits = useCallback(async (reset = false) => {
    if (loading || (!reset && !hasMore)) return;
    setLoading(true);

    try {
      const [field, direction] = tri.split("-");
      let baseQuery = query(
        produitsRef,
        orderBy(field, direction),
        limit(6)
      );

      if (!reset && lastDoc) {
        baseQuery = query(
          produitsRef,
          orderBy(field, direction),
          startAfter(lastDoc),
          limit(6)
        );
      }

      const snapshot = await getDocs(baseQuery);
      const newDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (reset) {
        setProduits(newDocs);
      } else {
        setProduits((prev) => [...prev, ...newDocs]);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 6);
    } catch (error) {
      console.error("Erreur chargement produits:", error);
    } finally {
      setLoading(false);
    }
  }, [tri, lastDoc, loading, hasMore]);

  useEffect(() => {
    setProduits([]);
    setLastDoc(null);
    setHasMore(true);
    fetchProduits(true);
  }, [q, tri]);

  const lastProduitRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProduits();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchProduits]
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">
        Résultats pour : <span className="text-blue-600">{q}</span>
      </h1>

      <div className="mb-4">
        <label htmlFor="tri" className="mr-2 font-medium">Trier par :</label>
        <select
          id="tri"
          value={tri}
          onChange={(e) => setTri(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="createdAt-desc">Nouveaux produits</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
          <option value="nom-asc">Nom A-Z</option>
          <option value="nom-desc">Nom Z-A</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {produits.map((produit, index) => {
          const isLast = index === produits.length - 1;
          return (
            <div
              key={produit.id}
              ref={isLast ? lastProduitRef : null}
              className="border rounded p-3 shadow-sm"
            >
              <img
                src={produit.image}
                alt={produit.nom}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="font-bold text-md">{produit.nom}</h2>
              <p className="text-sm text-gray-600">{produit.description}</p>
              <p className="text-orange-600 font-bold mt-1">{produit.prix} FCFA</p>
            </div>
          );
        })}
      </div>

      {loading && <p className="mt-4 text-center text-sm text-gray-500">Chargement...</p>}
      {!hasMore && !loading && (
        <p className="mt-4 text-center text-sm text-gray-500">Aucun autre produit.</p>
      )}
    </div>
  );
}