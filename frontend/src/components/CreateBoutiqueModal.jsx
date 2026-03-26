import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";


import { v4 as uuidv4 } from "uuid";

import { motion, AnimatePresence } from "framer-motion";

export default function CreateBoutiqueModal({ userId, onClose, onCreated }) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [domaine, setDomaine] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productPreviews, setProductPreviews] = useState([]);
  const [products, setProducts] = useState([{ nom: "", prix: "", description: "" }]);
  const [modePaiement, setModePaiement] = useState("Carte bancaire");
  const [loading, setLoading] = useState(false);
  const [domaineDisponible, setDomaineDisponible] = useState(true); // 🆕 état disponibilité

  // Vérification automatique du domaine
  useEffect(() => {
    if (!domaine) {
      setDomaineDisponible(true);
      return;
    }

    const checkDomaine = async () => {
      const q = query(collection(db, "boutiques"), where("domaine", "==", domaine));
      const snapshot = await getDocs(q);
      setDomaineDisponible(snapshot.empty); // true si vide, false si existe
    };

    const timeout = setTimeout(checkDomaine, 500); // Attendre 500ms avant vérification
    return () => clearTimeout(timeout);
  }, [domaine]);

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { nom: "", prix: "", description: "" }]);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleProductImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setProductPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!domaineDisponible) {
      alert("🚫 Ce nom de domaine est déjà utilisé. Veuillez en choisir un autre.");
      return;
    }

    setLoading(true);

    try {
      let logoUrl = "";
      if (logoFile) {
        const logoRef = ref(storage, `logos/${uuidv4()}-${logoFile.name}`);
        const logoSnapshot = await uploadBytes(logoRef, logoFile);
        logoUrl = await getDownloadURL(logoSnapshot.ref);
      }

      const uploadedImages = [];
      for (const image of productImages) {
        const imgRef = ref(storage, `products/${uuidv4()}-${image.name}`);
        const imgSnapshot = await uploadBytes(imgRef, image);
        const imgUrl = await getDownloadURL(imgSnapshot.ref);
        uploadedImages.push(imgUrl);
      }

      await addDoc(collection(db, "boutiques"), {
        nom,
        description,
        domaine,
        userId,
        logoUrl,
        modePaiement,
        products,
        productImages: uploadedImages,
        createdAt: serverTimestamp(),
      });

      onCreated("✅ Boutique créée avec succès !");
      onClose();
    } catch (error) {
      console.error("Erreur création boutique :", error);
      alert("Erreur lors de la création de la boutique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" aria-label="Créer une boutique">
      <motion.form
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh] space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Créer une boutique e-commerce</h2>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom de la boutique</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Boutique FashionStyle"
            required
            className="w-full mt-1 border rounded p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Parlez de votre boutique..."
            className="w-full mt-1 border rounded p-2"
          />
        </div>

        {/* Nom de domaine */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom de Domaine</label>
          <input
            type="text"
            value={domaine}
            onChange={(e) => {
              const input = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, "")
                .replace(/\s+/g, "");
              setDomaine(input);
            }}
            placeholder="Ex: fashionstyle"
            required
            className="w-full mt-1 border rounded p-2"
          />
          {domaine && (
            <p className={`text-xs mt-1 ${domaineDisponible ? "text-green-600" : "text-red-500"}`}>
              {domaineDisponible
                ? `✅ Disponible : https://${domaine}.qwikfy.com`
                : "🚫 Ce domaine est déjà pris"}
            </p>
          )}
        </div>

        {/* (le reste continue normalement : logo, produits, paiement, etc.) */}


        {/* Produits */}
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="border p-3 rounded bg-gray-50">
              <h4 className="font-semibold text-gray-700 mb-2">Produit {index + 1}</h4>
              <input
                type="text"
                placeholder="Nom du produit"
                value={product.nom}
                onChange={(e) => handleProductChange(index, "nom", e.target.value)}
                className="w-full mb-2 border rounded p-2"
                required
              />
              <input
                type="number"
                placeholder="Prix (FCFA)"
                value={product.prix}
                onChange={(e) => handleProductChange(index, "prix", e.target.value)}
                className="w-full mb-2 border rounded p-2"
                required
              />
              <textarea
                placeholder="Description du produit"
                value={product.description}
                onChange={(e) => handleProductChange(index, "description", e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          ))}
          <button type="button" onClick={handleAddProduct} className="text-sm text-green-600 hover:underline">
            + Ajouter un autre produit
          </button>
        </div>

        {/* Images Produits */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Images des produits</label>
          <input type="file" multiple accept="image/*" onChange={handleProductImagesUpload} className="mt-1 w-full" />
          {productPreviews.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {productPreviews.map((src, index) => (
                <img key={index} src={src} alt={`Produit ${index + 1}`} className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        {/* Modes de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement accepté</label>

          <div className="flex gap-4 mb-4">
            {/* Carte Bancaire */}
            <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:border-green-500 transition">
              <input
                type="radio"
                name="modePaiement"
                value="Carte bancaire"
                checked={modePaiement === "Carte bancaire"}
                onChange={(e) => setModePaiement(e.target.value)}
                className="accent-green-500"
              />
              <div className="flex items-center gap-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-5" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-5" />
                <span className="text-sm text-gray-700">Carte bancaire</span>
              </div>
            </label>

            {/* PayPal */}
            <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:border-green-500 transition">
              <input
                type="radio"
                name="modePaiement"
                value="PayPal"
                checked={modePaiement === "PayPal"}
                onChange={(e) => setModePaiement(e.target.value)}
                className="accent-green-500"
              />
              <div className="flex items-center gap-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
                <span className="text-sm text-gray-700">PayPal</span>
              </div>
            </label>
          </div>

          {/* 🎥 Formulaires animés */}
          <AnimatePresence>
            {modePaiement === "Carte bancaire" && (
              <motion.div
                key="carte"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 border rounded p-4 bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Informations Carte Bancaire</h3>

                {/* Numéro de carte avec icône */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Numéro de carte</label>
                  <div className="flex items-center">
                    <span className="absolute left-3 text-gray-400">💳</span>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full border rounded p-2 pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Expiration et CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date d'expiration</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      maxLength="5"
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength="4"
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                </div>

                {/* Titulaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Titulaire de la carte</label>
                  <input
                    type="text"
                    placeholder="Nom complet"
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </motion.div>
            )}

            {modePaiement === "PayPal" && (
              <motion.div
                key="paypal"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 border rounded p-4 bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Informations PayPal</h3>

                {/* Email PayPal */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Adresse Email PayPal</label>
                  <input
                    type="email"
                    placeholder="email@exemple.com"
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>



        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Création..." : "Créer la boutique"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}