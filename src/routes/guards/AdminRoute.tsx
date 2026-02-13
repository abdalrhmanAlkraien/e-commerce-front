import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/authStore';

export function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
