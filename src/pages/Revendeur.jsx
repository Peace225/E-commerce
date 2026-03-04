import { Link } from "react-router-dom";
import { Truck, Store, DollarSign, ShieldCheck } from "lucide-react";

export default function Revendeur() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Devenir Revendeur RYNEK 🏪
        </h1>
        <p className="max-w-2xl mx-auto text-lg mb-6">
          Accédez à nos produits à prix grossiste et développez votre activité.
        </p>
        <Link
          to="/register"
          className="bg-white text-orange-500 px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition"
        >
          Devenir partenaire
        </Link>
      </section>

      {/* AVANTAGES */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi devenir revendeur ?
        </h2>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <DollarSign className="mx-auto mb-4 text-orange-500 w-10 h-10" />
            <h3 className="font-semibold mb-2">Prix Grossiste</h3>
            <p className="text-gray-600">
              Bénéficiez de marges importantes sur tous nos produits.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <Truck className="mx-auto mb-4 text-orange-500 w-10 h-10" />
            <h3 className="font-semibold mb-2">Livraison Rapide</h3>
            <p className="text-gray-600">
              Expédition rapide pour garantir votre satisfaction client.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <Store className="mx-auto mb-4 text-orange-500 w-10 h-10" />
            <h3 className="font-semibold mb-2">Dropshipping</h3>
            <p className="text-gray-600">
              Nous livrons directement à vos clients.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ShieldCheck className="mx-auto mb-4 text-orange-500 w-10 h-10" />
            <h3 className="font-semibold mb-2">Support dédié</h3>
            <p className="text-gray-600">
              Une équipe dédiée pour vous accompagner.
            </p>
          </div>
        </div>
      </section>

      {/* CONDITIONS */}
      <section className="bg-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Conditions pour devenir revendeur
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-6">
          - Avoir une activité commerciale <br />
          - Commander un minimum de stock <br />
          - Respecter nos conditions tarifaires
        </p>

        <Link
          to="/contact"
          className="bg-orange-500 text-white px-6 py-3 rounded-full shadow hover:bg-orange-600 transition"
        >
          Faire une demande
        </Link>
      </section>

    </div>
  );
}
