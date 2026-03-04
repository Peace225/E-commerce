import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from "lucide-react";

export default function FooterQwikfy() {
  return (
    <footer className="bg-gray-800 text-gray-200 text-sm pt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">

        {/* Besoin d'aide */}
        <div>
          <h3 className="font-bold mb-3">BESOIN D'AIDE ?</h3>
          <ul className="space-y-1">
            <li><Link to="/contact">Discuter avec nous</Link></li>
            <li><Link to="/assistance">Centre d'assistance</Link></li>
            <li><Link to="/contact">Contactez-nous</Link></li>
          </ul>

          <h3 className="font-bold mt-6 mb-3">LIENS UTILES</h3>
          <ul className="space-y-1">
            <li><a href="tel:+23675000000">Commander par Tél: +236 75 00 00 00</a></li>
            <li><Link to="/acheter">Acheter sur Rynek</Link></li>
            <li><Link to="/bons-achat">Utiliser un Bon d'achat</Link></li>
            <li><Link to="/livraison">Modalités de Livraison</Link></li>
            <li><Link to="/retour-remboursement">Retour et Remboursement</Link></li>
            <li><Link to="/signaler-produit">Signaler un Produit</Link></li>
            <li><Link to="/litiges">Politique de Résolution des Litiges</Link></li>
            <li><Link to="/relais">Points de relais</Link></li>
          </ul>
        </div>

        {/* À propos */}
        <div>
          <h3 className="font-bold mb-3">À PROPOS</h3>
          <ul className="space-y-1">
            <li><Link to="/a-propos">Qui sommes-nous</Link></li>
            <li><Link to="/carrieres">Carrières chez Rynek</Link></li>
            <li><Link to="/cgu">Conditions Générales d'Utilisation</Link></li>
            <li><Link to="/confidentialite">Politique de Confidentialité</Link></li>
            <li><Link to="/cookies">Notification sur les cookies</Link></li>
            <li><Link to="/paiement">Information Paiement</Link></li>
            <li><Link to="/retours">Politique de Retours</Link></li>
            <li><Link to="/boutiques-officielles">Toutes les boutiques officielles</Link></li>
            <li><Link to="/ventes-flash">Ventes Flash</Link></li>
          </ul>
        </div>

        {/* Gagner avec Qwikfy */}
        <div>
          <h3 className="font-bold mb-3">GAGNEZ AVEC RYNEK</h3>
          <ul className="space-y-1">
            <li><Link to="/vendre">Vendez sur Rynek</Link></li>
            <li><Link to="/assistant-vendeur">Assistant vendeur</Link></li>
            <li><Link to="/consultant">Devenez consultant Rynek</Link></li>
            <li><Link to="/coupons">Coupons Nouveaux Clients</Link></li>
          </ul>

          <h3 className="font-bold mt-6 mb-3">RYNEK À L'INTERNATIONAL</h3>
          <ul className="space-y-1">
            <li>Maroc</li>
            <li>Côte d'Ivoire</li>
            <li>RCA</li>
            <li>Sénégal</li>
            <li>Togo</li>
          </ul>
        </div>

        {/* Newsletter & réseaux sociaux */}
        <div>
          <h3 className="font-bold mb-3">S'ABONNER AUX OFFRES</h3>
          <p className="mb-3 text-gray-400">Inscrivez-vous pour recevoir les meilleures offres RYNEK :</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Entrez votre adresse e-mail"
              className="w-full px-3 py-2 rounded-l bg-white text-gray-800"
            />
            <button className="bg-green-500 px-4 rounded-r text-white hover:bg-green-600">
              S'abonner
            </button>
          </div>
          <p className="text-xs mt-2 text-gray-500">
            En vous inscrivant, vous acceptez notre politique de confidentialité et cookies.
          </p>

          <h3 className="font-bold mt-6 mb-3">RETROUVEZ-NOUS</h3>
          <div className="flex gap-4 text-xl mt-2">
            <a href="https://www.qwikfy.com" target="_blank" rel="noreferrer" aria-label="Site Web">
              🌐
            </a>
            <a href="https://facebook.com/qwikfy" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/qwikfy" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://youtube.com/qwikfy" target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/qwikfy" target="_blank" rel="noreferrer" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/company/qwikfy" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center py-4 bg-gray-900 text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Rynek. Tous droits réservés.
      </div>
    </footer>
  );
}