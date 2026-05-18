import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../utils/supabaseClient";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUserToBackend = useCallback(async (session) => {
    if (!session?.access_token) return;
    try {
      const res = await fetch('http://localhost:5000/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          displayName: session.user.user_metadata?.full_name,
          photoURL: session.user.user_metadata?.avatar_url,
          metadata: session.user.user_metadata
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("🚨 Sync:", res.status, err);
      }
    } catch {
      console.info("ℹ Backend offline");
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user?? null);
      setLoading(false);
      if (session) syncUserToBackend(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((e, session) => {
      setUser(session?.user?? null);
      if (e === 'SIGNED_IN') syncUserToBackend(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [syncUserToBackend]);

  return (
    <AuthContext.Provider value={{ user, loading, logout: () => supabase.auth.signOut() }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};