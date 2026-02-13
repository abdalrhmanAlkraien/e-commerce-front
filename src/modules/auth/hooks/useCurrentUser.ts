import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../store/authStore';
import type { UserRole, AuthUser } from '../types/auth.types';

interface CurrentUserResult {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

export function useCurrentUser(): CurrentUserResult {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      role: state.user?.role ?? null,
    })),
  );
}
