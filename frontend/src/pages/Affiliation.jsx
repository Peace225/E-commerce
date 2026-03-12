import { Link } from "react-router-dom";
import { ShoppingCart, Share2, ShieldCheck, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function Affiliation() {
  const images = [
    "/images/hero-ecommerce.jpg",
    "/images/hero-ecommerce1.jpg",
    "/images/hero-ecommerce2.jpg",
    "/images/hero-ecommerce3.jpg", // ajout de la 4e image
  ];

  const [current, setCurrent] = useState(0);
 // Changer l'image toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* HERO avec bannière */}
       <section
      className="relative py-20 md:py-28 text-white text-center px-6 bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${images[current]})` }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Bannière promo */}
      <div className="absolute top-0 left-0 right-0 bg-[#276ff5] py-2">
        <p className="text-sm md:text-base text-white font-semibold max-w-4xl mx-auto">
          🎁 Bonus de bienvenue : <span className="font-bold">100 points offerts</span> 
          à l’inscription + commissions sur chaque achat validé !
        </p>
      </div>

      {/* Contenu */}
      <div className="relative z-10 max-w-4xl mx-auto mt-4 md:mt-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight animate-fadeIn">
          Programme d’Affiliation & Parrainage
        </h1>

        <p className="text-base md:text-lg mb-6 md:mb-8 text-gray-200 animate-fadeIn delay-200">
          Gagnez des commissions sur les achats validés,
          obtenez des points via le partage des articles sur vos réseaux sociaux
          et parrainez vos proches grâce à votre code promo personnel.
        </p>

        <Link
          to="/register"
          className="bg-orange-500 hover:bg-orange-600 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg transition animate-fadeIn delay-400"
        >
          🚀 Devenir affilié
        </Link>
      </div>
    </section>

      {/* SYSTEME */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14">
          3 Sources de Revenus
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <ShoppingCart className="text-orange-500 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-3">
              Commission sur Achat
            </h3>
            <p className="text-gray-600">
              Gagnez un pourcentage sur chaque achat confirmé via votre lien.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <Share2 className="text-orange-500 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-3">
              Points via Partage
            </h3>
            <p className="text-gray-600">
              Partagez vos produits sur les réseaux sociaux
              et obtenez des points validés par l’algorithme.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <Users className="text-orange-500 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-3">
              Parrainage par Code Promo
            </h3>
            <p className="text-gray-600">
              Invitez vos proches avec votre code personnel
              et gagnez un bonus sur leurs achats validés.
            </p>
          </div>

        </div>
      </section>

      {/* SECURITE */}
      <section className="bg-gray-100 py-20 px-6 text-center">
        <ShieldCheck className="mx-auto text-orange-500 w-16 h-16 mb-6" />
        <h2 className="text-3xl font-bold mb-6">
          Système sécurisé avancé
        </h2>

        <p className="max-w-3xl mx-auto text-gray-600">
          Détection automatique des faux comptes,
          multi-inscriptions, achats suspects et trafics malveillants.
          Système équitable et transparent basé sur l’analyse comportementale.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-6">
          Activez votre code promo dès maintenant
        </h2>

        <Link
          to="/register"
          className="bg-white text-orange-600 px-10 py-4 rounded-full font-semibold shadow hover:bg-gray-100 transition"
        >
          Créer mon compte
        </Link>
      </section>

    </div>
  );
}
