import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient"; 
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AlertMessage from "../components/AlertMessage";
import * as Icons from "lucide-react";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🎯 LOGIQUE DE REDIRECTION MULTI-PROFIL STRICTE
  const handleUserRedirection = async (user) => {
    try {
      const { data: userData, error } = await supabase
        .from('users') 
        .select('role, is_admin, is_banned')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Erreur Supabase table users:", error);
        setAlert("Erreur de synchronisation avec votre profil.");
        return;
      }

      if (!userData) {
        // Si retour OAuth sans profil créé, on assume que c'est un client par défaut
        console.log("Nouveau compte détecté (OAuth) -> Direction Espace Client 🛒");
        navigate("/mon-compte");
        return;
      }

      if (userData.is_banned) {
        setAlert("Votre compte a été suspendu pour non-respect des CGU.");
        await supabase.auth.signOut();
        return;
      }

      const userRole = userData.role?.toLowerCase().trim();

      if (userData.is_admin === true || userRole === "admin" || userRole === "superadmin") {
        console.log("Accès SuperAdmin validé 🚀");
        navigate("/admin");
      } else if (userRole === "vendeur" || userRole === "boutique") {
        console.log("Accès Dashboard Vendeur/Boutique validé 🏪");
        navigate("/dashboard");
      } else {
        console.log("Accès Espace Acheteur validé 🛒");
        navigate("/mon-compte");
      }

    } catch (error) {
      console.error("Erreur lors de la redirection:", error.message);
      setAlert("Erreur système lors du calcul de votre espace de travail.");
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await handleUserRedirection(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert("");

    const cleanIdentifier = identifier.trim();
    // 🔍 Détection automatique : si ce ne sont que des chiffres, c'est un Acheteur (Téléphone)
    const isPhoneNumber = /^[0-9]+$/.test(cleanIdentifier);
    
    // Si c'est un téléphone, on reconstruit l'e-mail virtuel du client (@rynek.ci)
    // Si c'est un vendeur, on prend son vrai e-mail directement
    const finalEmail = isPhoneNumber ? `${cleanIdentifier}@rynek.ci` : cleanIdentifier;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await handleUserRedirection(data.user);
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error.message);
      setAlert(error.message === "Invalid login credentials" 
        ? "Identifiants ou mot de passe incorrects." 
        : "Erreur de connexion au service d'authentification.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      setAlert("Erreur lors de la connexion avec Google.");
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      setAlert("Erreur lors de la connexion avec Facebook.");
      setLoading(false);
    }
  };

  const isTypingPhone = /^[0-9]+$/.test(identifier.trim());

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
              {/* Champ Identifiant Intelligent */}
              <div className="relative group">
                {isTypingPhone ? (
                  <Icons.Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 transition-colors" size={18} />
                ) : (
                  <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                )}
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="N° WhatsApp (Acheteur) ou Email (Vendeur)"
                  className="w-full border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-medium text-sm"
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              {/* Champ Mot de Passe */}
              <div className="relative group">
                <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Mot de passe"
                  className="w-full border-2 border-slate-50 p-4 pl-12 pr-12 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-medium text-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
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

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-slate-100"></div>
              <span className="px-3 text-[10px] uppercase font-bold text-slate-300 tracking-wider">Ou continuer avec</span>
              <div className="flex-1 border-t border-slate-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-white border-2 border-slate-100 py-3.5 rounded-2xl transition-all font-bold text-xs text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.104C18.432 2.046 15.608 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.74-.08-1.3-.176-1.851H12.24z"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-white border-2 border-slate-100 py-3.5 rounded-2xl transition-all font-bold text-xs text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase pt-2">
              Nouveau ? <Link to="/register" className="text-orange-600">Créer mon compte</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}