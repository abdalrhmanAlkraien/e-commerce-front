import { create } from 'zustand';

const STORAGE_KEY = 'cart_session';

interface CartSession {
  cartId: string;
  sessionId: string;
}

interface CartStore {
  cartId: string | null;
  sessionId: string | null;
  isDrawerOpen: boolean;
  setSession: (cartId: string, sessionId: string) => void;
  clearSession: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

function readStoredSession(): Partial<CartSession> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartSession;
  } catch {
    // ignore
  }
  return {};
}

const stored = readStoredSession();

export const useCartStore = create<CartStore>((set) => ({
  cartId: stored.cartId ?? null,
  sessionId: stored.sessionId ?? null,
  isDrawerOpen: false,

  setSession: (cartId, sessionId) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cartId, sessionId }));
    } catch {
      // localStorage unavailable — in-memory fallback is sufficient
    }
    set({ cartId, sessionId });
  },

  clearSession: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({ cartId: null, sessionId: null });
  },

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));
