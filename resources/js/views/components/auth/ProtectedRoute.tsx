/**
 * Komponen untuk melindungi route yang membutuhkan autentikasi
 */

import { Navigate } from 'react-router';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
