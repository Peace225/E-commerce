import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexte/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import * as Icons from "lucide-react";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          // 🔍 On récupère le rôle directement dans Firestore
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setRole(docSnap.data().role || "user");
          } else {
            setRole("user");
          }
        } catch (error) {
          console.error("Erreur vérification rôle:", error);
          setRole("user");
        }
      }
      setLoading(false);
    };

    checkUserRole();
  }, [user]);

  // 1. Affichage pendant la vérification (Anti-clignotement)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
        <Icons.ShieldCheck size={40} className="text-orange-500 animate-pulse mb-4" />
        <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Vérification des accès...</p>
      </div>
    );
  }

  // 2. Si l'utilisateur n'est pas connecté du tout
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si la page demande d'être ADMIN mais que l'utilisateur est un simple USER
  if (adminOnly && role !== "admin") {
    console.warn("🚫 Accès refusé : Droits administrateur requis.");
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Si tout est OK, on affiche la page demandée
  return children;
}