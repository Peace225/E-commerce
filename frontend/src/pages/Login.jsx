import { useState } from "react";
import { supabase } from "../utils/supabaseClient"; 
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AlertMessage from "../components/AlertMessage";
import * as Icons from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🎯 LOGIQUE DE REDIRECTION CORRIGÉE (Table 'users')
  const handleUserRedirection = async (user) => {
    try {
      // 1. On pointe sur 'users' car 'profiles' est vide chez toi
      const { data: userData, error } = await supabase
        .from('users') 
        .select('role, is_admin, is_banned')
        .eq('id', user.id)
        .maybeSingle(); // Plus robuste que .single()

      if (error) {
        console.error("Erreur Supabase:", error);
        setAlert("Erreur de synchronisation avec la table users.");
        return;
      }

      if (!userData) {
        setAlert("Compte introuvable dans la base de données.");
        return;
      }

      // 2. Sécurité : Vérifier si le compte est banni
      if (userData.is_banned) {
        setAlert("Votre compte a été suspendu pour non-respect des CGU.");
        await supabase.auth.signOut();
        return;
      }

      // 3. AIGUILLAGE PRÉCIS
      // On vérifie le flag is_admin OU le rôle 'admin'
      if (userData.is_admin === true || userData.role === "admin") {
        console.log("Accès SuperAdmin détecté 🚀");
        navigate("/admin");
      } else if (userData.role === "vendeur") {
        navigate("/dashboard");
      } else {
        navigate("/mon-compte");
      }

    } catch (error) {
      console.error("Erreur Redirection:", error.message);
      setAlert("Erreur système lors de la redirection.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await handleUserRedirection(data.user);
      }
    } catch (error) {
      setAlert(error.message === "Invalid login credentials" 
        ? "Email ou mot de passe incorrect." 
        : "Erreur de connexion au service Auth.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + "/mon-compte" 
        }
      });
      if (error) throw error;
    } catch (error) {
      setAlert("Erreur lors de la connexion avec Google.");
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion - Rynek</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 font-['Inter',sans-serif]">
        <div className="w-full max-w-md">
          {alert && <AlertMessage message={alert} onClose={() => setAlert("")} />}

          <form onSubmit={handleLogin} className="bg-white shadow-2xl p-8 rounded-[2.5rem] space-y-6 border border-gray-100">
            <div className="text-center space-y-2 mb-6">
               <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Rynek</h1>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic opacity-60">Accès Sécurisé</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="Adresse Email"
                  className="w-full border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-medium text-sm"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Mot de passe"
                  className="w-full border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-medium text-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                >
                  {showPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Vérification..." : "Se connecter"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-4 rounded-2xl transition-all font-bold text-xs text-slate-700"
            >
              <Icons.Globe size={18} className="text-slate-400" />
              Continuer avec Google
            </button>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase pt-2">
              Nouveau ? <Link to="/register" className="text-orange-600">Créer mon compte</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}