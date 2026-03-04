import { motion } from "framer-motion";
import Banner from "../../assets/banner.webp";

const Subscribe = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-[100px] md:h-[300px] flex items-center justify-center"
      style={{ backgroundImage: `url(${Banner})` }}
      aria-label="Bannière d'inscription à la newsletter"
    >
      {/* Overlay sombre pour une meilleure lisibilité */}
      <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden="true"></div>

      {/* Contenu animé */}
      <motion.div
        className="relative z-10 text-center text-white px-4 py-6 w-full max-w-xl bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
          Restez informé de nos nouveautés
        </h1>
        <p className="mt-2 text-gray-300 text-xs md:text-sm">
          Abonnez-vous à notre newsletter pour recevoir nos offres exclusives et découvrir en avant-première nos nouveaux produits.
        </p>

        {/* Champ d'inscription */}
        <form className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2">
          <input
            type="email"
            placeholder="Votre email"
            className="w-full sm:w-64 px-3 py-2 rounded-md border-none text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300"
          >
            S'abonner
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Subscribe;
