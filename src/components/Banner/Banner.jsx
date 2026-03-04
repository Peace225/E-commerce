import React from 'react';
import image from "../../assets/topProduct/sac.jpeg";
import { GrSecure } from 'react-icons/gr';
import { IoFastFood } from 'react-icons/io5';
import { GiFoodTruck } from 'react-icons/gi';

const Banner = () => {
  return (
    <section
      className="min-h-[550px] flex justify-center items-center py-12 sm:py-0"
      aria-label="Bannière Promotionnelle - Vente jusqu'à 50% de réduction"
    >
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Section Image */}
          <div data-aos="zoom-in">
            <img
              src={image}
              alt="Promotion - Sac de qualité avec réduction jusqu'à 50%"
              className="max-w-[400px] h-[350px] w-full mx-auto drop-shadow-[-10px_10px_12px_rgba(0,0,0,1)] object-cover"
            />
          </div>
          {/* Section Détails Texte */}
          <div className="flex flex-col justify-center gap-6 sm:pt-0">
            <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold">
              Vente jusqu'à 50% de réduction
            </h1>
            <p data-aos="fade-up" className="text-sm text-gray-500 tracking-wide leading-5">
              Découvrez des offres exceptionnelles qui transforment votre quotidien. Profitez d'une remise incroyable allant jusqu'à 50% sur nos produits phares et vivez l'expérience d'une qualité inégalée.
            </p>
            <div className="flex flex-col gap-4">
              <div data-aos="fade-up" className="flex items-center gap-4">
                <GrSecure className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400" />
                <p>Produit de qualité</p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
                <GiFoodTruck className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-orange-100 dark:bg-orange-400" />
                <p>Livraison rapide</p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
                <IoFastFood className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-orange-100 dark:bg-orange-400" />
                <p>Mode de paiement facile</p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
                <GiFoodTruck className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-orange-100 dark:bg-orange-400" />
                <p>Obtenez les meilleures offres</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
