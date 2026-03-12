import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "Comment fonctionne la livraison ?",
      answer: "Nous livrons partout avec un délai moyen de 2 à 5 jours ouvrables."
    },
    {
      question: "Puis-je retourner un produit ?",
      answer: "Oui, vous avez 7 jours après réception pour demander un retour."
    },
    {
      question: "Comment devenir affilié ?",
      answer: "Inscrivez-vous puis accédez à votre tableau de bord pour obtenir votre lien affilié."
    },
    {
      question: "Quels sont les moyens de paiement ?",
      answer: "Carte bancaire, Mobile Money et autres solutions sécurisées."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        Foire Aux Questions ❓
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl shadow">
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center p-4 font-semibold text-left"
            >
              {faq.question}
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
