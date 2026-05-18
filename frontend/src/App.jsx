import { useEffect, useState, lazy, Suspense, useMemo, memo } from "react";
import { Routes, Route, useLocation, Link, Navigate } from "react-router-dom";

import { supabase } from "./utils/supabaseClient";
import { AuthProvider, useAuth } from "./contexte/AuthContext";
import { CategorieProvider } from "./contexte/CategoriesContext";
import { CartProvider } from "./components/CartContext";
import { ThemeProvider } from "./contexte/ThemeProvider";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import * as Icons from "lucide-react";
import { getCurrentTheme } from "./utils/themeConfig";

// 🚀 LAZY + PREFETCH
const Accueil = lazy(() => import(/* webpackPrefetch: true */ "./pages/Accueil"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ToutesLesCategories = lazy(() => import("./pages/ToutesLesCategories"));
const PageBoutique = lazy(() => import("./pages/PageBoutique"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const Shop = lazy(() => import('./pages/Shop'));
const UserDashboard = lazy(() => import("./pages/UserDashboard/UserDashboard"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));

// Composants lourds non critiques → chargés après idle
const CategorySidebar = lazy(() => import("./components/CategorySidebar"));
const FooterQwikfy = lazy(() => import("./components/FooterQwikfy"));
const SeasonalEffect = lazy(() => import("./components/SeasonalEffect"));

const CATEGORIES = ["Toutes", "Téléphones", "TV & HIGH TECH", "Informatique", "Vêtements", "Beauté"];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const NotFound = memo(() => {
  const isAdmin = useLocation().pathname.startsWith('/admin');
  return (
    <div className={`flex-grow grid place-items-center min-h-screen ${isAdmin? 'bg-[#020617]' : 'bg-gray-50'}`}>
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto rounded-2xl grid place-items-center mb-4 ${isAdmin? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
          <Icons.ShieldAlert size={32} className={isAdmin? 'text-red-500' : 'text-orange-500'} />
        </div>
        <h1 className={`text-6xl font-black ${isAdmin? 'text-white' : 'text-slate-900'}`}>404</h1>
        <Link to="/" className="mt-6 inline-block px-6 py-3 rounded-xl bg-orange-600 text-white text-xs font-bold uppercase">Accueil</Link>
      </div>
    </div>
  );
});

const PageLoader = memo(() => (
  <div className="flex-1 grid place-items-center min-h-">
    <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin" />
  </div>
));

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const [maintenance, setMaintenance] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState(() => getCurrentTheme());

  const isDashboard = useMemo(() =>
    location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin'),
    [location.pathname]
  );

  // ⚡ INIT ULTRA RAPIDE
  useEffect(() => {
    let cancelled = false;

    // 1. Thème instantané (pas de blocage)
    const t = getCurrentTheme();
    document.documentElement.style.setProperty('--color-primary', t.colors.primary);
    document.documentElement.style.setProperty('--theme-bg', t.colors.background);
    setTheme(t);

    // 2. Requêtes en parallèle, non bloquantes
    const init = async () => {
      const [settings, profile] = await Promise.allSettled([
        supabase.from('settings').select('value').eq('key', 'maintenance_mode').maybeSingle(),
        user? supabase.from('profiles').select('role,is_admin').eq('id', user.id).maybeSingle() : Promise.resolve({ value: null })
      ]);

      if (!cancelled) {
        if (settings.status === 'fulfilled' && settings.value.data) {
          setMaintenance(settings.value.data.value === "true");
        }
        if (profile.status === 'fulfilled' && profile.value.data) {
          const r = profile.value.data.role?.toLowerCase();
          setIsAdmin(r === 'admin' || r === 'super admin' || profile.value.data.is_admin);
        }
        setReady(true);
      }
    };

    // Lance après le premier paint
    if ('requestIdleCallback' in window) {
      requestIdleCallback(init, { timeout: 500 });
    } else {
      setTimeout(init, 50);
    }

    return () => { cancelled = true; };
  }, [user?.id]); // dépendance fine

  // Préchargement intelligent au hover
  useEffect(() => {
    const preload = () => {
      import("./pages/Login");
      import("./pages/Register");
    };
    window.addEventListener('mouseover', preload, { once: true });
    return () => window.removeEventListener('mouseover', preload);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-[#020617] grid place-items-center"><PageLoader /></div>;
  }

  if (maintenance &&!isAdmin) {
    return <Suspense fallback={<PageLoader />}><Maintenance /></Suspense>;
  }

  return (
    <div className={`min-h-screen flex flex-col ${location.pathname.startsWith('/admin')? 'bg-[#020617]' : 'bg-gray-50'}`}>
      <ScrollToTop />

      {!isDashboard && (
        <>
          <Suspense fallback={null}>
            <SeasonalEffect currentEffect={theme.effect} />
          </Suspense>
          {theme.id!== "default" && (
            <div className="h-8 grid place-items-center bg-orange-600 text-white text- font-bold uppercase tracking-widest">
              {theme.promoText}
            </div>
          )}
          <Navbar />
          <div className="md:hidden sticky top-14 z-30 bg-white border-b">
            <Suspense fallback={<div className="h-12" />}>
              <CategorySidebar categories={CATEGORIES} mode="horizontal" />
            </Suspense>
          </div>
        </>
      )}

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/login" element={user? <Navigate to="/" replace /> : <Login />} />
            <Route path="/register" element={user? <Navigate to="/" replace /> : <Register />} />
            <Route path="/toutes-les-categories" element={<ToutesLesCategories />} />
            <Route path="/boutique/:nomBoutique" element={<PageBoutique />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/mon-compte/*" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isDashboard && (
        <Suspense fallback={null}>
          <FooterQwikfy />
        </Suspense>
      )}
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