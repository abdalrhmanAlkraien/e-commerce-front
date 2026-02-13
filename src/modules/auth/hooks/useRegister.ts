import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import type { RegisterFormValues } from '../utils/authSchemas';

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterFormValues) => authApi.register(data),
    onSuccess: (response) => {
      setAuth(response.token, {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
      });
      navigate('/', { replace: true });
    },
  });
}
