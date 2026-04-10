import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexte/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient"; 
import * as Icons from "lucide-react";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  const location = useLocation();
  
  // Au lieu de stocker juste le rôle, on stocke tout le profil de sécurité
  const [securityProfile, setSecurityProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserPermissions = async () => {
      // 1️⃣ Si pas d'utilisateur, on arrête le chargement tout de suite
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 2️⃣ 🔍 On récupère TOUTES les infos de sécurité dans la table 'users'
        const { data, error } = await supabase
          .from('users')
          .select('role, is_admin, is_banned') // Ajout des nouvelles colonnes
          .eq('id', user.id) 
          .maybeSingle(); // maybeSingle est plus robuste que .single()

        if (error) throw error;

        // On sauvegarde l'état complet
        setSecurityProfile(data || { role: "user", is_admin: false, is_banned: false });
        
      } catch (error) {
        console.error("Erreur vérification droits Supabase:", error);
        setSecurityProfile({ role: "user", is_admin: false, is_banned: false });
      } finally {
        setLoading(false);
      }
    };

    checkUserPermissions();
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

  // 🔹 3. Sécurité Absolue : Blocage si le compte est banni
  if (securityProfile?.is_banned) {
    console.warn("🚫 Accès bloqué : Ce compte est banni.");
    // On pourrait aussi déclencher un logout de force ici
    return <Navigate to="/login" replace />;
  }

  // 🔹 4. Redirection si accès Admin requis mais rôle insuffisant
  if (adminOnly) {
    // Le VIP Pass : Soit la case is_admin est cochée, soit le rôle est explicitement "admin"
    const hasAdminRights = securityProfile?.is_admin === true || securityProfile?.role === "admin";
    
    if (!hasAdminRights) {
      console.warn("🚫 Accès VIP refusé : Droits administrateur requis.");
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 🔹 5. Accès accordé !
  return children;
}