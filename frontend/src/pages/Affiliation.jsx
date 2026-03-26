import { Link } from "react-router-dom";
import { ShoppingCart, Share2, ShieldCheck, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../../contexte/ThemeProvider"; // 🎨 Import du thème

export default function Affiliation() {
  const { currentTheme } = useTheme(); // 🔄 Récupération du thème actif

  const images = [
    "/images/hero-ecommerce.jpg",
    "/images/hero-ecommerce1.jpg",
    "/images/hero-ecommerce2.jpg",
    "/images/hero-ecommerce3.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-['Inter',sans-serif]">

      {/* HERO avec bannière dynamique */}
      <section
        className="relative py-20 md:py-28 text-white text-center px-6 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${images[current]})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        {/* 🎀 BANNIÈRE PROMO DYNAMIQUE (Couleur Primaire du Thème) */}
        <div className="absolute top-0 left-0 right-0 bg-primary py-2 transition-colors duration-500">
          <p className="text-sm md:text-base text-theme-text font-semibold max-w-4xl mx-auto px-4">
            {currentTheme?.id !== 'default' ? (
              <span>{currentTheme?.promoText}</span>
            ) : (
              <span>🎁 Bonus de bienvenue : <span className="font-bold">100 points offerts</span></span>
            )}
          </p>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto mt-4 md:mt-8">
          <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight animate-fadeIn uppercase italic tracking-tighter">
            Programme d’Affiliation <br /> & <span className="text-secondary transition-colors duration-500">Parrainage</span>
          </h1>

          <p className="text-base md:text-lg mb-6 md:mb-8 text-gray-200 animate-fadeIn delay-200 font-medium max-w-2xl mx-auto">
            Gagnez des commissions sur les achats validés et transformez vos réseaux sociaux en source de revenus avec Rynek.
          </p>

          <Link
            to="/register"
            className="bg-secondary hover:opacity-90 text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-lg transition-all active:scale-95 animate-fadeIn delay-400"
          >
            🚀 Devenir affilié
          </Link>
        </div>
      </section>

      {/* SYSTÈME DE REVENUS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-14 uppercase italic tracking-tighter">
          3 Sources de <span className="text-primary transition-colors duration-500">Revenus</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all group">
            <ShoppingCart className="text-primary w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-3">
              Commission sur Achat
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Gagnez jusqu'à <span className="text-primary font-bold">10%</span> sur chaque achat confirmé via votre lien unique.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all group">
            <Share2 className="text-primary w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-3">
              Points via Partage
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Obtenez des points de fidélité pour chaque clic généré sur vos partages sociaux validés par Rynek.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all group">
            <Users className="text-primary w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-3">
              Code Promo Personnel
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Parrainez vos proches avec votre code. Ils reçoivent un cadeau, vous recevez un bonus cash.
            </p>
          </div>
        </div>
      </section>

      {/* SÉCURITÉ */}
      <section className="bg-gray-100/50 py-20 px-6 text-center border-y border-gray-200">
        <ShieldCheck className="mx-auto text-primary w-16 h-16 mb-6 transition-colors duration-500" />
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6">
          Système sécurisé <span className="text-gray-400">avancé</span>
        </h2>
        <p className="max-w-3xl mx-auto text-gray-500 text-sm font-bold uppercase tracking-wide leading-loose">
          Détection automatique des faux comptes et trafics malveillants. 
          Un système équitable basé sur l’analyse comportementale pour protéger nos affiliés.
        </p>
      </section>

      {/* CTA FINAL DYNAMIQUE */}
      <section 
        className="py-20 text-center px-6 transition-colors duration-700"
        style={{ backgroundColor: currentTheme?.colors.primary }}
      >
        <h2 className="text-3xl font-black text-theme-text mb-8 uppercase italic tracking-tighter">
          Activez votre code promo <br className="md:hidden" /> dès maintenant
        </h2>

        <Link
          to="/register"
          className="bg-theme-text text-primary px-10 py-5 rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-105 transition-all inline-block"
        >
          Créer mon compte affilié
        </Link>
      </section>

    </div>
  );
}