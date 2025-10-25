/**
 * Komponen untuk melindungi route yang membutuhkan autentikasi
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isAdminAuthenticated, isLoading, user } = useAuthStore();
  const role = user?.role || sessionStorage.getItem("role");

  if (isLoading) return <div>Memeriksa sesi...</div>;

  // Jangan proteksi halaman login / register
  if (["/login", "/register", "/admin"].includes(location.pathname)) {
    return <>{children}</>;
  }

  // Belum login sama sekali
  if (!isAuthenticated && !isAdminAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika halaman butuh admin tapi user biasa
  if (requireAdmin && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Jika user admin tapi mencoba buka halaman user
  if (!requireAdmin && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
