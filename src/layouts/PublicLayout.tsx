import { Outlet, Link } from 'react-router-dom';
import { useCartStore } from '@/modules/cart/store/cartStore';
import { useCart } from '@/modules/cart/hooks/useCart';
import { CartDrawer } from '@/modules/cart/components/CartDrawer';

function CartButton() {
  const openDrawer = useCartStore((s) => s.openDrawer);
  const { data: cart } = useCart();
  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative rounded-md p-2 text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 transition-colors"
      aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : 'Open cart'}
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {itemCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white"
          aria-hidden="true"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              E-Commerce
            </Link>
            <Link to="/products" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">
              Categories
            </Link>
          </div>
          <CartButton />
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white px-6 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} E-Commerce
      </footer>
      <CartDrawer />
    </div>
  );
}
