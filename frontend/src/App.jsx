import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Link, Navigate } from "react-router-dom";

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
import * as Icons from "lucide-react";

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
import AdminDashboard from "./pages/Admin/AdminDashboard";       

// 🌟 THEMES
import { getCurrentTheme } from "./utils/themeConfig";

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

/**
 * 🚀 Page 404 dédiée (Zone Admin ou Client)
 */
function NotFound() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className={`flex-grow flex flex-col items-center justify-center text-center p-12 min-h-screen ${isAdminPath ? 'bg-[#020617]' : 'bg-gray-50'}`}>
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${isAdminPath ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
        <Icons.ShieldAlert size={40} className={isAdminPath ? 'text-red-500' : 'text-orange-500'} />
      </div>
      <h1 className={`text-7xl font-black mb-2 tracking-tighter ${isAdminPath ? 'text-white' : 'text-slate-900'}`}>404</h1>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
        La page demandée est introuvable
      </p>
      <Link 
        to="/" 
        className={`${isAdminPath ? 'bg-white text-slate-950' : 'bg-orange-600 text-white'} px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105`}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth(); 
  const location = useLocation(); 
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(null);

  // 🛡️ INITIALISATION : Thème, Maintenance et Rôle Admin
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        const theme = getCurrentTheme();
        setCurrentTheme(theme);
        
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.colors.primary);
        root.style.setProperty('--color-secondary', theme.colors.secondary);
        root.style.setProperty('--theme-bg', theme.colors.background);
        root.style.setProperty('--theme-text', theme.colors.text);

        const { data: maintData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'maintenance_mode')
          .maybeSingle();
        if (maintData) setMaintenanceMode(maintData.value === "true");

        if (user) {
          // ⚠️ On pointe sur 'users' pour correspondre à ta DB
          const { data: userData } = await supabase
            .from('users')
            .select('role, is_admin')
            .eq('id', user.id)
            .maybeSingle();
          
          if (userData) {
            setIsAdmin(userData.role === "admin" || userData.is_admin === true);
          }
        }
      } catch (err) {
        console.error("Erreur système:", err);
      } finally {
        setLoading(false);
      }
    };
    initializeApp();
  }, [user]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading || !currentTheme) {
    return (
      <div className="flex flex-col min-h-screen bg-[#020617] items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (maintenanceMode && !isAdmin) return <Maintenance />;

  const CATEGORIES = ["Toutes", "Téléphones", "TV & HIGH TECH", "Informatique", "Vêtements", "Beauté"];

  return (
    <div className={`flex flex-col min-h-screen transition-all duration-500 overflow-x-hidden ${isAdminRoute ? 'bg-[#020617]' : 'bg-theme-bg'}`}>
      <ScrollToTop />
      
      {/* 🔹 INTERFACE CLIENT : Masquée si on est dans l'admin */}
      {!isAdminRoute && (
        <>
          <SeasonalEffect currentEffect={currentTheme.effect} /> 
          {currentTheme.id !== "default" && currentTheme.promoText && (
            <div className="w-full py-2 text-center font-black text-[10px] uppercase tracking-widest z-50 bg-orange-600 text-white">
              {currentTheme.promoText}
            </div>
          )}
          <Navbar />
          <nav className="md:hidden w-full bg-white border-b border-slate-100 sticky top-16 z-40">
            <CategorySidebar categories={CATEGORIES} mode="horizontal" />
          </nav>
        </>
      )}

      {/* 🔹 ROUTAGE */}
      <main className="flex-grow flex flex-col w-full">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/toutes-les-categories" element={<ToutesLesCategories />} />
          <Route path="/boutique/:nomBoutique" element={<PageBoutique />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shop" element={<Shop />} />

          {/* Dashboards */}
          <Route path="/mon-compte/*" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* 🚩 GOD MODE : Dashboard SuperAdmin Isolé */}
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && <FooterQwikfy />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <CategorieProvider>
            <AppContent />
          </CategorieProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}