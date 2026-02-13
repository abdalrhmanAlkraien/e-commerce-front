import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { AdminRoute } from './guards/AdminRoute';
import { CustomerRoute } from './guards/CustomerRoute';
import { LoadingFallback } from '@/shared/components/LoadingFallback';

// Auth
const NotFoundPage = lazy(() => import('@/shared/components/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/shared/components/UnauthorizedPage'));
const LoginPage = lazy(() =>
  import('@/modules/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/modules/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);

// Categories
const CategoryListPage = lazy(() =>
  import('@/modules/categories/pages/CategoryListPage').then((m) => ({
    default: m.CategoryListPage,
  })),
);

// Products
const ProductListPage = lazy(() =>
  import('@/modules/products/pages/ProductListPage').then((m) => ({
    default: m.ProductListPage,
  })),
);
const ProductDetailsPage = lazy(() =>
  import('@/modules/products/pages/ProductDetailsPage').then((m) => ({
    default: m.ProductDetailsPage,
  })),
);

// Checkout (customer-only)
const CheckoutPage = lazy(() =>
  import('@/modules/checkout/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })),
);
const ConfirmationPage = lazy(() =>
  import('@/modules/checkout/pages/ConfirmationPage').then((m) => ({
    default: m.ConfirmationPage,
  })),
);

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: withSuspense(LoginPage) },
      { path: '/register', element: withSuspense(RegisterPage) },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(ProductListPage) },
      { path: '/categories', element: withSuspense(CategoryListPage) },
      { path: '/products', element: withSuspense(ProductListPage) },
      { path: '/products/:slug', element: withSuspense(ProductDetailsPage) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <CustomerRoute />,
        children: [
          { path: '/checkout', element: withSuspense(CheckoutPage) },
          { path: '/order-confirmation/:externalId', element: withSuspense(ConfirmationPage) },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              // Admin portal routes — populated in Phase 6
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/403',
    element: withSuspense(UnauthorizedPage),
  },
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
