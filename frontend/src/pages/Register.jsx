import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth"; 
import { auth } from "../utils/firebaseConfig"; // On retire 'db' pour passer par l'API
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

  // 👤 États Spécifiques CLIENT / VENDEUR
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nomBoutique, setNomBoutique] = useState("");
  const [categorieBoutique, setCategorieBoutique] = useState("");

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) setRefCode(refFromUrl);
  }, [searchParams]);

  // 🔄 SYNCHRONISATION AVEC LE BACKEND RYNEK
  const syncWithBackend = async (firebaseUser, additionalData) => {
    try {
      const token = await firebaseUser.getIdToken();

      const response = await fetch('http://localhost:5000/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          ...additionalData
        })
      });

      const result = await response.json();

      if (response.ok) {
        setAlert(`🎉 Compte créé ! Un email d'activation a été envoyé.`);
        setTimeout(() => {
          navigate(accountType === "vendeur" ? "/dashboard" : "/mon-compte");
        }, 3000);
      } else {
        setAlert(result.error || "Erreur de synchronisation.");
      }
    } catch (error) {
      console.error("Erreur Backend:", error);
      setAlert("Le serveur Rynek est injoignable.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert("");

    try {
      // 1. Création dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Préparation des données spécifiques au rôle
      const displayNameFinal = accountType === "client" ? `${prenom} ${nom}` : nomBoutique;
      
      const payload = {
        role: accountType,
        whatsapp: telephone,
        displayName: displayNameFinal,
        referralCodeUsed: refCode, // Transmet le parrain s'il existe
        ...(accountType === "client" 
          ? { nom, prenom } 
          : { nomBoutique, categorieBoutique }
        )
      };

      // 3. Mise à jour du profil Firebase (pour l'affichage immédiat)
      await updateProfile(user, { displayName: displayNameFinal });

      // 4. Délégation de l'inscription à l'API (Gestion Wallet, Referral, Firestore)
      await syncWithBackend(user, payload);

      // 5. Envoi email de vérification
      await sendEmailVerification(user);

    } catch (error) {
      console.error("Erreur Inscription:", error.message);
      setAlert("❌ " + (error.code === 'auth/email-already-in-use' ? "Cet email est déjà utilisé." : error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Inscription Rynek | Acheteur ou Vendeur Pro</title>
        <meta name="description" content="Rejoignez Rynek. Créez votre compte client pour acheter ou votre compte vendeur pour booster vos ventes." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          {alert && <AlertMessage message={alert} onClose={() => setAlert("")} />}

          <form onSubmit={handleRegister} className="bg-white shadow-2xl p-5 sm:p-8 rounded-[2.5rem] space-y-6 border border-gray-100 font-['Inter',sans-serif]">
            
            <div className="text-center space-y-2 mb-6">
               <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter uppercase italic">RYNEK</h1>
               <p className="text-gray-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest italic">Choisissez votre profil</p>
            </div>

            {/* SÉLECTEUR DE TYPE DE COMPTE */}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setAccountType("client")}
                className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                  accountType === "client" ? "border-orange-500 bg-orange-50 text-orange-600 shadow-lg shadow-orange-500/10" : "border-gray-50 bg-white text-gray-400 opacity-60"
                }`}>
                <ShoppingBag size={24} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Acheteur</span>
              </button>

              <button type="button" onClick={() => setAccountType("vendeur")}
                className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                  accountType === "vendeur" ? "border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-600/10" : "border-gray-50 bg-white text-gray-400 opacity-60"
                }`}>
                <Store size={24} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Vendeur Pro</span>
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {/* Formulaire Dynamique */}
              {accountType === "client" ? (
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" required placeholder="Prénom" className="w-full border-2 border-gray-50 p-4 rounded-2xl text-sm outline-none focus:border-orange-500 transition-all" onChange={(e) => setPrenom(e.target.value)} />
                  <input type="text" required placeholder="Nom" className="w-full border-2 border-gray-50 p-4 rounded-2xl text-sm outline-none focus:border-orange-500 transition-all" onChange={(e) => setNom(e.target.value)} />
                </div>
              ) : (
                <div className="space-y-4">
                  <input type="text" required placeholder="Nom de la Boutique" className="w-full border-2 border-gray-50 p-4 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all" onChange={(e) => setNomBoutique(e.target.value)} />
                  <select required className="w-full border-2 border-gray-50 p-4 rounded-2xl text-sm outline-none focus:border-blue-500 text-gray-500" onChange={(e) => setCategorieBoutique(e.target.value)}>
                    <option value="">Catégorie Boutique...</option>
                    <option value="mode">Mode & Beauté</option>
                    <option value="high-tech">Électronique & High-Tech</option>
                    <option value="alimentation">Restauration / Alimentation</option>
                    <option value="automobile">Automobile</option>
                  </select>
                </div>
              )}

              <div className="relative">
                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="tel" required placeholder="WhatsApp (Suivi de commande)" className="w-full border-2 border-gray-50 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-gray-300 transition-all" onChange={(e) => setTelephone(e.target.value)} />
              </div>

              <input type="email" required placeholder="Email professionnel" className="w-full border-2 border-gray-50 p-4 rounded-2xl text-sm outline-none focus:border-gray-300 transition-all" onChange={(e) => setEmail(e.target.value)} />
              
              <input type="password" required placeholder="Mot de passe" className="w-full border-2 border-gray-50 p-4 rounded-2xl text-sm outline-none focus:border-gray-300 transition-all" onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all active:scale-95 disabled:opacity-50 ${
                accountType === "client" ? "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20" : "bg-blue-700 hover:bg-blue-800 text-white shadow-blue-700/20"
              }`}
            >
              {loading ? "Traitement..." : `Créer mon compte ${accountType}`}
            </button>

            <p className="text-center text-[10px] text-gray-400 font-bold uppercase pt-2">
              Déjà membre ? <Link to="/login" className="text-gray-900 hover:underline ml-1">Se connecter</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}