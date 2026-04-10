import { useEffect, useState, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexte/AuthContext";
import { supabase } from "../../utils/supabaseClient";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MODULES ADMIN (Tous dans le même dossier selon ta capture) ---
import SidebarAdmin from "./SidebarAdmin";
import AdminHome from "./AdminHome";
import AdminUsers from "./AdminUsers";
import AdminBoutiques from "./AdminBoutiques";
import AdminCommandes from "./AdminCommandes";
import AdminCommissions from "./AdminCommissions";
import AdminFinances from "./AdminFinances";
import AdminParametres from "./AdminParametres";
import AdminProduits from "./AdminProduits";
import AdminSupport from "./AdminSupport";
import AdminMarketing from "./AdminMarketing";
import AdminLogs from "./AdminLogs";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [withdrawalsCount, setWithdrawalsCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  // 🛡️ 1. SÉCURITÉ ROOT (Table 'users')
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        const t = setTimeout(() => { if (!user) setChecking(false); }, 2000);
        return () => clearTimeout(t);
      }

      try {
        const { data, error } = await supabase
          .from('users') 
          .select('is_admin, role')
          .eq('id', user.id)
          .maybeSingle();

        if (data && (data.is_admin || data.role === 'admin')) {
          setIsAuthorized(true);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setChecking(false);
      }
    };
    checkAdminStatus();
  }, [user, logout]);

  if (checking) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center">
      <Icons.Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );

  if (!isAuthorized) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans flex overflow-hidden">
      <SidebarAdmin 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        handleLogout={logout}
        withdrawalsBadge={withdrawalsCount} 
      />

      <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar">
        {/* Header Mobile */}
        <div className="lg:hidden p-6 bg-[#0f172a]/80 border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-white font-black text-sm uppercase">Rynek <span className="text-orange-500">System</span></h1>
          <button onClick={() => setMenuOpen(true)} className="p-2 text-slate-400"><Icons.Menu size={24} /></button>
        </div>

        <div className="p-6 lg:p-12 max-w-[1700px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Routes location={location}>
                <Route path="/" element={<AdminHome />} />
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
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}