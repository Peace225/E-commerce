import React, { useState } from 'react';
import Image from "../../assets/sac03.png";
import Image2 from "../../assets/02.png";
import Image3 from "../../assets/sac06.png";
import Slider from "react-slick";

const ImageList = [
  {
    id: 1,
    img: Image,
    title: "Jusqu'à 50% de réduction",
    description: "Découvrez nos offres exceptionnelles avec jusqu'à 50% de réduction sur une sélection d'articles."
  },
  {
    id: 2,
    img: Image2,
    title: "Jusqu'à 30% de réduction",
    description: "Profitez de 30% de réduction sur notre collection spéciale. Offres limitées !"
  },
  {
    id: 3,
    img: Image3,
    title: "Jusqu'à 70% de réduction",
    description: "Ne manquez pas jusqu'à 70% de réduction sur des produits exclusifs, uniquement pour vous."
  },
];

const Modal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 flex justify-center pt-20 mt-20 items-center bg-black bg-opacity-50 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg relative max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="Fermer la fenêtre"
        >
          &times;
        </button>
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          Commandez Maintenant
        </h2>
        <p className="mb-4">
          Remplissez le formulaire ci-dessous pour passer votre commande ou contactez-nous pour plus d'informations.
        </p>
        {/* Exemple de formulaire de commande */}
        <form>
          <div className="mb-4">
            <label htmlFor="nom" className="block text-sm font-medium mb-1">
              Nom
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Votre nom"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Votre email"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full w-full"
          >
            Envoyer ma commande
          </button>
        </form>
      </div>
    </div>
  );
};

const Hero = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <section className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-start dark:bg-gray-950 dark:text-white duration-200 pt-20">
      {/* Background Pattern */}
      <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-10"></div>

      {/* Contenu principal */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data, index) => (
            <div key={data.id || index}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* Section Texte */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1
                    className="text-4xl sm:text-6xl lg:text-7xl font-bold"
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                  >
                    {data.title}
                  </h1>
                  <p
                    className="text-sm"
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                  >
                    {data.description}
                  </p>
                  <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="300">
                    <button
                      onClick={handleOpenPopup}
                      className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                      title="Commandez Maintenant"
                    >
                      Commandez Maintenant
                    </button>
                  </div>
                </div>

                {/* Section Image */}
                <div className="order-1 sm:order-2 flex justify-center items-center">
                  <div className="relative z-10" data-aos="zoom-in" data-aos-once="true">
                    <img
                      src={data.img}
                      alt={`Promotion - ${data.title}`}
                      className="w-[250px] h-[300px] sm:h-[450px] sm:w-[450px] object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && <Modal onClose={handleClosePopup} />}
    </section>
  );
};

export default Hero;
