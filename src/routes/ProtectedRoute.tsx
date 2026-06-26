import { Navigate, useLocation } from 'react-router-dom';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useProtectedRoute();
  const location = useLocation();

  if (loading) {
    return <div className="loading-state">Checking authentication…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
