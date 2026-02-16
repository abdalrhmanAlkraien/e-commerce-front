import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/authStore';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Customers', to: '/admin/customers' },
] as const;

export function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-gray-700 bg-gray-900 p-4">
        <div className="mb-6">
          <span className="text-lg font-semibold text-white">Admin Panel</span>
        </div>
        <nav aria-label="Admin navigation">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/admin'}
                  className={({ isActive }) =>
                    [
                      'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                    ].join(' ')
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <nav aria-label="Admin top navigation" className="flex items-center justify-end gap-4">
            {user && (
              <span className="text-sm text-gray-600" data-testid="admin-user-email">
                {user.email}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Logout
            </button>
          </nav>
        </header>

        <main className="flex-1 bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
