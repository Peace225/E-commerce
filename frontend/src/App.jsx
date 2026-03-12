import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

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
import FooterQwikfy from "./components/FooterQwikfy";

// Pages
import Accueil from "./pages/Accueil";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ToutesLesCategories from "./pages/ToutesLesCategories";
import PageBoutique from "./pages/PageBoutique";
import ProductDetails from "./pages/ProductDetails";
import Maintenance from "./pages/Maintenance";

// Dashboards
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

// 🚀 Page 404 simple pour le SEO
function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oups ! Cette page n'existe pas.</p>
      <a href="/" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold">Retour à l'accueil</a>
    </div>
  );
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

  // 🚀 L'écran de chargement n'a plus de bug car le Router est plus haut !
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <FooterQwikfy />
      </div>
    );
  }

  // Barrière de Maintenance
  if (maintenanceMode && !isAdmin) {
    return <Maintenance />;
  }

  return (
    <>
      <ScrollToTop />
      
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* EN-TÊTE GLOBAL */}
        <Navbar />

        {/* Sidebar Mobile (Menu Catégories) */}
        <nav className="md:hidden w-full bg-white border-b border-gray-200 sticky top-16 z-40">
          <CategorySidebar categories={categories} mode="horizontal" />
        </nav>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-grow flex flex-col w-full">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/toutes-les-categories" element={<ToutesLesCategories />} />
            <Route path="/boutique/:nomBoutique" element={<PageBoutique />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/shop" element={<Shop />} />

            <Route path="/mon-compte" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/ajouter-produit" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* PIED DE PAGE GLOBAL */}
        <FooterQwikfy />
      </div>
    </>
  );
}

export default function App() {
  return (
    // 🚀 La balise Router englobe maintenant toute l'application
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <CategorieProvider>
              <AppContent />
            </CategorieProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}