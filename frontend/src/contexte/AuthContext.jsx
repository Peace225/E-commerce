import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * 🔌 SYNCHRONISATION OPTIONNELLE
   * On ne bloque plus l'app si le backend est injoignable
   */
  const syncUserToBackend = async (session) => {
    if (!session) return;
    
    // On vérifie si on est en mode développement pour éviter de polluer la console
    // ou si tu as besoin de désactiver la sync temporairement.
    try {
      const response = await fetch('http://localhost:5000/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}` 
        }
      });

      if (response.ok) {
        console.log("✅ Backend synchronisé");
      }
    } catch (error) {
      // On log une simple info au lieu d'une grosse erreur rouge qui fait peur
      console.info("ℹ️ Note: Le backend local (port 5000) n'est pas connecté. Supabase gère l'auth normalement.");
    }
  };

  useEffect(() => {
    // 1️⃣ Vérifier la session actuelle au chargement
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        // On tente la sync mais on n'attend pas après elle (pas de 'await' bloquant)
        if (session) syncUserToBackend(session);
      } catch (err) {
        console.error("Erreur session initiale:", err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2️⃣ Écouter les changements d'état (Connexion, Déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (_event === 'SIGNED_IN' && session) {
        syncUserToBackend(session);
      }
      
      if (_event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};