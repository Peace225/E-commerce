import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../utils/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export default function EditBoutiqueModal({ boutique, onClose, onUpdated }) {
  const [nom, setNom] = useState(boutique.nom || "");
  const [description, setDescription] = useState(boutique.description || "");
  const [logoFile, setLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(boutique.logoUrl || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    let updatedData = {
      nom,
      description,
    };

    try {
      if (logoFile) {
        const fileRef = ref(storage, `logos/${uuidv4()}-${logoFile.name}`);
        const snapshot = await uploadBytes(fileRef, logoFile);
        const url = await getDownloadURL(snapshot.ref);
        updatedData.logoUrl = url;
      }

      const docRef = doc(db, "boutiques", boutique.id);
      await updateDoc(docRef, updatedData);

      onUpdated(); // recharge les données
      onClose();   // ferme le modal
    } catch (err) {
      console.error("Erreur modification :", err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded shadow max-w-md w-full space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800">Modifier la boutique</h2>

        <input
          type="text"
          className="w-full border rounded p-2"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <label className="block text-sm text-gray-600 mb-1">Logo actuel :</label>
          {previewLogo ? (
            <img src={previewLogo} alt="Logo actuel" className="h-12 mb-2 rounded" />
          ) : (
            <span className="text-gray-400 italic text-sm">Aucun logo</span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setLogoFile(e.target.files[0]);
              setPreviewLogo(URL.createObjectURL(e.target.files[0]));
            }}
            className="w-full mt-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Mise à jour..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}