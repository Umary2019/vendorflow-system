import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useApp();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    const fallback = user.role === 'admin' ? '/dashboard/admin' : user.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
