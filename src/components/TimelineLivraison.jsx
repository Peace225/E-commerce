import { motion } from "framer-motion";

const steps = [
  { id: 1, title: "Commande confirmée", description: "Votre commande a été confirmée avec succès." },
  { id: 2, title: "Expédiée", description: "Le fournisseur a expédié votre colis." },
  { id: 3, title: "En transit", description: "Votre colis est en route vers votre adresse." },
  { id: 4, title: "Livrée", description: "Vous avez reçu votre commande. Merci de votre confiance !" },
];

export default function TimelineLivraison({ currentStep = 1 }) {
  return (
    <div className="flex flex-col relative border-l-2 border-green-600 dark:border-green-400 pl-6 space-y-8">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="relative"
        >
          {/* Rond vert */}
          <div className={`absolute -left-4 top-1 w-4 h-4 rounded-full ${index + 1 <= currentStep ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`} />
          
          {/* Infos étapes */}
          <div>
            <h3 className={`font-semibold ${index + 1 <= currentStep ? "text-green-700 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
              {step.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}