import React from 'react';
import logo from "../../assets/Logo-reference.png";
import { FaFacebook, FaInstagram, FaLinkedin, FaLocationArrow, FaMobileAlt } from 'react-icons/fa';

const FooterLinks = [
  { title: "Accueil", link: "/#" },
  { title: "A Propos", link: "/#apropos" },
  { title: "Contact", link: "/#contact" },
];

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-10 mt-auto">
      <div className="container mx-auto px-4">
        <div data-aos="zoom-in" className="grid md:grid-cols-3 pb-20 pt-5">
          {/* Informations de l'entreprise */}
          <div className="py-8 px-4">
            <h1 className="flex items-center gap-3 sm:text-lg text-lg font-bold text-justify mb-3 text-yellow-500">
              <img src={logo} alt="Logo Reference" className="max-w-[50px]" />
              Reference
            </h1>
            <p className="text-gray-300 text-sm">
              Découvrez nos solutions innovantes et notre expertise pour transformer vos projets en réalité. Faites confiance à Reference pour une qualité inégalée.
            </p>
          </div>

          {/* Liens du Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
            <div>
              <div className="py-8 px-4">
                <h2 className="sm:text-lg text-base font-bold text-justify mb-3 text-yellow-500">
                  Liens Importants
                </h2>
                <ul className="flex flex-col gap-2">
                  {FooterLinks.map((link) => (
                    <li
                      key={link.title}
                      className="cursor-pointer hover:text-yellow-500 hover:translate-x-1 duration-300 text-gray-200 text-sm"
                    >
                      <a href={link.link}>{link.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className="py-8 px-4">
                <h2 className="sm:text-lg text-base font-bold text-justify mb-3 text-yellow-500">
                  Liens
                </h2>
                <ul className="flex flex-col gap-2">
                  {FooterLinks.map((link) => (
                    <li
                      key={link.title}
                      className="cursor-pointer hover:text-yellow-500 hover:translate-x-1 duration-300 text-gray-200 text-sm"
                    >
                      <a href={link.link}>{link.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Liens sociaux et contact */}
            <div className="py-8 px-4">
              <div className="flex items-center gap-3 mt-6">
                <a href="#" aria-label="Instagram">
                  <FaInstagram className="text-2xl" />
                </a>
                <a href="#" aria-label="Facebook">
                  <FaFacebook className="text-2xl" />
                </a>
                <a href="#" aria-label="LinkedIn">
                  <FaLinkedin className="text-2xl" />
                </a>
              </div>
              <div className="mt-6">
                <address className="not-italic text-sm">
                  <div className="flex items-center gap-3">
                    <FaLocationArrow />
                    <p>Cocody, Côte d'Ivoire</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <FaMobileAlt />
                    <p>+225 07 47 39 67 41</p>
                  </div>
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section bas de page */}
      <div className="bg-gray-900 text-gray-400 py-4">
        <div className="container mx-auto px-4 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Reference. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
