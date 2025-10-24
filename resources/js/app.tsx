// resources/js/app.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './views/components/layout/Navbar';
import AdminNavbar from './views/components/admin/AdminNavbar';
import CartSheet from './views/components/cart/CartSheet';
import ProtectedRoute from './views/components/auth/ProtectedRoute';
import { userRoutes, adminRoutes } from './views/routes/routes';
import { useAuthStore } from './views/store/authStore';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { checkAuth, isLoading: authLoading, user, isAuthenticated } = useAuthStore();

  // No cross-tab sync needed

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading screen while checking authentication
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
      <Routes>
        {/* Admin Routes - Dengan Admin Navbar */}
        {adminRoutes.map((route) => (
          <Route
            key={route.name}
            path={route.path}
            element={
              <ProtectedRoute requireAdmin={route.meta?.requiresAdmin}>
                <div className="min-h-screen bg-gray-50">
                  <AdminNavbar />
                  <route.component />
                </div>
              </ProtectedRoute>
            }
          />
        ))}

        {/* User Routes - Dengan Navbar dan Cart */}
        {userRoutes.map((route) => (
          <Route
            key={route.name}
            path={route.path}
            element={
              route.meta?.requiresAuth ? (
                <ProtectedRoute>
                  <div className="min-h-screen bg-white">
                    <Navbar onCartClick={() => setIsCartOpen(true)} />
                    <main>
                      <route.component />
                    </main>
                    <CartSheet
                      isOpen={isCartOpen}
                      onClose={() => setIsCartOpen(false)}
                    />
                  </div>
                </ProtectedRoute>
              ) : route.meta?.guest ? (
                // Redirect authenticated users away from guest pages
                isAuthenticated ? (
                  user?.role === 'admin' ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/" replace />
                  )
                ) : (
                  <route.component />
                )
              ) : route.path === '/login' && isAuthenticated ? (
                // Special handling for login page - redirect admin to admin, others to home
                user?.role === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <div className="min-h-screen bg-white">
                  <Navbar onCartClick={() => setIsCartOpen(true)} />
                  <main>
                    <route.component />
                  </main>
                  <CartSheet
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                  />
                </div>
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App; // ⚠️ ini wajib
