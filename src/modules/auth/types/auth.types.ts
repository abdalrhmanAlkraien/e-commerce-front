export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}
