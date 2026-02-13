import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useCallback(() => {
    logout();
    queryClient.clear();
    navigate('/login', { replace: true });
  }, [logout, navigate, queryClient]);
}
