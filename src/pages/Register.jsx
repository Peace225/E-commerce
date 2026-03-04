import { useState, useEffect } from "react";
// 👈 1. Ajout de sendEmailVerification
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth"; 
import { auth, db } from "../utils/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import AlertMessage from "../components/AlertMessage";
import { ShoppingBag, Store, MessageCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🎛️ États Généraux
  const [accountType, setAccountType] = useState("client"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState(""); 
  const [refCode, setRefCode] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);

  // 👤 États Spécifiques CLIENT
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  // 🏪 États Spécifiques VENDEUR
  const [nomBoutique, setNomBoutique] = useState("");
  const [categorieBoutique, setCategorieBoutique] = useState("");

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) setRefCode(refFromUrl);
  }, [searchParams]);

  const generateReferralCode = (identifier) => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return identifier.replace(/\s+/g, '').slice(0, 4).toUpperCase() + random;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let displayNameFinal = "";
      let userData = {
        uid: user.uid,
        email: user.email,
        whatsapp: telephone,
        role: accountType,
        balance: 0,
        createdAt: serverTimestamp(),
      };

      if (accountType === "client") {
        displayNameFinal = `${prenom} ${nom}`;
        userData = {
          ...userData,
          nom: nom,
          prenom: prenom,
          displayName: displayNameFinal,
          panier: [],
          favoris: []
        };
      } else {
        displayNameFinal = nomBoutique;
        userData = {
          ...userData,
          nomBoutique: nomBoutique,
          categorieBoutique: categorieBoutique,
          displayName: displayNameFinal,
          referralCode: generateReferralCode(nomBoutique),
          statutBoutique: "en_attente",
          totalEarnings: 0,
        };
      }

      await updateProfile(user, { displayName: displayNameFinal });
      await setDoc(doc(db, "users", user.uid), userData);

      // 👈 2. ENVOI DU MAIL D'ACTIVATION
      await sendEmailVerification(user);

      // 👈 3. Message mis à jour pour prévenir l'utilisateur
      setAlert(`🎉 Compte créé ! Un email d'activation a été envoyé à ${email}.`);
      
      setTimeout(() => {
        navigate(accountType === "vendeur" ? "/dashboard" : "/mon-compte");
      }, 3000); // 👈 On laisse 3 secondes pour qu'il ait le temps de lire le message

    } catch (error) {
      console.error("Firebase Auth Error:", error.code);
      setAlert("❌ Erreur lors de l'inscription : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Inscription - Rynek</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-lg">
          {alert && <AlertMessage message={alert} onClose={() => setAlert("")} />}

          <form onSubmit={handleRegister} className="bg-white shadow-2xl p-8 rounded-[2.5rem] space-y-6 border border-gray-100 font-['Inter',sans-serif]">
            
            <div className="text-center space-y-2 mb-8">
               <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Rejoindre Rynek</h1>
               <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">Sélectionnez votre type de compte</p>
            </div>

            {/* 🔘 SÉLECTEUR DE COMPTE */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setAccountType("client")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  accountType === "client" ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-100 bg-white text-gray-400 hover:bg-gray-50"
                }`}>
                <ShoppingBag size={28} className="mb-2" />
                <span className="text-xs font-black uppercase tracking-widest">Acheteur</span>
              </button>

              <button type="button" onClick={() => setAccountType("vendeur")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  accountType === "vendeur" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-white text-gray-400 hover:bg-gray-50"
                }`}>
                <Store size={28} className="mb-2" />
                <span className="text-xs font-black uppercase tracking-widest">Vendeur Pro</span>
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              
              {/* 🟢 CHAMPS CLIENT */}
              {accountType === "client" && (
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" required placeholder="Prénom" 
                    className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-medium text-sm"
                    onChange={(e) => setPrenom(e.target.value)} />
                  <input type="text" required placeholder="Nom" 
                    className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-medium text-sm"
                    onChange={(e) => setNom(e.target.value)} />
                </div>
              )}

              {/* 🔵 CHAMPS VENDEUR */}
              {accountType === "vendeur" && (
                <div className="space-y-4">
                  <input type="text" required placeholder="Nom de la Boutique (Ex: Mon Shop)" 
                    className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-sm"
                    onChange={(e) => setNomBoutique(e.target.value)} />
                  
                  <select required className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-sm text-gray-600"
                    onChange={(e) => setCategorieBoutique(e.target.value)}>
                    <option value="">Sélectionnez votre secteur...</option>
                    <option value="alimentation">Restauration / Alimentation</option>
                    <option value="automobile">Automobile / Transport</option>
                    <option value="electronique">Électronique & High-Tech</option>
                    <option value="mode">Mode & Beauté</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              )}

              {/* 🟢 CHAMP WHATSAPP */}
              <div className="relative">
                <MessageCircle className={`absolute left-4 top-1/2 -translate-y-1/2 ${accountType === "client" ? "text-green-500" : "text-blue-500"}`} size={20} />
                <input type="tel" required placeholder="Numéro WhatsApp (Ex: 0102030405)"
                  className={`w-full border-2 border-gray-50 py-4 pr-4 pl-12 rounded-2xl focus:ring-4 transition-all outline-none font-medium text-sm ${accountType === "client" ? "focus:ring-orange-500/10 focus:border-orange-500" : "focus:ring-blue-500/10 focus:border-blue-500"}`}
                  onChange={(e) => setTelephone(e.target.value)} />
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-2 ml-2 tracking-tighter">
                  {accountType === "client" ? "Utilisé pour le suivi de vos livraisons." : "Utilisé pour vous contacter en cas de vente."}
                </p>
              </div>

              {/* ⚪ CHAMPS COMMUNS */}
              <input type="email" required placeholder="Adresse Email"
                className={`w-full border-2 border-gray-50 p-4 rounded-2xl focus:ring-4 transition-all outline-none font-medium text-sm ${accountType === "client" ? "focus:ring-orange-500/10 focus:border-orange-500" : "focus:ring-blue-500/10 focus:border-blue-500"}`}
                onChange={(e) => setEmail(e.target.value)} />

              <input type="password" required placeholder="Mot de passe"
                className={`w-full border-2 border-gray-50 p-4 rounded-2xl focus:ring-4 transition-all outline-none font-medium text-sm ${accountType === "client" ? "focus:ring-orange-500/10 focus:border-orange-500" : "focus:ring-blue-500/10 focus:border-blue-500"}`}
                onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-4 ${
                accountType === "client" ? "bg-orange-600 hover:bg-orange-700 shadow-orange-600/20" : "bg-blue-700 hover:bg-blue-800 shadow-blue-700/20"
              }`}
            >
              {loading ? "Création en cours..." : `Créer mon compte ${accountType}`}
            </button>
            
            <p className="text-center text-xs text-gray-500 font-bold uppercase tracking-tighter pt-4">
              Déjà membre ? <Link to="/login" className="text-gray-900 hover:underline">Se connecter</Link>
            </p>

          </form>
        </div>
      </div>
    </>
  );
}