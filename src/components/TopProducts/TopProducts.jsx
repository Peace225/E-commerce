import React, { useState } from 'react';
import Img1 from "../../assets/topProduct/sacref.png";
import Img2 from "../../assets/topProduct/image3.png";
import Img3 from "../../assets/topProduct/sacref1.png";
import Img4 from "../../assets/topProduct/sacados.jpg.webp";
import Img5 from "../../assets/topProduct/sac05.png";
import { FaStar, FaTag, FaPhone } from 'react-icons/fa6';

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Sac à Dos",
    description:
      "Optez pour l'élégance et la fonctionnalité avec ce sac à dos haut de gamme, parfait pour accompagner toutes vos aventures urbaines.",
    price: "FCFA8.500",
    phone: "+225 07 47 39 67 41",
  },
  {
    id: 2,
    img: Img2,
    title: "Samsung",
    description:
      "Découvrez la technologie de pointe avec ce smartphone Samsung, offrant performance et design pour une expérience inégalée.",
    price: "€399.99",
    phone: "+225 07 47 39 67 41",
  },
  {
    id: 3,
    img: Img3,
    title: "Sac à dos",
    description:
      "Exprimez votre style unique avec ce sac à dos moderne et robuste, conçu pour s'adapter à votre vie active.",
    price: "FCFA12.000",
    phone: "+225 07 47 39 67 41",
  },
  {
    id: 4,
    img: Img4,
    title: "Sac à Dos",
    description:
      "Découvrez la fusion parfaite entre style contemporain et praticité avec ce sac à dos, idéal pour les professionnels en mouvement.",
    price: "FCFA8.500",
    phone: "+225 07 47 39 67 41",
  },
  {
    id: 5,
    img: Img5,
    title: "Sac à dos",
    description:
      "Adoptez le confort et la durabilité avec ce sac à dos polyvalent, conçu pour vous accompagner dans toutes vos aventures quotidiennes.",
    price: "FCFA12.000",
    phone: "+225 07 47 39 67 41",
  },
];

const Modal = ({ product, onClose, onBuy, onAddToCart }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-label={`Détails du produit ${product.title}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="Fermer le popup"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <img
            src={product.img}
            alt={`Image de ${product.title} - produit de qualité`}
            className="w-64 h-auto object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
          {/* Description marketing */}
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">
            Profitez de cette offre exclusive et transformez votre quotidien grâce à un produit d'exception. Ne laissez pas passer cette opportunité !
          </p>
          <p className="text-lg font-semibold mb-2">
            <FaTag className="inline-block mr-2 text-green-600" />
            {product.price}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <FaPhone className="inline-block mr-2" />
            Contact : {product.phone}
          </p>
          <div className="flex gap-4">
            {/* Lors du clic sur "Acheter", on ouvre le mode paiement Mobile Money */}
            <button
              onClick={() => onBuy(product)}
              className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700"
            >
              Acheter
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700"
            >
              Ajouter au Panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({ product, onClose, onPay }) => {
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("");
  const [operator, setOperator] = useState("orange"); // Valeur par défaut : Orange Money

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Appel API simulé : adaptez l'URL et la logique selon votre backend
    try {
      const response = await fetch("/api/mobile-money-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          mobileMoneyNumber,
          operator, // "orange" ou "wave"
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert(`Paiement réussi pour ${product.title} via ${operator.toUpperCase()} !`);
        onPay();
      } else {
        alert(`Erreur de paiement : ${result.message}`);
      }
    } catch (error) {
      alert("Erreur lors du paiement. Veuillez réessayer.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-label={`Paiement Mobile Money pour ${product.title}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="Fermer le popup"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <img
            src={product.img}
            alt={`Image de ${product.title}`}
            className="w-64 h-auto object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
          <p className="text-lg font-semibold mb-2">{product.price}</p>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label
                htmlFor="mobileMoneyNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Numéro Mobile Money
              </label>
              <input
                type="tel"
                id="mobileMoneyNumber"
                placeholder="Entrez votre numéro"
                value={mobileMoneyNumber}
                onChange={(e) => setMobileMoneyNumber(e.target.value)}
                className="w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="operator"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Choisissez votre opérateur
              </label>
              <select
                id="operator"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="orange">Orange Money</option>
                <option value="wave">Wave</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition duration-300"
            >
              Payer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const TopProducts = () => {
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentProduct, setPaymentProduct] = useState(null);

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.title} a été ajouté au panier !`);
    closeModal();
  };

  const handleMobileMoneyPayment = (product) => {
    // Ferme le modal produit et ouvre le modal de paiement Mobile Money
    setPaymentProduct(product);
    setSelectedProduct(null);
  };

  const handlePaymentSuccess = () => {
    // Actions à réaliser après un paiement réussi
    setPaymentProduct(null);
  };

  return (
    <section className="mt-14 mb-12 px-4 sm:px-8" aria-labelledby="top-products-heading">
      <div className="container">
        <header className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Les Produits les mieux notés pour vous
          </p>
          <h1 id="top-products-heading" data-aos="fade-up" className="text-3xl font-bold">
            Les Meilleurs Produits
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Découvrez nos produits les plus appréciés et hautement notés.
          </p>
        </header>
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center">
            {ProductsData.map((data) => (
              <article
                key={data.id}
                className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[250px] p-6 text-center"
              >
                {/* Section Image agrandie */}
                <div className="h-[150px] flex justify-center">
                  <img
                    src={data.img}
                    alt={`Image de ${data.title} - illustration produit`}
                    className="w-[180px] h-auto object-cover rounded-md group-hover:scale-105 duration-300 drop-shadow-md"
                  />
                </div>
                {/* Section Détails */}
                <div className="mt-4">
                  <div className="flex justify-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <h2 className="text-lg font-bold mt-2">{data.title}</h2>
                  <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                    {data.description}
                  </p>
                  <button
                    className="bg-primary hover:scale-105 duration-300 text-white py-2 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-primary"
                    onClick={() => openModal(data)}
                    aria-label={`Commander ${data.title}`}
                  >
                    Commander Maintenant
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
      {/* Popup Modal Produit */}
      {selectedProduct && (
        <Modal
          product={selectedProduct}
          onClose={closeModal}
          onBuy={handleMobileMoneyPayment}
          onAddToCart={handleAddToCart}
        />
      )}
      {/* Popup Modal Paiement Mobile Money */}
      {paymentProduct && (
        <PaymentModal
          product={paymentProduct}
          onClose={() => setPaymentProduct(null)}
          onPay={handlePaymentSuccess}
        />
      )}
    </section>
  );
};

export default TopProducts;
