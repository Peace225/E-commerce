import { supabase } from "../utils/supabaseClient";

// 1. Données Top Deals
const topDealsData = [
  { nom: "Four électrique Royal FEB 36", description: "Four compact 36L avec minuterie et chaleur tournante.", prix: 59900, old_price: 79900, commission: 1000, discount: "-25%", img: "/images/topdeals/four.jpg", categorie: "Électroménager", marque: "Royal", type: "top-deal" },
  { nom: "Tajine 30cm GRANITE", description: "Revêtement antiadhésif haute résistance.", prix: 14400, old_price: 21000, commission: 1000, discount: "-31%", img: "/images/topdeals/tajine.jpg", categorie: "Maison, cuisine & bureau", marque: "Granite", type: "top-deal" },
  { nom: "Égouttoir Vaisselle", description: "Design moderne en acier inoxydable durable.", prix: 31600, old_price: 55000, commission: 1000, discount: "-43%", img: "/images/topdeals/1.jpg", categorie: "Maison, cuisine & bureau", marque: "Inox", type: "top-deal" },
  { nom: "Lot de 6 bocaux en verre", description: "Idéal pour conserver aliments et épices.", prix: 8700, old_price: 13900, commission: 1000, discount: "-37%", img: "/images/topdeals/egouttoir.jpg", categorie: "Maison, cuisine & bureau", marque: "Verrerie", type: "top-deal" },
  { nom: "Montre Tactile Oraimo HD", description: "Écran HD, suivi santé et notifications.", prix: 32800, old_price: 45000, commission: 1000, discount: "-27%", img: "/images/topdeals/montre.jpg", categorie: "Téléphones", marque: "Oraimo", type: "top-deal" },
  { nom: "Hamac en coton multicolore", description: "Confortable et résistant pour extérieur.", prix: 9600, old_price: 10900, commission: 1000, discount: "-12%", img: "/images/topdeals/hamac.jpg", categorie: "Sports & Loisirs", marque: "Cotonou", type: "top-deal" },
  { nom: "Sèche-cheveux professionnel 3000W", description: "Puissance élevée avec contrôle thermique.", prix: 19500, old_price: 29900, commission: 1000, discount: "-35%", img: "/images/topdeals/seche.jpg", categorie: "Beauté & Santé", marque: "ProHair", type: "top-deal" },
  { nom: "Machine à café portable USB", description: "Prépare votre café partout, rechargeable.", prix: 19900, old_price: 28900, commission: 1000, discount: "-31%", img: "/images/topdeals/machine.jpg", categorie: "Électroménager", marque: "CoffeeGo", type: "top-deal" },
  { nom: "Balance électronique cuisine", description: "Mesure précise jusqu'à 5kg.", prix: 7900, old_price: 11000, commission: 1000, discount: "-28%", img: "/images/topdeals/balance.jpg", categorie: "Maison, cuisine & bureau", marque: "ScalePro", type: "top-deal" },
  { nom: "Brosse lissante chauffante", description: "Lissage rapide et sans frisottis.", prix: 14900, old_price: 23900, commission: 1000, discount: "-38%", img: "/images/topdeals/brosse.jpg", categorie: "Beauté & Santé", marque: "Beauty", type: "top-deal" }
];

// 2. Données Ventes Flash
const ventesFlashData = [
  { nom: "Voiture Nissan Qashqai", description: "Nissan Qashqai 2018, excellent état, automatique.", prix: 4500000, old_price: 7000000, commission: 50000, discount: "-35%", img: "/images/ventesflash/voiture.jpg", categorie: "Automobile", marque: "Nissan", type: "flash", stock_total: 10, stock_restant: 4 },
  { nom: "Terrain à vendre à Abidjan", description: "Terrain 500m² avec ACD à Angré.", prix: 15000000, old_price: 20000000, commission: 100000, discount: "-25%", img: "/images/ventesflash/1.jpg", categorie: "Immobilier", marque: "Rynek Immo", type: "flash", stock_total: 5, stock_restant: 1 },
  { nom: "Logitech G305 Souris Gaming", description: "Souris gaming sans fil ultra légère.", prix: 25000, old_price: 45000, commission: 2000, discount: "-44%", img: "/images/ventesflash/sourir.jpg", categorie: "Informatique", marque: "Logitech", type: "flash", stock_total: 20, stock_restant: 3 },
  { nom: "Logitech MK270 Combo", description: "Clavier et souris sans fil fiable.", prix: 18000, old_price: 30000, commission: 1500, discount: "-40%", img: "/images/ventesflash/log.jpg", categorie: "Informatique", marque: "Logitech", type: "flash", stock_total: 30, stock_restant: 18 },
  { nom: "Logitech Signature M650", description: "Défilement intelligent et clics silencieux.", prix: 22000, old_price: 35000, commission: 1500, discount: "-38%", img: "/images/ventesflash/m650.jpg", categorie: "Informatique", marque: "Logitech", type: "flash", stock_total: 15, stock_restant: 2 },
  { nom: "Logitech MK120 Combo", description: "Ensemble filaire robuste et confortable.", prix: 8900, old_price: 14200, commission: 1000, discount: "-38%", img: "/images/ventesflash/logitech.jpg", categorie: "Informatique", marque: "Logitech", type: "flash", stock_total: 80, stock_restant: 42 },
  { nom: "Logitech M171 Wireless", description: "Souris sans fil compacte et colorée.", prix: 9900, old_price: 15800, commission: 1000, discount: "-38%", img: "/images/ventesflash/clavier.jpg", categorie: "Informatique", marque: "Logitech", type: "flash", stock_total: 10, stock_restant: 3 }
];

// 3. Données Boutique Adidas
const adidasData = [
  { nom: "Adidas Claquette Eezay", description: "Claquette confortable pour l'été et la piscine.", prix: 78000, old_price: 196000, commission: 1000, discount: "-60%", img: "/images/adidas/claquette.jpg", categorie: "Vêtements & Chaussures", marque: "Adidas", type: "boutique", en_stock: true },
  { nom: "Adidas Chaussure Litecourt", description: "Chaussure de sport légère, idéale pour le tennis.", prix: 324000, old_price: 531000, commission: 1000, discount: "-39%", img: "/images/adidas/Litecourt.jpg", categorie: "Vêtements & Chaussures", marque: "Adidas", type: "boutique", en_stock: true },
  { nom: "Adidas Chaussure Lite Rose", description: "Sneakers de sport pour femme au design épuré.", prix: 252000, old_price: 413000, commission: 1000, discount: "-39%", img: "/images/adidas/lite-rose.jpg", categorie: "Vêtements & Chaussures", marque: "Adidas", type: "boutique", en_stock: true },
  { nom: "Adidas Chaussure Tensas", description: "Chaussures confortables pour le quotidien.", prix: 215000, old_price: 354000, commission: 1000, discount: "-39%", img: "/images/adidas/tensas.jpg", categorie: "Vêtements & Chaussures", marque: "Adidas", type: "boutique", en_stock: true },
  { nom: "Adidas Chaussure Response", description: "Chaussure de running performante et résistante.", prix: 416000, old_price: 682000, commission: 1000, discount: "-39%", img: "/images/adidas/response.jpg", categorie: "Vêtements & Chaussures", marque: "Adidas", type: "boutique", en_stock: true },
  { nom: "Adidas Chaussure Zero", description: "Légèreté absolue pour des courses rapides.", prix: 300000, old_price: 563000, commission: 1000, discount: "-47%", img: "/images/adidas/zero.jpg", categorie: "Vêtements & Chaussures", marque: "Adidas", type: "boutique", en_stock: true }
];

// 4. Données Climatisation
const climData = [
  { nom: "Samsung Climatiseur Mural", description: "Climatiseur silencieux et économique.", prix: 479900, old_price: 649900, commission: 47990, discount: "-26%", img: "/images/clim/samsung.jpg", categorie: "Électroménager", marque: "Samsung", type: "clim", en_stock: true },
  { nom: "Unio Climatiseur 12000 BTU", description: "Refroidissement rapide 12000 BTU.", prix: 370000, old_price: null, commission: 37000, discount: "", img: "/images/clim/unio.jpg", categorie: "Électroménager", marque: "Unio", type: "clim", en_stock: true },
  { nom: "Taurus AC 293 KT Mobile", description: "Climatiseur mobile facile à déplacer.", prix: 369900, old_price: 599900, commission: 44388, discount: "-38%", img: "/images/clim/taurus.jpg", categorie: "Électroménager", marque: "Taurus", type: "clim", en_stock: true },
  { nom: "TCL Climatiseur Mural 9000 BTU", description: "Idéal pour les petites pièces.", prix: 345500, old_price: 429000, commission: 34550, discount: "-18%", img: "/images/clim/tcl.jpg", categorie: "Électroménager", marque: "TCL", type: "clim", en_stock: true },
  { nom: "Infinition Climatiseur Split", description: "Design moderne et purification d'air.", prix: 419000, old_price: 499000, commission: 33520, discount: "-16%", img: "/images/clim/infinition.jpg", categorie: "Électroménager", marque: "Infinition", type: "clim", en_stock: true },
  { nom: "LG Climatiseur DUALCOOL", description: "Technologie Dual Inverter pour plus d'économies.", prix: 499100, old_price: 675000, commission: 74865, discount: "-26%", img: "/images/clim/lg.jpg", categorie: "Électroménager", marque: "LG", type: "clim", en_stock: true }
];

// 5. Données Déstockage
const destockageData = [
  { nom: "Congélateur Horizontal", description: "Grande capacité, liquidation fin de série.", prix: 185000, old_price: 245000, commission: 5000, discount: "-24%", img: "/images/destockage/congelateur.jpg", categorie: "Électroménager", marque: "Siera", type: "destockage", en_stock: true },
  { nom: "Presse à Agrumes", description: "Modèle expo, parfait état de marche.", prix: 12500, old_price: 19900, commission: 1000, discount: "-37%", img: "/images/destockage/presse.jpg", categorie: "Maison, cuisine & bureau", marque: "Pro", type: "destockage", en_stock: true },
  { nom: "Redmi Watch 3 Active", description: "Montre connectée, emballage légèrement abîmé.", prix: 35000, old_price: 45000, commission: 1500, discount: "-22%", img: "/images/destockage/redmiwatch.jpg", categorie: "Téléphones", marque: "Xiaomi", type: "destockage", en_stock: true },
  { nom: "Réfrigérateur Revo", description: "Design moderne, dernière unité en stock.", prix: 215000, old_price: 299000, commission: 7000, discount: "-28%", img: "/images/destockage/revo.jpg", categorie: "Électroménager", marque: "Revo", type: "destockage", en_stock: true },
  { nom: "Split Siera 1.5 CV", description: "Climatiseur haute performance, prix sacrifié.", prix: 165000, old_price: 220000, commission: 5000, discount: "-25%", img: "/images/destockage/siera.jpg", categorie: "Électroménager", marque: "Siera", type: "destockage", en_stock: true },
  { nom: "Machine à laver Washer", description: "Chargement frontal, fin de stock magasin.", prix: 195000, old_price: 265000, commission: 6000, discount: "-26%", img: "/images/destockage/washer.jpg", categorie: "Électroménager", marque: "Washer", type: "destockage", en_stock: true }
];

export default function SupabaseSeeder() {
  
  const seedData = async (data, successMessage) => {
    try {
      const { error } = await supabase.from('produits').insert(data);
      if (error) throw error;
      alert(successMessage);
    } catch (err) { 
      alert("Erreur : " + err.message); 
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-white text-center rounded-3xl m-4 border-2 border-slate-700 shadow-2xl">
      <h3 className="font-black mb-6 uppercase tracking-widest text-xl text-white">⚙️ Injection Base de Données Rynek</h3>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <button onClick={() => seedData(topDealsData, "✅ Top Deals ajoutés !")} className="bg-orange-600 px-6 py-3 rounded-xl font-black uppercase hover:bg-orange-700 active:scale-95 shadow-lg">
          🚀 Top Deals
        </button>

        <button onClick={() => seedData(ventesFlashData, "🔥 Ventes Flash ajoutées !")} className="bg-red-600 px-6 py-3 rounded-xl font-black uppercase hover:bg-red-700 active:scale-95 shadow-lg">
          🔥 Ventes Flash
        </button>

        <button onClick={() => seedData(adidasData, "👟 Produits Adidas ajoutés !")} className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase hover:bg-gray-200 active:scale-95 shadow-lg">
          👟 Adidas
        </button>

        <button onClick={() => seedData(climData, "❄️ Climatiseurs ajoutés !")} className="bg-blue-600 px-6 py-3 rounded-xl font-black uppercase hover:bg-blue-700 active:scale-95 shadow-lg">
          ❄️ Climatisation
        </button>

        <button onClick={() => seedData(destockageData, "⚠️ Déstockage ajouté !")} className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-black uppercase hover:bg-yellow-400 active:scale-95 shadow-lg">
          ⚠️ Déstockage
        </button>
      </div>

      <p className="mt-6 text-xs text-slate-400">🚨 Attention : Cliquez une seule fois sur chaque bouton pour éviter d'avoir des produits en double dans Supabase.</p>
    </div>
  );
}