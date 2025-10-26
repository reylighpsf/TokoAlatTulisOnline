import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./views/components/layout/Navbar";
import ProtectedRoute from "./views/components/auth/ProtectedRoute";
import { userRoutes, adminRoutes } from "./views/routes/routes";
import { useAuthStore } from "./views/store/authStore";

/**
 * 🔄 Middleware Redirect Logic
 * Menangani redirect otomatis setelah checkAuth() selesai.
 */
function AuthRedirectHandler() {
  const { user, isAuthenticated, isAdminAuthenticated } = useAuthStore();
  const location = useLocation();

  // Jika sudah login dan mencoba ke /login atau /register
  if (
    (isAuthenticated || isAdminAuthenticated) &&
    ["/login", "/register", "/admin/login"].includes(location.pathname)
  ) {
    if (isAdminAuthenticated || user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return null; // Tidak perlu redirect
}

/**
 * 🌐 Komponen utama aplikasi
 */
function App() {
  const { checkAuth, isLoading: authLoading } = useAuthStore();

  // Jalankan cek autentikasi saat pertama kali aplikasi dijalankan
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ⏳ Loading spinner saat cek autentikasi
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memverifikasi autentikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* 🧭 Global Redirect Handler */}
      <AuthRedirectHandler />

      <Routes>
        {/* 🔐 ADMIN ROUTES */}
        {adminRoutes.map((route) => (
          <Route
            key={route.name}
            path={route.path}
            element={
              <ProtectedRoute requireAdmin>
                <route.component />
              </ProtectedRoute>
            }
          />
        ))}

        {/* 👤 USER ROUTES */}
        {userRoutes.map((route) => (
          <Route
            key={route.name}
            path={route.path}
            element={
              route.meta?.requiresAuth ? (
                <ProtectedRoute>
                  <div className="min-h-screen bg-white">
                    <Navbar />
                    <main>
                      <route.component />
                    </main>
                  </div>
                </ProtectedRoute>
              ) : (
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <main>
                    <route.component />
                  </main>
                </div>
              )
            }
          />
        ))}

        {/* 🚧 Default fallback ke Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
