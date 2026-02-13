import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCartStore } from '../store/cartStore';
import { CartItem } from './CartItem';
import { Button } from '@/shared/design-system';
import { TextSkeleton } from '@/shared/components/skeleton';

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const { data: cart, isLoading } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveRef = useRef<Element | null>(null);

  // Focus management: trap focus on open, restore on close
  useEffect(() => {
    if (isOpen) {
      previousActiveRef.current = document.activeElement;
      // Delay to allow rendering before focusing
      const id = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(id);
    } else if (previousActiveRef.current instanceof HTMLElement) {
      previousActiveRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDrawer();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDrawer]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const total = cart?.total ?? 0;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity"
          aria-hidden="true"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={[
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-xl',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-secondary-200 px-4 py-4">
          <h2 className="text-lg font-semibold text-secondary-900">
            Shopping Cart
            {itemCount > 0 && (
              <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                {itemCount}
              </span>
            )}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            className="rounded-md p-1.5 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4">
          {isLoading ? (
            <div className="py-4 space-y-4">
              <TextSkeleton lines={3} />
              <TextSkeleton lines={3} />
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="h-16 w-16 text-secondary-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="mt-4 text-secondary-500 font-medium">Your cart is empty</p>
              <Link
                to="/products"
                onClick={closeDrawer}
                className="mt-4 inline-flex items-center justify-center rounded-md font-medium px-4 py-2 text-sm bg-transparent text-secondary-700 hover:bg-secondary-100 transition-colors"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-secondary-100" aria-label="Cart items">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only visible when cart has items */}
        {cart && cart.items.length > 0 && (
          <div className="border-t border-secondary-200 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Subtotal</span>
              <span className="text-base font-semibold text-secondary-900">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-secondary-500">Shipping and taxes calculated at checkout.</p>
            <Link
              to="/checkout"
              onClick={closeDrawer}
              className="inline-flex w-full items-center justify-center rounded-md font-medium px-5 py-2.5 text-base bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Proceed to checkout
            </Link>
            <Button variant="ghost" size="sm" className="w-full" onClick={closeDrawer}>
              Continue shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
