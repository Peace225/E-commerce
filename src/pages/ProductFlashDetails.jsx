import { useParams } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { ventesFlash } from "../components/VentesFlash"; 
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiTiktok } from "react-icons/si"; // ✅ TikTok corrigé

export default function ProductFlashDetails() {
  const { id } = useParams();
  const product = ventesFlash.find((p) => p.id === Number(id));

  const [zoom, setZoom] = useState(false);
  const [slide, setSlide] = useState(0);

  // 🔹 Avis fictifs
  const reviews = [
    { name: "Ali", rating: 5, comment: "Très bonne qualité 👍", img: "/images/avis/1.jpg" },
    { name: "Koffi", rating: 4, comment: "Produit conforme", img: "/images/avis/2.jpg" },
    { name: "Marie", rating: 5, comment: "Super produit", img: "/images/avis/3.jpg" },
  ];

  // 🔹 Slide automatique des avis
  useEffect(() => {
    if (!product) return;
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [product]);

  if (!product) return <div className="p-10">Produit introuvable</div>;

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
          <div className="mt-6 border-t pt-4 flex gap-3 justify-center">
            <button className="border w-10 h-10 rounded-full flex items-center justify-center">
              <FaFacebook className="w-5 h-5 text-blue-600" />
            </button>
            <button className="border w-10 h-10 rounded-full flex items-center justify-center">
              <FaInstagram className="w-5 h-5 text-pink-500" />
            </button>
            <button className="border w-10 h-10 rounded-full flex items-center justify-center">
              <SiTiktok className="w-5 h-5 text-black" />
            </button>
            <button className="border w-10 h-10 rounded-full flex items-center justify-center">
              <FaWhatsapp className="w-5 h-5 text-green-500" />
            </button>
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="border-b my-4"></div>

          <div className="text-3xl font-bold">{product.price} FCFA</div>
          <div className="ml-3 line-through text-gray-400">{product.oldPrice} FCFA</div>
          <div className="ml-3 bg-orange-100 text-orange-600 px-2 py-1 rounded">{product.discount}</div>

          <p className="mt-4 text-gray-600">{product.description}</p>

          <p className="text-green-600 mt-3">Disponible</p>
          <p className="text-sm text-gray-600 mt-2">+ livraison à partir de <span className="font-semibold ml-1">1000 FCFA</span></p>

          <button className="mt-8 w-full bg-[#f68b1e] hover:bg-orange-600 text-white py-4 rounded font-bold text-lg shadow">
            🛒 Acheter maintenant
          </button>
        </div>

        {/* LIVRAISON & VENDEUR */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold mb-4">LIVRAISON & RETOURS</h3>

          <p className="text-sm mb-2">Choisissez le lieu</p>
          <select className="border w-full p-3 rounded mb-3">
            <option>Vallée du Bandama</option>
          </select>

          <select className="border w-full p-3 rounded mb-4">
            <option>Agence Bouake</option>
          </select>

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
            <p className="mt-2 font-semibold">FlashShop</p>
            <button className="mt-3 bg-[#f68b1e] text-white px-4 py-2 rounded">Suivre</button>
          </div>
        </div>
      </div>

      {/* AVIS CLIENTS SLIDE */}
      <div className="max-w-7xl mx-auto mt-6 px-4">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6">Avis des clients</h2>

          <div className="bg-gray-50 p-6 rounded text-center transition flex flex-col items-center gap-2">
            <img src={reviews[slide].img} alt={reviews[slide].name} className="w-16 h-16 rounded-full mx-auto" />
            <p className="font-bold text-lg">{reviews[slide].name}</p>
            <p className="text-xl mt-2">{"⭐".repeat(reviews[slide].rating)}</p>
            <p className="mt-2 text-gray-600">{reviews[slide].comment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}