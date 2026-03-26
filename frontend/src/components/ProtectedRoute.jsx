import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexte/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient"; // 🔄 Bye bye Firebase, bonjour Supabase
import * as Icons from "lucide-react";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      // 1️⃣ Si pas d'utilisateur, on arrête le chargement tout de suite
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 2️⃣ 🔍 On récupère le rôle dans la table 'users' de Supabase
        // Note : Supabase utilise 'id' (UUID) et non 'uid'
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id) 
          .single();

        if (data) {
          setRole(data.role || "user");
        } else {
          setRole("user");
        }
      } catch (error) {
        console.error("Erreur vérification rôle Supabase:", error);
        setRole("user");
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user]);

  // 🔹 1. Écran de "Security Clearance" (Anti-clignotement)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
        <Icons.ShieldCheck size={40} className="text-orange-500 animate-pulse mb-4" />
        <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">
          Vérification des accès...
        </p>
      </div>
    );
  }

  // 🔹 2. Redirection si non connecté
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔹 3. Redirection si accès Admin requis mais rôle insuffisant
  if (adminOnly && role !== "admin") {
    console.warn("🚫 Accès VIP refusé : Droits administrateur requis.");
    // On redirige vers le dashboard vendeur par défaut ou l'accueil
    return <Navigate to="/dashboard" replace />;
  }

  // 🔹 4. Accès accordé !
  return children;
}