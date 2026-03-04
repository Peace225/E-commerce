import React from 'react';
import Img1 from "../../assets/sac00.png";
import Img2 from "../../assets/montre3.jpg";
import Img3 from "../../assets/sac03.png";
import Img4 from "../../assets/phone.jpeg";
import Img5 from "../../assets/images1.jpeg";
import { FaStar } from "react-icons/fa6";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    name: "Sac à Dos",
    description: "Un sac à dos élégant et robuste pour toutes vos aventures urbaines.",
    color: "Blanc",
    rating: 5.0,
    aosDelay: "0",
    aosAnimation: "fade-up"
  },
  {
    id: 2,
    img: Img2,
    name: "Montre en cuir",
    description: "Montre en cuir sophistiquée, idéale pour compléter votre look professionnel.",
    color: "Marron",
    rating: 4.5,
    aosDelay: "200",
    aosAnimation: "fade-down"
  },
  {
    id: 3,
    img: Img3,
    name: "Sac à Dos",
    description: "Sac à dos spacieux et confortable, parfait pour le quotidien.",
    color: "Noir",
    rating: 5.7,
    aosDelay: "400",
    aosAnimation: "zoom-in"
  },
  {
    id: 4,
    img: Img4,
    name: "Téléphone Samsung",
    description: "Smartphone Samsung performant avec des fonctionnalités innovantes.",
    color: "Noir",
    rating: 5.5,
    aosDelay: "600",
    aosAnimation: "flip-left"
  },
  {
    id: 5,
    img: Img5,
    name: "Montre",
    description: "Montre tendance et moderne pour un style unique.",
    color: "Rose",
    rating: 4.5,
    aosDelay: "800",
    aosAnimation: "flip-right"
  },
];

const Products = () => {
  return (
    <section className="mt-14 mb-12" aria-labelledby="products-heading">
      <div className="container px-4 sm:px-8">
        <header className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-yellow-500">
            Les Produits les plus vendus pour vous
          </p>
          <h1 id="products-heading" data-aos="fade-up" className="text-3xl font-bold">
            Produits
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Découvrez nos meilleurs produits avec les meilleures évaluations.
          </p>
        </header>
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-6">
            {ProductsData.map((product) => (
              <article
                key={product.id}
                data-aos={product.aosAnimation}
                data-aos-delay={product.aosDelay}
                className="space-y-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-[220px] text-center"
              >
                <figure>
                  <img
                    src={product.img}
                    alt={`Image de ${product.name} en couleur ${product.color}`}
                    className="h-[220px] w-full object-cover rounded-md"
                  />
                </figure>
                <div>
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                  <p className="text-sm text-gray-600">{product.color}</p>
                  <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                  <div className="flex items-center justify-center gap-1 text-yellow-400 mt-2">
                    <FaStar aria-hidden="true" />
                    <span className="text-gray-900 dark:text-gray-100">{product.rating}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Products;
