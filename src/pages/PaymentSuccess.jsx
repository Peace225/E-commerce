import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import axios from "axios";
import confetti from "canvas-confetti";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const hasSent = useRef(false); // 🔥 Sécurité pour éviter les doublons

  const commandeId = searchParams.get("commandeId");
  const total = searchParams.get("total");

  useEffect(() => {
    // 1. Lancer les confettis
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#e96711", "#22c55e"] });

    // 2. Envoyer la commande au backend/fournisseur
    if (!hasSent.current) {
      envoyerCommande();
      hasSent.current = true;
    }
  }, []);

  const envoyerCommande = async () => {
    try {
      // 💡 Note : Remplace "/api/create-order" par ton URL réelle (Node.js ou Firebase Function)
      const response = await axios.post("/api/create-order", {
        orderId: commandeId,
        customerName: "Brad Serguei", // À récupérer dynamiquement si besoin
        address: {
          city: "Abidjan",
          addressLine: "Riviéra Palmeraie",
          phone: "+225 0700000000",
        },
        products: [
          { variantId: "cj-variant-id", quantity: 1 }
        ],
      });
      
      console.log("✅ Commande synchronisée :", response.data);
      setStatus("success");
    } catch (error) {
      console.error("🚨 Erreur synchro :", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-['Inter',sans-serif]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-gray-100"
      >
        {/* Icône dynamique selon le statut */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ${
          status === "error" ? "bg-red-100 text-red-500" : "bg-emerald-100 text-emerald-500"
        }`}>
          {status === "processing" && <Icons.Loader2 size={40} className="animate-spin" />}
          {status === "success" && <Icons.CheckCircle2 size={40} strokeWidth={3} />}
          {status === "error" && <Icons.AlertCircle size={40} />}
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">
          {status === "error" ? "Oups !" : "Merci !"}
        </h1>
        <p className="text-gray-500 font-bold text-xs mb-8 uppercase tracking-widest">
          {status === "processing" ? "Synchronisation en cours..." : "Commande confirmée"}
        </p>

        {/* RECAPITULATIF */}
        <div className="bg-gray-50 rounded-3xl p-6 mb-8 space-y-3 border border-gray-100">
          <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
            <span>ID Commande</span>
            <span className="text-gray-900">#{commandeId?.slice(-6).toUpperCase() || "INTERNE"}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
            <span>Total</span>
            <span className="text-orange-600 font-black">{total?.toLocaleString()} FCFA</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-8 font-medium italic">
          {status === "error" 
            ? "La commande est enregistrée, mais la synchro fournisseur a échoué. Notre équipe s'en occupe !" 
            : "Votre commande est en cours de traitement. Un agent Rynek Force vous contactera."}
        </p>

        <div className="space-y-3">
          <Link to="/" className="block w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-700 transition-all shadow-lg">
            Continuer mes achats
          </Link>
          <Link to="/dashboard" className="block w-full py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all">
            Suivre mon colis
          </Link>
        </div>
      </motion.div>
    </div>
  );
}