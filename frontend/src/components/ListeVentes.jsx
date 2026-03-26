import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function ListeVentes() {
  const [ventes, setVentes] = useState([]);

  useEffect(() => {
    const fetchVentes = async () => {
      try {
        const ventesRef = collection(db, "ventes");
        const ventesQuery = query(ventesRef, orderBy("date", "desc"));
        const ventesSnap = await getDocs(ventesQuery);

        const ventesData = ventesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVentes(ventesData);
      } catch (error) {
        console.error("Erreur lors du chargement des ventes :", error);
      }
    };

    fetchVentes();
  }, []);

  if (ventes.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Aucune vente enregistrée pour le moment.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-center text-green-600">Historique des Ventes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border rounded-lg shadow">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Produit</th>
              <th className="px-4 py-2 text-left">Plateforme</th>
              <th className="px-4 py-2 text-left">Montant (FCFA)</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {ventes.map((vente) => (
              <tr key={vente.id} className="border-t">
                <td className="px-4 py-2">{vente.produit}</td>
                <td className="px-4 py-2">{vente.plateforme}</td>
                <td className="px-4 py-2">{vente.montant}</td>
                <td className="px-4 py-2">
                  {vente.date?.toDate
                    ? dayjs(vente.date.toDate()).format("DD/MM/YYYY HH:mm")
                    : "Date inconnue"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}