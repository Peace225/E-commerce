import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import AlertMessage from "../components/AlertMessage";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  // 🔐 Redirection Intelligente selon le Rôle Rynek
  const redirectUser = async (uid, isGoogleAuth = false, googleUser = null) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        
        // Redirection basée sur les rôles Rynek
        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "vendeur") {
          navigate("/dashboard");
        } else {
          // Si c'est un client ou si le rôle n'est pas défini
          navigate("/mon-compte");
        }
      } else if (isGoogleAuth && googleUser) {
        // 🚀 GESTION D'UN NOUVEAU COMPTE GOOGLE
        // Si l'utilisateur se connecte avec Google pour la 1ère fois, on lui crée un doc client par défaut
        const cleanName = googleUser.email.split("@")[0];
        await setDoc(doc(db, "users", uid), {
          uid: uid,
          email: googleUser.email,
          displayName: googleUser.displayName || cleanName,
          role: "client",
          balance: 0,
          createdAt: serverTimestamp(),
          panier: [],
          favoris: []
        });
        navigate("/mon-compte");
      } else {
        // Cas d'erreur rare où le doc n'existe pas (inscription email buggée)
        setAlert("Erreur de profil. Veuillez contacter le support.");
      }
    } catch (error) {
      console.error("Erreur de redirection:", error);
      setAlert("Problème lors de la vérification de votre compte.");
    }
  };

  // 📩 Connexion Email
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await redirectUser(userCredential.user.uid);
    } catch (error) {
      console.error("Login Error:", error.code);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setAlert("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
      } else if (error.code === 'auth/user-not-found') {
        setAlert("Aucun compte trouvé avec cet email.");
      } else {
        setAlert("Une erreur est survenue lors de la connexion.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Connexion Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setAlert("");

    try {
      const result = await signInWithPopup(auth, provider);
      // On passe 'true' et les infos de l'utilisateur pour créer le doc s'il n'existe pas
      await redirectUser(result.user.uid, true, result.user);
    } catch (error) {
      console.error("Google Auth Error:", error.code);
      if (error.code !== 'auth/popup-closed-by-user') {
        setAlert("Erreur lors de la connexion avec Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion - Rynek</title>
        <meta name="description" content="Connectez-vous à votre compte Rynek pour suivre vos commandes ou gérer votre boutique." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 font-['Inter',sans-serif]">
        <div className="w-full max-w-md">

          {alert && <AlertMessage message={alert} onClose={() => setAlert("")} />}

          <form onSubmit={handleLogin} className="bg-white shadow-2xl p-8 rounded-[2.5rem] space-y-6 border border-gray-100">
            
            <div className="text-center space-y-2 mb-8">
               <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Bon Retour</h1>
               <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">Connectez-vous à Rynek</p>
            </div>

            <div className="space-y-4 pt-2">
              <input
                type="email"
                required
                placeholder="Adresse Email"
                className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-medium text-sm"
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Mot de passe"
                  className="w-full border-2 border-gray-50 p-4 pr-12 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-medium text-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/mot-de-passe-oublie" className="text-[10px] font-bold text-gray-400 hover:text-orange-500 uppercase tracking-widest transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-600/20 transition-all active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-4">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">ou avec</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-100 py-4 rounded-2xl transition-all font-bold text-sm text-gray-700 shadow-sm disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22">
                <path fill="#EA4335" d="M24 9.5c3.9 0 7.4 1.4 10.1 3.7l7.5-7.5C37.3 2.2 30.9 0 24 0 14.6 0 6.4 5.4 2.5 13.3l8.7 6.8C13.2 13.4 18.2 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.7-2 5-4.2 6.6l6.5 5.1c3.8-3.5 6-8.6 6-16.1z"/>
                <path fill="#4A90E2" d="M11.2 28.1c-.5-1.5-.8-3.1-.8-4.6s.3-3.1.8-4.6l-8.7-6.8C.9 15.5 0 19.6 0 24s.9 8.5 2.5 11.9l8.7-6.8z"/>
                <path fill="#FBBC05" d="M24 48c6.9 0 12.7-2.3 16.9-6.3l-6.5-5.1c-2 1.4-4.6 2.2-10.4 2.2-5.8 0-10.8-3.9-12.8-9.3l-8.7 6.8C6.4 42.6 14.6 48 24 48z"/>
              </svg>
              Continuer avec Google
            </button>

            <p className="text-center text-xs text-gray-500 font-bold uppercase tracking-tighter pt-4">
              Nouveau sur Rynek ?{" "}
              <Link to="/register" className="text-orange-600 hover:underline">
                Créer un compte
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}