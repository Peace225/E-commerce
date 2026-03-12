// src/components/AdvancedKpi.jsx
import { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export default function AdvancedKpi() {
  const [kpis, setKpis] = useState([]);
  
  useEffect(() => {
    const fetchKPIs = async () => {
      const ventesSnap = await getDocs(collection(db, "ventes"));
      const ventes = ventesSnap.docs.map(doc => doc.data());

      // Exemples de KPIs calculés
      const totalVentes = ventes.length;
      const revenus = ventes.reduce((acc, v) => acc + (v.montant || 0), 0);
      const panierMoyen = totalVentes ? (revenus / totalVentes).toFixed(2) : 0;

      setKpis([
        { name: "Total ventes", value: totalVentes },
        { name: "Revenus totaux", value: revenus + " FCFA" },
        { name: "Panier moyen", value: panierMoyen + " FCFA" },
      ]);
    };

    fetchKPIs();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-8">
      <h2 className="text-lg font-semibold text-green-600 mb-4">Analyse avancée (IA légère)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="text-center">
            <h4 className="text-sm text-gray-400">{kpi.name}</h4>
            <p className="text-2xl font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}