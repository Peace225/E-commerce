import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient"; // 🔄 Ton client Supabase

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔌 NOUVEAU : Fonction pour prévenir le backend qu'un utilisateur est là
  const syncUserToBackend = async (session) => {
    if (!session) return;
    try {
      // On appelle ton serveur Node.js avec la méthode POST
      await fetch('http://localhost:5000/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 🔐 TRÈS IMPORTANT : On envoie le token au "douanier" (protect)
          'Authorization': `Bearer ${session.access_token}` 
        }
      });
      console.log("✅ Utilisateur synchronisé avec le backend !");
    } catch (error) {
      console.error("❌ Erreur de synchronisation avec le backend:", error);
    }
  };

  useEffect(() => {
    // 1️⃣ Vérifier la session actuelle au chargement
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Si on a une session au démarrage, on synchronise
      if (session) syncUserToBackend(session);
    };

    getInitialSession();

    // 2️⃣ Écouter les changements d'état (Connexion, Déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Si l'utilisateur vient de se connecter, on prévient le backend
      if (_event === 'SIGNED_IN' && session) {
        syncUserToBackend(session);
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