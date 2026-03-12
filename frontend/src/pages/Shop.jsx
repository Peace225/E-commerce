import React, { useEffect, useState } from 'react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à ton API Backend
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error("Erreur:", err));
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement des articles...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Boutique Rynek</h1>
      
      {products.length === 0 ? (
        <p>Aucun produit n'est disponible pour le moment. 🎉</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-sm">
              <img src={product.img} alt={product.name} className="w-full h-48 object-cover mb-4" />
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-gray-600">{product.price} FCFA</p>
              <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded">
                Acheter
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;