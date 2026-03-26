import React, { useState } from "react";
; // Vérifiez le chemin vers votre config

// Liste de vos catégories avec quelques marques pour que ce soit réaliste
const categoriesData = {
  "Téléphones": ["Samsung", "Apple", "Infinix", "Xiaomi", "Tecno"],
  "TV & HIGH TECH": ["LG", "Samsung", "Hisense", "Sony", "TCL"],
  "Informatique": ["HP", "Dell", "Asus", "Lenovo", "MacBook"],
  "Maison, cuisine & bureau": ["Ikea", "Tefal", "Moulinex", "Rochedo"],
  "Électroménager": ["Beko", "LG", "Whirlpool", "Bosch", "Roch"],
  "Vêtements & Chaussures": ["Nike", "Adidas", "Zara", "Puma", "Balenciaga"],
  "Beauté & Santé": ["L'Oréal", "Nivea", "Mac", "Gillette", "Yves Rocher"],
  "Jeux vidéos & Consoles": ["PlayStation", "Xbox", "Nintendo", "Logitech"],
  "Bricolage": ["Bosch", "Makita", "Facom", "Stanley"],
  "Sports & Loisirs": ["Decathlon", "Kipsta", "Wilson", "Spalding"],
  "Bébé & Jouets": ["Chicco", "Pampers", "Lego", "Fisher-Price"],
  "Librairie": ["Hachette", "Gallimard", "Pocket", "Folio"],
  "Autres catégories": ["Générique", "Marque X", "Local"]
};

export default function GenererProduits() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const injecterProduits = async () => {
    setLoading(true);
    setMessage("Génération en cours... Ne fermez pas la page.");

    try {
      // Un batch permet d'envoyer plein de documents en une seule requête (plus rapide)
      const batch = writeBatch(db);
      let totalProduits = 0;

      // On boucle sur chaque catégorie
      for (const [categorie, marques] of Object.entries(categoriesData)) {
        // On crée 10 produits pour cette catégorie
        for (let i = 1; i <= 10; i++) {
          // Choisir une marque au hasard dans la liste de cette catégorie
          const marqueAlea = marques[Math.floor(Math.random() * marques.length)];
          
          // Prix aléatoire entre 5.000 et 500.000 FCFA
          const prixAlea = Math.floor(Math.random() * 495000) + 5000;

          // Créer une référence pour un nouveau document avec un ID auto
          const newDocRef = doc(collection(db, "produits"));

          // Ajouter les données au batch
          batch.set(newDocRef, {
            nom: `${categorie.substring(0, 5)} - Modèle ${marqueAlea} V${i}`,
            prix: prixAlea,
            categorie: categorie,
            marque: marqueAlea,
            imageUrl: `https://ui-avatars.com/api/?name=${marqueAlea}&background=random&size=300`, // Génère une fausse image colorée avec le nom de la marque
            description: `Ceci est un faux produit généré automatiquement pour la catégorie ${categorie}.`,
            enStock: true,
            createdAt: new Date().toISOString()
          });

          totalProduits++;
        }
      }

      // Valider et envoyer le tir groupé à Firebase
      await batch.commit();
      setMessage(`✅ Succès ! ${totalProduits} produits ont été ajoutés à Firebase.`);
    } catch (error) {
      console.error("Erreur :", error);
      setMessage("❌ Erreur lors de l'ajout : " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200 max-w-lg mx-auto mt-10 text-center">
      <h2 className="text-2xl font-black mb-4">Générateur de Produits</h2>
      <p className="text-gray-600 mb-6">
        Ce bouton va créer 10 produits pour chacune de vos 13 catégories (soit 130 produits au total) et les envoyer dans Firebase.
      </p>
      
      <button 
        onClick={injecterProduits}
        disabled={loading}
        className={`px-6 py-3 rounded-full font-bold text-white transition-all ${
          loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg hover:-translate-y-1"
        }`}
      >
        {loading ? "Création en cours..." : "🚀 Générer 130 faux produits"}
      </button>

      {message && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm font-bold text-gray-800">
          {message}
        </div>
      )}
    </div>
  );
}