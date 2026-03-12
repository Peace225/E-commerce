import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../utils/firebaseConfig"; // On retire 'db' car on passe par l'API
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

  // 🔐 Synchronisation Backend & Redirection Intelligente
  const syncAndRedirect = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();

      // 🔄 On envoie le token au backend pour vérification et récupération du profil
      const response = await fetch('http://localhost:5000/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        })
      });

      const result = await response.json();

      if (response.ok) {
        const userData = result.user;
        
        // 🎯 Redirection basée sur le rôle validé par le serveur
        if (userData.role === "admin") {
          navigate("/admin");
        } else if (userData.role === "vendeur") {
          navigate("/dashboard");
        } else {
          navigate("/mon-compte");
        }
      } else {
        setAlert(result.error || "Erreur de synchronisation avec le serveur.");
      }
    } catch (error) {
      console.error("Erreur Auth Backend:", error);
      setAlert("Le serveur Rynek est injoignable.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await syncAndRedirect(userCredential.user);
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setAlert("Email ou mot de passe incorrect.");
      } else {
        setAlert("Une erreur est survenue lors de la connexion.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await syncAndRedirect(result.user);
    } catch (error) {
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
        <meta name="description" content="Connectez-vous à Rynek pour gérer vos achats et ventes." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 font-['Inter',sans-serif]">
        <div className="w-full max-w-md">
          {alert && <AlertMessage message={alert} onClose={() => setAlert("")} />}

          <form onSubmit={handleLogin} className="bg-white shadow-2xl p-6 sm:p-8 rounded-[2.5rem] space-y-6 border border-gray-100">
            <div className="text-center space-y-2 mb-6">
               <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Rynek</h1>
               <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">Bon retour parmi nous</p>
            </div>

            <div className="space-y-4">
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
                  className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-medium text-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/mot-de-passe-oublie" className="text-[10px] font-bold text-gray-400 hover:text-orange-500 uppercase tracking-widest transition-colors">
                Besoin d'aide ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Vérification..." : "Se connecter"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-[10px] font-black text-gray-400">OU</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-100 py-4 rounded-2xl transition-all font-bold text-sm text-gray-700"
            >
              <svg viewBox="0 0 48 48" width="20" height="20">
                <path fill="#EA4335" d="M24 9.5c3.9 0 7.4 1.4 10.1 3.7l7.5-7.5C37.3 2.2 30.9 0 24 0 14.6 0 6.4 5.4 2.5 13.3l8.7 6.8C13.2 13.4 18.2 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.7-2 5-4.2 6.6l6.5 5.1c3.8-3.5 6-8.6 6-16.1z"/>
                <path fill="#4A90E2" d="M11.2 28.1c-.5-1.5-.8-3.1-.8-4.6s.3-3.1.8-4.6l-8.7-6.8C.9 15.5 0 19.6 0 24s.9 8.5 2.5 11.9l8.7-6.8z"/>
                <path fill="#FBBC05" d="M24 48c6.9 0 12.7-2.3 16.9-6.3l-6.5-5.1c-2 1.4-4.6 2.2-10.4 2.2-5.8 0-10.8-3.9-12.8-9.3l-8.7 6.8C6.4 42.6 14.6 48 24 48z"/>
              </svg>
              Continuer avec Google
            </button>

            <p className="text-center text-xs text-gray-500 font-bold uppercase pt-4">
              Pas encore membre ? <Link to="/register" className="text-orange-600 hover:underline">Créer un compte</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}