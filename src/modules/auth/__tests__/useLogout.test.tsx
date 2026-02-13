import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogout } from '../hooks/useLogout';
import { useAuthStore } from '../store/authStore';

afterEach(() => {
  act(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });
});

function LogoutTrigger() {
  const logout = useLogout();
  return <button onClick={logout}>Logout</button>;
}

function renderWithContext(initialPath = '/dashboard') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/dashboard" element={<LogoutTrigger />} />
          <Route path="/login" element={<p>Login page</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('useLogout', () => {
  it('clears auth store on logout', async () => {
    act(() => {
      useAuthStore.getState().setAuth('some-token', {
        id: '1',
        email: 'user@test.com',
        role: 'CUSTOMER',
      });
    });

    const user = userEvent.setup();
    renderWithContext();

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('redirects to /login after logout', async () => {
    const user = userEvent.setup();
    renderWithContext();

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });
});
