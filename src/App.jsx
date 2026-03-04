import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Firebase & Contexts
import { db } from "./utils/firebaseConfig";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { AuthProvider, useAuth } from "./contexte/AuthContext";
import { CategorieProvider } from "./contexte/CategoriesContext";
import { CartProvider } from "./components/CartContext";
import { ThemeProvider } from "./contexte/ThemeContext";

// Components & Layout
import Navbar from "./components/Navbar/Navbar";
import CategorySidebar from "./components/CategorySidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Accueil from "./pages/Accueil";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ToutesLesCategories from "./pages/ToutesLesCategories";
import PageBoutique from "./pages/PageBoutique";
import ProductDetails from "./pages/ProductDetails";
import Maintenance from "./pages/Maintenance";

// Dashboards
import UserDashboard from "./pages/UserDashboard/UserDashboard"; // 👈 Espace Client
import Dashboard from "./pages/dashboard/Dashboard";             // 👈 Espace Pro/Vendeur
import AdminDashboard from "./pages/admin/AdminDashboard";       // 👈 Espace Admin

/**
 * Reset scroll au changement de page
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { user } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Toutes", "Téléphones", "TV & HIGH TECH", "Informatique",
    "Maison, cuisine & bureau", "Électroménager", "Vêtements & Chaussures",
    "Beauté & Santé", "Jeux vidéos & Consoles", "Bricolage",
    "Sports & Loisirs", "Bébé & Jouets", "Autres catégories",
  ];

  // Synchronisation Maintenance et Rôle Admin
  useEffect(() => {
    const unsubMaintenance = onSnapshot(doc(db, "settings", "global"), (snap) => {
      if (snap.exists()) {
        setMaintenanceMode(snap.data().maintenanceMode);
      }
    });

    const checkAdminStatus = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === "admin");
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAdminStatus();
    return () => unsubMaintenance();
  }, [user]);

  if (loading) return null;

  // Barrière de Maintenance
  if (maintenanceMode && !isAdmin) {
    return <Maintenance />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      {/* Sidebar Mobile */}
      <div className="md:hidden">
        <CategorySidebar categories={categories} mode="horizontal" />
      </div>

      <Routes>
        {/* --- ROUTES PUBLIQUES --- */}
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/toutes-les-categories" element={<ToutesLesCategories />} />
        <Route path="/boutique/:nomBoutique" element={<PageBoutique />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* --- ROUTES CLIENT (Protégées) --- */}
        <Route 
          path="/mon-compte" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- ROUTES PRO / VENDEUR (Protégées) --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- ZONE ADMIN (Ultra Protégée) --- */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirection automatique */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <CategorieProvider>
            <AppContent />
          </CategorieProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}