
import { supabase } from "../utils/supabaseClient"; // On utilise Supabase pour écrire

export default function MigrateData() {
  const transferer = async () => {
    try {
      console.log("Début de la migration...");
      
      // 1. Lire les produits sur Firebase
      const snap = await getDocs(collection(db, "produits"));
      const data = snap.docs.map(doc => {
        const d = doc.data();
        return {
          nom: d.nom || d.name,
          description: d.description || "",
          prix: parseFloat(d.prix) || 0,
          old_price: d.oldPrice ? parseFloat(d.oldPrice) : null,
          commission: d.commission ? parseFloat(d.commission) : 0,
          discount: d.discount || "",
          img: d.img || d.imageUrl || "",
          categorie: d.categorie,
          marque: d.marque,
          type: d.type || "normal"
        };
      });

      // 2. Envoyer vers Supabase
      const { error } = await supabase.from('produits').insert(data);
      
      if (error) throw error;
      
      alert("🚀 Rynek est prêt ! Tes 130 produits sont sur Supabase.");
    } catch (err) {
      alert("Erreur pendant la migration : " + err.message);
    }
  };

  return (
    <div className="p-4 m-4 bg-purple-700 text-white rounded-xl shadow-2xl text-center">
      <h2 className="font-black mb-2 uppercase italic">Migration vers le futur 🚀</h2>
      <button 
        onClick={transferer}
        className="bg-white text-purple-700 px-8 py-3 rounded-full font-black hover:bg-gray-100 transition-all active:scale-95"
      >
        Lancer le transfert vers Supabase
      </button>
    </div>
  );
}