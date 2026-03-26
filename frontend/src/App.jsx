import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from "react-router-dom";

// 🔄 CONFIGURATION & CONTEXTES
import { supabase } from "./utils/supabaseClient"; 
import { AuthProvider, useAuth } from "./contexte/AuthContext";
import { CategorieProvider } from "./contexte/CategoriesContext";
import { CartProvider } from "./components/CartContext";
import { ThemeProvider } from "./contexte/ThemeProvider";

// 🎨 COMPOSANTS & EFFETS
import Navbar from "./components/Navbar/Navbar";
import CategorySidebar from "./components/CategorySidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import FooterQwikfy from "./components/FooterQwikfy";
import SeasonalEffect from "./components/SeasonalEffect"; 

// 📄 PAGES
import Accueil from "./pages/Accueil";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ToutesLesCategories from "./pages/ToutesLesCategories";
import PageBoutique from "./pages/PageBoutique";
import ProductDetails from "./pages/ProductDetails";
import Maintenance from "./pages/Maintenance";

// 📊 DASHBOARDS
import UserDashboard from "./pages/UserDashboard/UserDashboard"; 
import Dashboard from "./pages/dashboard/Dashboard"; 
import AddProduct from "./pages/dashboard/AddProduct";  
import Shop from './pages/Shop';            
import AdminDashboard from "./pages/admin/AdminDashboard";       

/**
 * 🔄 Reset scroll au changement de page
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// 🚀 Page 404
function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-theme-bg">
      <h1 className="text-6xl font-black text-primary mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8 font-bold uppercase tracking-widest">Oups ! Cette page n'existe pas.</p>
      <Link to="/" className="bg-primary text-theme-text px-8 py-3 rounded-full font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">
        Retour à l'accueil
      </Link>
    </div>
  );
}

const CATEGORIES = [
  "Toutes", "Téléphones", "TV & HIGH TECH", "Informatique",
  "Maison, cuisine & bureau", "Électroménager", "Vêtements & Chaussures",
  "Beauté & Santé", "Jeux vidéos & Consoles", "Bricolage",
  "Sports & Loisirs", "Bébé & Jouets", "Autres catégories",
];

function AppContent() {
  const { user } = useAuth(); 
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. 🛡️ Gérer le mode maintenance ET le rôle Admin
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        // --- Vérification Maintenance ---
        const { data: maintData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'maintenance_mode')
          .maybeSingle();
        
        if (maintData) setMaintenanceMode(maintData.value === "true");

        // --- Vérification Admin (si user connecté) ---
        if (user) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          
          if (userData) setIsAdmin(userData.role === "admin");
        } else {
          setIsAdmin(false);
        }

      } catch (err) {
        console.error("Erreur initialisation App:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [user]); // Re-vérifie quand l'utilisateur change (login/logout)

  // 🌀 Loader principal
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-theme-bg items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 🚧 Écran de Maintenance (sauf pour l'admin)
  if (maintenanceMode && !isAdmin) {
    return <Maintenance />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-theme-bg transition-colors duration-1000 overflow-x-hidden">
      <ScrollToTop />
      
      {/* ✨ Effet saisonnier (Agneau Pascal / Noël) */}
      <SeasonalEffect /> 
      
      <Navbar />
      
      {/* Barre de catégories mobile */}
      <nav aria-label="Catégories mobiles" className="md:hidden w-full bg-white border-b border-gray-200 sticky top-16 z-40">
        <CategorySidebar categories={CATEGORIES} mode="horizontal" />
      </nav>

      <main className="flex-grow flex flex-col w-full">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/toutes-les-categories" element={<ToutesLesCategories />} />
          <Route path="/boutique/:nomBoutique" element={<PageBoutique />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shop" element={<Shop />} />

          {/* Routes Protégées Utilisateurs */}
          <Route path="/mon-compte" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          
          {/* Routes Protégées Boutique/Vendeur */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/ajouter-produit" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          
          {/* Admin Dashboard - Utilisation de adminOnly passé au ProtectedRoute */}
          <Route path="/admin/*" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <FooterQwikfy />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <CategorieProvider>
              <AppContent />
            </CategorieProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}