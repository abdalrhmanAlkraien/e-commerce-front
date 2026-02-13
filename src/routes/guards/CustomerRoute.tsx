import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/authStore';

export function CustomerRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'CUSTOMER') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
