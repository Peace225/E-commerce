import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexte/AuthContext";
import * as Icons from "lucide-react";
import AdminProduits from "./AdminProduits";
import AdminSupport from "./AdminSupport";
import AdminMarketing from "./AdminMarketing";
import AdminLogs from "./AdminLogs";

// --- IMPORTS DES COMPOSANTS ---
// ⚠️ Vérifie que ton dossier de composants s'appelle bien "components" à la racine de "src"
import SidebarAdmin from "./SidebarAdmin"; 

// --- IMPORTS DES PAGES ADMIN ---
// Ces fichiers doivent se trouver dans le MÊME dossier que AdminDashboard.jsx
import AdminHome from "./AdminHome";
import AdminUsers from "./AdminUsers";
import AdminBoutiques from "./AdminBoutiques";
import AdminCommandes from "./AdminCommandes";
import AdminCommissions from "./AdminCommissions";
import AdminFinances from "./AdminFinances"; // Le module de trésorerie que l'on vient de créer
import AdminParametres from "./AdminParametres";

export default function AdminDashboard() {
  const { logout } = useAuth(); // Récupère la fonction de déconnexion
  const [withdrawalsCount, setWithdrawalsCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // État pour le menu mobile

  // 🔄 ÉCOUTEUR : Badge des retraits en attente pour la Sidebar
  useEffect(() => {
    const q = query(
      collection(db, "transactions"), 
      where("type", "==", "withdrawal"),
      where("status", "==", "En attente")
    );
    const unsub = onSnapshot(q, (snap) => {
      setWithdrawalsCount(snap.size);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir quitter le God Mode ?")) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans flex overflow-hidden">
      
      {/* 🔹 1. BARRE LATÉRALE (SIDEBAR) */}
      <SidebarAdmin 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        handleLogout={handleLogout}
        withdrawalsBadge={withdrawalsCount} 
      />

      {/* 🔹 2. CONTENU DYNAMIQUE (Zone de droite) */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">
        
        {/* EN-TÊTE MOBILE (Visible uniquement sur téléphone) */}
        <div className="lg:hidden p-4 bg-[#0f172a] border-b border-white/5 flex items-center justify-between sticky top-0 z-40 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/30">
              <Icons.ShieldAlert size={16} className="text-white" />
            </div>
            <h1 className="text-white font-black italic tracking-tighter uppercase">RYNEK <span className="text-red-500">ADMIN</span></h1>
          </div>
          <button onClick={() => setMenuOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors">
            <Icons.Menu size={24} />
          </button>
        </div>

        {/* 🔹 3. SYSTÈME DE ROUTES (Le cœur de l'affichage) */}
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          <Routes>
            {/* Page d'accueil par défaut (/admin) */}
            <Route path="/" element={<AdminHome />} />

            {/* Les différents modules (/admin/users, /admin/finances, etc.) */}
            <Route path="users" element={<AdminUsers />} />
            <Route path="boutiques" element={<AdminBoutiques />} />
            <Route path="commandes" element={<AdminCommandes />} />
            <Route path="commissions" element={<AdminCommissions />} />
            <Route path="finances" element={<AdminFinances />} />
            <Route path="parametres" element={<AdminParametres />} />
            <Route path="produits" element={<AdminProduits />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="marketing" element={<AdminMarketing />} />
             <Route path="logs" element={<AdminLogs />} />

            {/* Redirection de sécurité si l'URL saisie est fausse */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>

      </main>
    </div>
  );
}