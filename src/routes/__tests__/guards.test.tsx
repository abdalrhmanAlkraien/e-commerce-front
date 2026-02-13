import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../guards/ProtectedRoute';
import { AdminRoute } from '../guards/AdminRoute';
import { CustomerRoute } from '../guards/CustomerRoute';
import { useAuthStore } from '@/modules/auth/store/authStore';
import type { AuthUser } from '@/modules/auth/types/auth.types';

function setAuth(user: AuthUser) {
  act(() => {
    useAuthStore.setState({ token: 'test-token', user, isAuthenticated: true });
  });
}

afterEach(() => {
  act(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });
});

function ProtectedPage() {
  return <p>Protected content</p>;
}

function AdminPage() {
  return <p>Admin content</p>;
}

function CustomerPage() {
  return <p>Customer content</p>;
}

function LoginPage() {
  return <p>Login page</p>;
}

function HomePage() {
  return <p>Home page</p>;
}

describe('ProtectedRoute', () => {
  it('redirects to /login when user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    setAuth({ id: '1', email: 'user@test.com', role: 'CUSTOMER' });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  it('redirects to /login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('redirects to /403 when authenticated as CUSTOMER', () => {
    setAuth({ id: '1', email: 'customer@test.com', role: 'CUSTOMER' });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/403" element={<p>Unauthorized page</p>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Unauthorized page')).toBeInTheDocument();
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });

  it('renders admin content when authenticated as ADMIN', () => {
    setAuth({ id: '1', email: 'admin@test.com', role: 'ADMIN' });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });
});

describe('CustomerRoute', () => {
  it('redirects to / when authenticated as ADMIN', () => {
    setAuth({ id: '1', email: 'admin@test.com', role: 'ADMIN' });

    render(
      <MemoryRouter initialEntries={['/customer']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route element={<CustomerRoute />}>
            <Route path="/customer" element={<CustomerPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Home page')).toBeInTheDocument();
    expect(screen.queryByText('Customer content')).not.toBeInTheDocument();
  });

  it('renders customer content when authenticated as CUSTOMER', () => {
    setAuth({ id: '1', email: 'customer@test.com', role: 'CUSTOMER' });

    render(
      <MemoryRouter initialEntries={['/customer']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route element={<CustomerRoute />}>
            <Route path="/customer" element={<CustomerPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Customer content')).toBeInTheDocument();
  });
});
