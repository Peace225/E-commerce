import { useState } from "react";

export default function BoutiqueForm({ onSubmit }) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nom, description });
    setNom("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Nom de la boutique"
        required
        className="border w-full p-2 rounded"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <textarea
        placeholder="Description"
        required
        className="border w-full p-2 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Créer la boutique
      </button>
    </form>
  );
}