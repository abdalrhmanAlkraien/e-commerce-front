import { create } from 'zustand';
import type { AuthUser, AuthState } from '../types/auth.types';

interface AuthActions {
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const LOGOUT_CHANNEL = 'auth:logout';

function notifyOtherTabs(): void {
  try {
    const channel = new BroadcastChannel(LOGOUT_CHANNEL);
    channel.postMessage({ type: 'LOGOUT' });
    channel.close();
  } catch {
    // BroadcastChannel not supported in this environment
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
  logout: () => {
    notifyOtherTabs();
    set({ ...initialState });
  },
}));
