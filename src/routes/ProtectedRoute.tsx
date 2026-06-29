import { Navigate, useLocation } from 'react-router-dom';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useProtectedRoute();
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (loading) {
    return <div className="loading-state">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
