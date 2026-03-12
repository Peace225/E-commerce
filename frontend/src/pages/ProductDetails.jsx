import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaInstagram } from "react-icons/fa"; // 🔥 importer les icônes
import { SiTiktok } from "react-icons/si";
const products = [
  { id:1, name:"Four électrique Royal FEB 36", 
    description:"Four compact 36L avec minuterie et chaleur tournante.", price:"599 FCFA", oldPrice:"799 FCFA", discount:"-25%", commission:"1000 FCFA", img:"/images/topdeals/four.jpg", seller:"Samishop", sizes:["L","XL","XXL"], reviews:[{name:"Ali",rating:5,comment:"Très bonne qualité 👍"},{name:"Koffi",rating:4,comment:"Produit conforme"},{name:"Marie",rating:5,comment:"Super produit"}]},
  { id:2, name:"Tajine 30cm GRANITE", description:"Revêtement antiadhésif haute résistance.", price:"144 FCFA", oldPrice:"210 FCFA", discount:"-31%", commission:"1000 FCFA", img:"/images/topdeals/tajine.jpg", seller:"Samishop", sizes:["S","M","L"], reviews:[{name:"Fatou",rating:5,comment:"Très pratique"},{name:"Jean",rating:4,comment:"Bonne qualité"}]},
  { id:3, name:"Égouttoir Vaisselle", description:"Design moderne en acier inoxydable durable.", price:"316 FCFA", oldPrice:"550 FCFA", discount:"-43%", commission:"1000 FCFA", img:"/images/topdeals/1.jpg", seller:"Samishop", sizes:["Standard"], reviews:[{name:"Ali",rating:4,comment:"Solide"},{name:"Marie",rating:5,comment:"Parfait"}]},
  { id:4, name:"Lot de 6 bocaux en verre", description:"Idéal pour conserver aliments et épices.", price:"87 FCFA", oldPrice:"139 FCFA", discount:"-37%", commission:"1000 FCFA", img:"/images/topdeals/egouttoir.jpg", seller:"Samishop", sizes:["250ml","500ml"], reviews:[{name:"Koffi",rating:5,comment:"Très utile"}]},
  { id:5, name:"Montre Tactile Oraimo HD", description:"Écran HD, suivi santé et notifications.", price:"328 FCFA", oldPrice:"450 FCFA", discount:"-27%", commission:"1000 FCFA", img:"/images/topdeals/montre.jpg", seller:"Samishop", sizes:["M"], reviews:[{name:"Ali",rating:5,comment:"Super design"}]},
  { id:6, name:"Hamac en coton multicolore", description:"Confortable et résistant pour extérieur.", price:"96 FCFA", oldPrice:"109 FCFA", discount:"-12%", commission:"1000 FCFA", img:"/images/topdeals/hamac.jpg", seller:"Samishop", sizes:["Unique"], reviews:[{name:"Marie",rating:4,comment:"Très confortable"}]},
  { id:7, name:"Sèche-cheveux professionnel 3000W", description:"Puissance élevée avec contrôle thermique.", price:"195 FCFA", oldPrice:"299 FCFA", discount:"-35%", commission:"1000 FCFA", img:"/images/topdeals/seche.jpg", seller:"Samishop", sizes:["Standard"], reviews:[{name:"Jean",rating:5,comment:"Top"}]},
  { id:8, name:"Machine à café portable USB", description:"Prépare votre café partout, rechargeable.", price:"199 FCFA", oldPrice:"289 FCFA", discount:"-31%", commission:"1000 FCFA", img:"/images/topdeals/machine.jpg", seller:"Samishop", sizes:["Standard"], reviews:[{name:"Ali",rating:5,comment:"Très pratique"}]},
  { id:9, name:"Balance électronique cuisine", description:"Mesure précise jusqu'à 5kg.", price:"79 FCFA", oldPrice:"110 FCFA", discount:"-28%", commission:"1000 FCFA", img:"/images/topdeals/balance.jpg", seller:"Samishop", sizes:["Standard"], reviews:[{name:"Koffi",rating:4,comment:"Précis"}]},
  { id:10, name:"Brosse lissante chauffante", description:"Lissage rapide et sans frisottis.", price:"149 FCFA", oldPrice:"239 FCFA", discount:"-38%", commission:"1000 FCFA", img:"/images/topdeals/brosse.jpg", seller:"Samishop", sizes:["Standard"], reviews:[{name:"Marie",rating:5,comment:"Super"}]}
];

export default function ProductDetails(){
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ref = queryParams.get("ref"); // 🔥 ID affilié depuis URL

  const product = products.find(p => p.id === Number(id));
  const [zoom,setZoom] = useState(false);
  const [size,setSize] = useState(product?.sizes[0] || "L");
  const [slide,setSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(()=>{
    if(!product) return;
    const timer = setInterval(()=> setSlide(prev => (prev+1)%product.reviews.length),3000);
    return ()=>clearInterval(timer);
  },[product]);

  if(!product) return <div className="p-10">Produit introuvable</div>;

  const handleShare = () => {
    const shareURL = `${window.location.origin}/product/${product.id}${ref ? `?ref=${ref}` : ""}`;
    navigator.clipboard.writeText(shareURL);
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-4">
        {/* IMAGE */}
        <div className="bg-white p-6 rounded shadow">
          <img
            src={product.img}
            alt={product.name}
            onClick={() => setZoom(!zoom)}
            className={`w-full h-[420px] object-contain cursor-pointer transition ${zoom ? "scale-125" : ""}`}
          />
          <p className="text-center text-sm text-gray-500 mt-2">Cliquez pour zoomer</p>

          {/* PARTAGE */}
          <div className="mt-6 border-t pt-4">
                <p className="font-semibold mb-3">PARTAGER</p>
                <div className="flex gap-3">
                         {/* Facebook */}
                    <button
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
                    >
                        <FaFacebookF />
                    </button>

                        {/* TikTok */}
                    <button
                        onClick={() => window.open(`https://www.tiktok.com/share/video?url=${window.location.href}`, "_blank")}
                        className="bg-black hover:bg-gray-800 text-white p-3 rounded-full"
                        >
                        <SiTiktok />
                    </button>

                        {/* Instagram */}
                    <button
                        onClick={() => window.open(`https://www.instagram.com/?url=${window.location.href}`, "_blank")}
                        className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full"
                    >
                    <FaInstagram />
                    </button>

                    {/* WhatsApp */}
                    <button
                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${window.location.href}`, "_blank")}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
                    >
                    <FaWhatsapp />
                    </button>
                </div>
            </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="flex items-center mt-2">⭐⭐⭐⭐☆<span className="ml-2 text-gray-500">({product.reviews.length} avis)</span></div>
          <div className="border-b my-4"></div>
          <div>
            <span className="text-3xl font-bold">{product.price}</span>
            <span className="ml-3 line-through text-gray-400">{product.oldPrice}</span>
            <span className="ml-3 bg-orange-100 text-orange-600 px-2 py-1 rounded">{product.discount}</span>
          </div>
          <div className="mt-4 bg-green-50 p-4 rounded">💰 Gagnez une commission :<span className="font-bold ml-2">{product.commission}</span></div>
          <p className="mt-4 text-gray-600">{product.description}</p>
          <p className="text-green-600 mt-3">Disponible</p>
          <p className="text-sm text-gray-600 mt-2">+ livraison à partir de <span className="font-semibold ml-1">1000 FCFA</span></p>

          {/* TAILLES */}
          <div className="mt-6">
            <p className="font-semibold mb-3">OPTIONS DISPONIBLES</p>
            <div className="flex gap-3">
              {product.sizes.map(s => (
                <button key={s} onClick={()=>setSize(s)} className={`border px-5 py-2 rounded ${size===s?"border-orange-500 bg-orange-50":""}`}>{s}</button>
              ))}
            </div>
          </div>

          <button className="mt-8 w-full bg-[#f68b1e] hover:bg-orange-600 text-white py-4 rounded font-bold text-lg shadow">🛒 Acheter maintenant</button>
        </div>

        {/* LIVRAISON & RETOURS */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold mb-4">LIVRAISON & RETOURS</h3>
          <p className="text-sm mb-2">Choisissez le lieu</p>
          <select className="border w-full p-3 rounded mb-3"><option>Vallée du Bandama</option></select>
          <select className="border w-full p-3 rounded mb-4"><option>Agence Bouake</option></select>

          <div className="border p-4 rounded mb-4">
            <p className="font-semibold">Point relais</p>
            <p>Frais livraison 500 FCFA</p>
            <p className="text-gray-500">Disponible sous 48h</p>
          </div>

          <div className="border p-4 rounded mb-4">
            <p className="font-semibold">Politique de retour</p>
            <p>Retours gratuits sous 10 jours</p>
          </div>

          <div className="border p-4 rounded">
            <p className="font-bold">INFORMATIONS VENDEUR</p>
            <p className="mt-2 font-semibold">{product.seller}</p>
            <button className="mt-3 bg-[#f68b1e] text-white px-4 py-2 rounded">Suivre</button>
          </div>
        </div>
      </div>

      {/* AVIS CLIENTS SLIDE */}
<div className="max-w-7xl mx-auto mt-6 px-4">
  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-xl font-bold mb-6">Avis des clients</h2>

    <div className="bg-gray-50 p-6 rounded text-center transition flex flex-col items-center">
      
      {/* Avatar client */}
      <img
        src={`https://i.pravatar.cc/100?img=${slide + 1}`} 
        alt={product.reviews[slide].name}
        className="w-16 h-16 rounded-full mb-3"
      />

      {/* Nom du client */}
      <p className="font-bold text-lg">{product.reviews[slide].name}</p>

      {/* Étoiles */}
      <p className="text-xl mt-2">{"⭐".repeat(product.reviews[slide].rating)}</p>

      {/* Commentaire */}
      <p className="mt-2 text-gray-600">{product.reviews[slide].comment}</p>
    </div>
  </div>
</div>
    </div>
  );
}