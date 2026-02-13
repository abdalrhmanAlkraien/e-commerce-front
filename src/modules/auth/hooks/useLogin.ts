import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import type { LoginFormValues } from '../utils/authSchemas';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.token, {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
      });
      const destination = response.user.role === 'ADMIN' ? '/admin' : '/';
      navigate(destination, { replace: true });
    },
  });
}
