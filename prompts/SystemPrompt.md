# System Prompt  Project State Tracker

This file is the canonical record of completed work, file inventory, and phase status for the e-commerce frontend project.

Update this file at the end of every phase or task session.

---

## Project Identity

| Property | Value |
|----------|-------|
| Project | E-Commerce Frontend (SaaS) |
| Stack | React 18+, TypeScript strict, Vite, Tailwind CSS v4, React Query v5, Axios, Zustand v5, React Router v7 |
| Test Stack | Vitest, Testing Library, MSW v2, @vitest/coverage-v8 |
| Build Tool | Vite + `@tailwindcss/vite` |
| Package Manager | npm |
| Path Alias | `@/` ’ `src/` |

---

## Phase Status Overview

| Phase | Name | Status | Tasks |
|-------|------|--------|-------|
| Phase 0 | Project Foundation | COMPLETE | 0.1, 0.2, 0.3 |
| Phase 1 | Infrastructure Layer | COMPLETE | 1.1, 1.2, 1.3, 1.4, 1.5 |
| Phase 2 | Auth & Security Foundation | COMPLETE | 2.1, 2.2, 2.3, 2.4 |
| Phase 3 | UI Infrastructure & Experience Reliability | COMPLETE | 3.1, 3.2, 3.3, 3.4 |
| Phase 4 | Categories, Products, Cart & Checkout | COMPLETE | 4.1, 4.2, 4.3, 4.4, 4.5 |
| Phase 5 | Admin Platform (Operator Control Layer) | COMPLETE | 5.1, 5.2, 5.3, 5.4, 5.5 |
| Phase 6 | Testing Infrastructure & Reliability Layer | COMPLETE | 6.1, 6.2 |

---

## Phase 0  Project Foundation [COMPLETE]

### Task 0.1  Folder Architecture [DONE]

Created full modular folder structure:

```
src/
  modules/
    auth/         components/ hooks/ pages/ api/ types/ __tests__/
    products/     components/ hooks/ pages/ api/ types/ __tests__/
    categories/   components/ hooks/ pages/ api/ types/ __tests__/
    cart/         components/ hooks/ pages/ api/ types/ __tests__/
    checkout/     components/ hooks/ pages/ api/ types/ __tests__/
    orders/       components/ hooks/ pages/ api/ types/ __tests__/
    customers/    components/ hooks/ pages/ api/ types/ __tests__/
    admin/        components/ hooks/ pages/ api/ types/ __tests__/
  shared/
    api/          components/  hooks/  utils/  types/  test/  constants/
  layouts/
  routes/
  providers/
  assets/
  styles/
```

### Task 0.2  Environment Strategy [DONE]

Files created:
- `.env.development`  `VITE_API_BASE_URL=http://localhost:8080`, `VITE_APP_ENV=development`
- `.env.staging`  `VITE_API_BASE_URL=https://api-staging.example.com`, `VITE_APP_ENV=staging`
- `.env.production`  `VITE_API_BASE_URL=https://api.example.com`, `VITE_APP_ENV=production`
- `.env.test`  `VITE_API_BASE_URL=http://localhost:8080`, `VITE_APP_ENV=development`
- `src/shared/config/env.ts`  typed, frozen, fail-fast env accessor (`env.apiBaseUrl`, `env.appEnv`)

### Task 0.3  Core Stack Install [DONE]

Dependencies installed:
- `react-router-dom`, `@tanstack/react-query`, `axios`, `zustand`, `sonner`
- `tailwindcss` (v4), `@tailwindcss/vite`
- `@tanstack/react-query-devtools`
- `openapi-typescript`
- `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `msw`, `@vitest/coverage-v8`
- `prettier`, `eslint-config-prettier`

Configuration files:
- `vite.config.ts`  `defineConfig` from `vitest/config`; Tailwind v4 plugin; `@/` alias; jsdom env; 80% coverage thresholds
- `tsconfig.app.json`  strict mode; `vitest/globals` types; `@/*` path alias
- `.prettierrc`, `.prettierignore`
- `eslint.config.js`  prettier integration
- `src/shared/test/setup.ts`  jest-dom matchers
- `src/shared/test/msw/handlers.ts`, `server.ts`, `browser.ts`

Scripts in `package.json`:
```
dev | build | preview | test | coverage | lint | typecheck | generate:types
```

---

## Phase 1  Infrastructure Layer [COMPLETE]

Validation gate (all passing):
- `npm run typecheck`  0 errors
- `npm run lint`  0 warnings
- `npm run test`  9 files, 49 tests, all pass

---

### Task 1.1  Axios API Client [DONE]

Files created/modified:

**`src/modules/auth/types/auth.types.ts`**
- `UserRole`  `'ADMIN' | 'CUSTOMER'`
- `AuthUser`  `{ id, email, role }`
- `AuthState`  `{ token, user, isAuthenticated }`

**`src/modules/auth/store/authStore.ts`**
- Zustand store with `setAuth(token, user)` and `logout()`
- JWT stored in memory only  never localStorage

**`src/shared/api/apiError.ts`**
- `ApiError` interface  `{ message, status, code? }`
- `ApiErrorInstance` class  extends `Error`, implements `ApiError`
- `isApiError(error)`  type guard

**`src/shared/api/axiosClient.ts`**  *(replaces deleted `axiosInstance.ts`)*
- `axios.create` with `baseURL: env.apiBaseUrl`, `timeout: 10_000`, `Content-Type: application/json`
- Request interceptor  injects `Authorization: Bearer <token>` from `useAuthStore.getState().token`
- Response interceptor  401 ’ `logout()` + throw; all errors ’ `ApiErrorInstance`

Tests: `src/shared/api/__tests__/axiosClient.test.ts` (6 tests), `src/shared/api/__tests__/apiError.test.ts` (8 tests)

---

### Task 1.2  Global Error Handling [DONE]

**`src/shared/utils/errorMapper.ts`**
- Maps `ApiErrorInstance` status codes to safe user messages
- Status map: `0` (network), `401`, `403`, `404`, `500`  all others ’ generic fallback

**`src/shared/components/ErrorBoundary.tsx`**
- Class component (React requirement for render error catching)
- `getDerivedStateFromError` ’ sets `hasError: true`
- `handleReset` ’ clears error state
- Accepts optional `fallback` prop; default fallback has `role="alert"` and "Try again" button

Tests: `src/shared/utils/__tests__/errorMapper.test.ts` (8 tests), `src/shared/components/__tests__/ErrorBoundary.test.tsx` (4 tests)

---

### Task 1.3  DTO Generator [DONE]

**`src/shared/types/api.ts`**
- Bootstrap stub in openapi-typescript v7 format
- Covers all endpoints from `ApiIndex.md`: auth, public products, categories, cart, checkout, orders, admin
- Header comment: `// AUTO-GENERATED  DO NOT EDIT MANUALLY. Regenerate with: npm run generate:types`
- `paths`, `components.schemas` (RegisterRequest, LoginRequest, AuthResponse, UserDto, CategoryDto, ProductDto, CartDto, OrderDto, etc.)

Generation script: `npm run generate:types` ’ `openapi-typescript http://localhost:8080/api-docs -o src/shared/types/api.ts`

Tests: `src/shared/types/__tests__/api.types.test.ts` (5 type compilation tests via `expectTypeOf`)

---

### Task 1.4  React Query Provider [DONE]

**`src/shared/api/queryClient.ts`**
- `staleTime: 60_000`, `retry: 2`, `refetchOnWindowFocus: false`
- Global mutation `onError` ’ `toast.error(mapApiErrorToMessage(error))`

**`src/providers/QueryProvider.tsx`**
- Wraps `QueryClientProvider`
- Renders `<ReactQueryDevtools initialIsOpen={false} />` only when `env.appEnv === 'development'`

Tests: `src/shared/api/__tests__/queryClient.test.ts` (6 tests), `src/providers/__tests__/QueryProvider.test.tsx` (2 tests)

---

### Task 1.5  Routing System [DONE]

**Layouts:**
- `src/layouts/PublicLayout.tsx`  header + `<Outlet />` + footer
- `src/layouts/AuthLayout.tsx`  centered card layout
- `src/layouts/AdminLayout.tsx`  sidebar (gray-900) + main area

**Route Guards:**
- `src/routes/guards/ProtectedRoute.tsx`  redirects to `/login` if not authenticated
- `src/routes/guards/AdminRoute.tsx`  redirects to `/login` (unauthenticated) or `/` (non-ADMIN)
- `src/routes/guards/CustomerRoute.tsx`  redirects to `/` if role is not `CUSTOMER`

**Central route registry:**
- `src/routes/index.tsx`  `createBrowserRouter` with lazy loading via `React.lazy()`; `AppRoutes` component using `RouterProvider`
- `src/shared/components/LoadingFallback.tsx`  Suspense fallback spinner
- `src/shared/components/NotFoundPage.tsx`  `*` catch-all route

**App wiring:**
- `src/providers/AppProviders.tsx`  `ErrorBoundary` > `QueryProvider` > `Toaster`
- `src/App.tsx`  `AppProviders` > `AppRoutes`

Tests: `src/routes/__tests__/guards.test.tsx` (7 tests)

---

## File Inventory (All Created/Modified)

### Configuration
| File | Status |
|------|--------|
| `vite.config.ts` | Modified |
| `tsconfig.app.json` | Modified |
| `package.json` | Modified |
| `eslint.config.js` | Modified |
| `.prettierrc` | Created |
| `.prettierignore` | Created |
| `.env.development` | Created |
| `.env.staging` | Created |
| `.env.production` | Created |
| `.env.test` | Created |

### Source Files
| File | Phase | Task |
|------|-------|------|
| `src/shared/config/env.ts` | 0 | 0.2 |
| `src/shared/test/setup.ts` | 0 | 0.3 |
| `src/shared/test/msw/handlers.ts` | 0 | 0.3 |
| `src/shared/test/msw/server.ts` | 0 | 0.3 |
| `src/shared/test/msw/browser.ts` | 0 | 0.3 |
| `src/styles/global.css` | 0 | 0.3 |
| `src/modules/auth/types/auth.types.ts` | 1 | 1.1 |
| `src/modules/auth/store/authStore.ts` | 1 | 1.1 |
| `src/shared/api/apiError.ts` | 1 | 1.1 |
| `src/shared/api/axiosClient.ts` | 1 | 1.1 |
| `src/shared/utils/errorMapper.ts` | 1 | 1.2 |
| `src/shared/components/ErrorBoundary.tsx` | 1 | 1.2 |
| `src/shared/types/api.ts` | 1 | 1.3 |
| `src/shared/api/queryClient.ts` | 0/1 | 0.3 / 1.4 |
| `src/providers/QueryProvider.tsx` | 1 | 1.4 |
| `src/layouts/PublicLayout.tsx` | 1 | 1.5 |
| `src/layouts/AuthLayout.tsx` | 1 | 1.5 |
| `src/layouts/AdminLayout.tsx` | 1 | 1.5 |
| `src/routes/guards/ProtectedRoute.tsx` | 1 | 1.5 |
| `src/routes/guards/AdminRoute.tsx` | 1 | 1.5 |
| `src/routes/guards/CustomerRoute.tsx` | 1 | 1.5 |
| `src/routes/index.tsx` | 1 | 1.5 |
| `src/shared/components/LoadingFallback.tsx` | 1 | 1.5 |
| `src/shared/components/NotFoundPage.tsx` | 1 | 1.5 |
| `src/providers/AppProviders.tsx` | 0/1 | 0.3 / 1.5 |
| `src/App.tsx` | 0/1 | 0.3 / 1.5 |
| `src/main.tsx` | 0 | 0.3 |

### Test Files
| File | Tests | Phase |
|------|-------|-------|
| `src/shared/config/__tests__/env.test.ts` | 3 | 0 |
| `src/shared/api/__tests__/queryClient.test.ts` | 6 | 0/1 |
| `src/shared/api/__tests__/apiError.test.ts` | 8 | 1 |
| `src/shared/api/__tests__/axiosClient.test.ts` | 6 | 1 |
| `src/shared/utils/__tests__/errorMapper.test.ts` | 8 | 1 |
| `src/shared/components/__tests__/ErrorBoundary.test.tsx` | 4 | 1 |
| `src/shared/types/__tests__/api.types.test.ts` | 5 | 1 |
| `src/providers/__tests__/QueryProvider.test.tsx` | 2 | 1 |
| `src/routes/__tests__/guards.test.tsx` | 7 | 1 |
| **Total** | **49** | |

---

## Deleted Files

| File | Reason |
|------|--------|
| `src/shared/api/axiosInstance.ts` | Replaced by `axiosClient.ts` in Task 1.1 |

---

## Known Constraints / Rules In Effect

- JWT is **never** stored in localStorage  Zustand in-memory only
- No inline `import.meta.env` usage outside `src/shared/config/env.ts`
- No inline axios calls outside `src/shared/api/axiosClient.ts`
- `src/shared/types/api.ts` is auto-generated  never edit manually
- Route guards use `<Outlet />` pattern  never render restricted content
- `ErrorBoundary` must be a class component (React requirement)
- DevTools (`ReactQueryDevtools`) render only when `env.appEnv === 'development'`
- Tailwind v4  no `tailwind.config.js`; uses `@tailwindcss/vite` plugin + `@import "tailwindcss"` in CSS
- `axiosClient.test.ts` requires `// @vitest-environment node` for MSW node server interception

---

---

## Phase 2 -- Auth & Security Foundation [COMPLETE]

Validation gate (all passing):
- `npm run typecheck` -- 0 errors
- `npm run lint` -- 0 warnings
- `npm run test` -- 16 files, 86 tests, all pass

### Task 2.1 -- Auth Module [DONE]

**`src/modules/auth/api/auth.api.ts`** -- `authApi.login` / `authApi.register`, types from `api.ts`
**`src/modules/auth/utils/authSchemas.ts`** -- `loginSchema`, `registerSchema` (Zod)
**`src/modules/auth/hooks/useLogin.ts`** -- useMutation; onSuccess navigates ADMIN->/admin, CUSTOMER->/
**`src/modules/auth/hooks/useRegister.ts`** -- useMutation; onSuccess navigates to /
**`src/modules/auth/hooks/useLogout.ts`** -- logout() + queryClient.clear() + navigate(/login)
**`src/modules/auth/hooks/useCurrentUser.ts`** -- useShallow selector (avoids infinite re-render)
**`src/modules/auth/pages/LoginPage.tsx`** -- RHF + zodResolver; loading state, accessible inputs
**`src/modules/auth/pages/RegisterPage.tsx`** -- RHF + zodResolver; firstName/lastName/email/password

### Task 2.2 -- Token Lifecycle [DONE]

**`src/shared/api/axiosClient.ts`** -- 401 now calls toast.error('Session expired...')
**`src/modules/auth/store/authStore.ts`** -- logout() broadcasts via BroadcastChannel('auth:logout')
**`src/modules/auth/utils/authBroadcast.ts`** -- initAuthBroadcastSync() listener; called from main.tsx

### Task 2.3 -- Route Protection [DONE]

**`src/shared/components/UnauthorizedPage.tsx`** -- 403 page
**`src/routes/guards/AdminRoute.tsx`** -- non-ADMIN now redirects to /403 (was /)
**`src/routes/index.tsx`** -- /login, /register, /403 routes added; lazy-loaded
**`src/main.tsx`** -- initAuthBroadcastSync() called on boot

### Task 2.4 -- Auth Tests [DONE]

| File | Tests |
|------|-------|
| authStore.test.ts | 6 |
| authSchemas.test.ts | 10 |
| useCurrentUser.test.ts | 3 |
| useLogout.test.tsx | 2 |
| LoginPage.test.tsx | 8 |
| RegisterPage.test.tsx | 6 |
| tokenLifecycle.test.ts | 2 |
| **Phase 2 new tests** | **37** |

Key fixes applied during Phase 2:
- BroadcastChannel mock must use `class MockBC` (not arrow fn) for `new` compatibility
- `useCurrentUser` uses `useShallow` from `zustand/react/shallow` to prevent infinite loop
- MSW v2 node server intercepts XHR in jsdom via `@mswjs/interceptors`
- token lifecycle tests use `@vitest-environment node`

---

---

## Phase 3 -- UI Infrastructure & Experience Reliability [COMPLETE]

Validation gate (all passing):
- `npm run typecheck` -- 0 errors
- `npm run lint` -- 0 warnings
- `npm run test` -- 21 files, 139 tests, all pass

### Task 3.1 -- Design System Foundation [DONE]

**`src/styles/global.css`** -- Added Tailwind v4 `@theme` block with full color scale (primary/secondary/success/warning/error), font-family tokens

**`src/shared/design-system/tokens/colors.ts`** -- TypeScript color constants matching CSS custom properties
**`src/shared/design-system/tokens/typography.ts`** -- Font family, scale (xs--5xl), weights, line-heights
**`src/shared/design-system/tokens/spacing.ts`** -- 4px-grid spacing scale (0--64)
**`src/shared/design-system/tokens/index.ts`** -- Token barrel export

**`src/shared/design-system/components/Button.tsx`**
- 5 variants: primary / secondary / outline / ghost / danger
- 3 sizes: sm / md / lg
- loading state (aria-busy + spinner), disabled, leftIcon/rightIcon support
- Full keyboard + aria accessibility

**`src/shared/design-system/components/Input.tsx`**
- label, error (aria-invalid + aria-describedby), helperText
- Password toggle (show/hide with accessible button + icons)
- leftAdornment / rightAdornment slots

**`src/shared/design-system/components/Card.tsx`** -- padding and shadow variants, forwards HTML attrs
**`src/shared/design-system/components/Container.tsx`** -- size variants (sm/md/lg/xl/full), padded flag
**`src/shared/design-system/index.ts`** -- Design system barrel export

Tests: `src/shared/design-system/__tests__/Button.test.tsx` (15), `Input.test.tsx` (10), `Card.test.tsx` (9)

---

### Task 3.2 -- Toast System [DONE]

**`src/shared/components/toast/useToast.ts`**
- Thin wrapper over sonner with fixed durations: success 4s, error 6s, loading Infinity
- Exposes: success, error, loading, dismiss, promise

**`src/shared/components/toast/index.ts`** -- Barrel export

`<Toaster>` already mounted in `AppProviders.tsx` (Phase 1).
`queryClient` global mutation error handler already calls `toast.error` (Phase 1).

Tests: `src/shared/components/toast/__tests__/useToast.test.ts` (6)

---

### Task 3.3 -- Error Boundary [DONE]

**`src/shared/components/error-boundary/index.ts`** -- Re-exports existing `ErrorBoundary` class component

Existing implementation at `src/shared/components/ErrorBoundary.tsx` already satisfies all task requirements:
- getDerivedStateFromError / componentDidCatch with console.error
- Default fallback with role="alert", "Try again" button, no stack trace exposure
- Optional `fallback` prop for custom UIs
- Mounted at app root in `AppProviders`

---

### Task 3.4 -- Loading Skeletons [DONE]

**`src/shared/components/skeleton/Skeleton.tsx`** -- Base primitive with animate-pulse, role=status, aria-busy=true
**`src/shared/components/skeleton/TextSkeleton.tsx`** -- N-line text block, shorter last line
**`src/shared/components/skeleton/CardSkeleton.tsx`** -- [image] + title + body lines + action row
**`src/shared/components/skeleton/TableRowSkeleton.tsx`** -- rows x columns grid with natural width variation
**`src/shared/components/skeleton/AvatarSkeleton.tsx`** -- Circular avatar + optional name/subtitle lines
**`src/shared/components/skeleton/index.ts`** -- Barrel export

Tests: `src/shared/components/skeleton/__tests__/Skeleton.test.tsx` (13)

---

## Phase 3 Added Constraints

- Design system uses Tailwind v4 only -- no tailwind.config.js; tokens via `@theme` in global.css
- All new UI code MUST import primitives from `@/shared/design-system`
- Loading states MUST use skeleton components, NOT full-page spinners
- Toast calls MUST go through `useToast` hook -- no direct sonner imports
- ErrorBoundary wraps router root and module roots

---

*Last updated: Phase 6 complete -- 306/306 tests passing, typecheck clean, lint clean, all coverage thresholds met (≥80% branches/functions/statements/lines).*

---

## Phase 4 -- Categories, Products, Cart & Checkout [COMPLETE]

Validation gate (all passing):
- `npm run typecheck` -- 0 errors
- `npm run lint` -- 0 warnings
- `npm run test` -- 221/221 tests, all pass
- Coverage: 91.98% statements / 88.11% branches / 91.5% functions / 93.17% lines

---

### Task 4.1 -- Categories Module [DONE]

**`src/modules/categories/api/categories.api.ts`** -- `categoriesApi.list` uses `GET /api/v1/public/categories`; returns `CategoryDto[]` directly (NOT paginated)
- **Bug fixed**: Was `return response.data.content` (`.content` undefined); corrected to `return response.data`

**`src/modules/categories/hooks/useCategories.ts`** -- `useCategories()` / `useCategory(slug)` with `staleTime: 5–10 min`; `categoryKeys` factory

**`src/modules/categories/components/CategoryNav.tsx`** -- Horizontal nav of category links; highlights active category from URL param

**`src/modules/categories/pages/CategoryListPage.tsx`** -- Public page listing all categories with loading skeleton

**`src/modules/categories/index.ts`** -- Barrel export (was empty; populated with all module exports)

**`src/shared/test/msw/handlers/categories.handlers.ts`** -- MSW handlers for `GET /api/v1/public/categories`

---

### Task 4.2 -- Products Module [DONE]

**`src/modules/products/api/products.api.ts`**
- `productsApi.list` -- `GET /api/v1/public/products` with query params (categorySlug, search, page, pageSize)
- `productsApi.getBySlug` -- `GET /api/v1/public/products/{slug}`
- `PaginatedProducts` interface uses `items: ProductDto[]` (NOT `content`)
- **Bug fixed**: Was `content: ProductDto[]`; corrected to `items: ProductDto[]`

**`src/modules/products/hooks/useProducts.ts`** -- `useProducts(params)`, `useProductDetails(slug)`, `usePrefetchProduct(slug)` (hover prefetch via `queryClient.prefetchQuery`); `productKeys` factory

**`src/modules/products/components/ProductCard.tsx`**
- Renders product name, price, image (with `aria-hidden` image link for prefetch)
- "Add to cart" button (only when `onAddToCart` prop provided AND stock > 0)
- "Out of stock" badge when `stock === 0`
- `onMouseEnter`/`onFocus` triggers `usePrefetchProduct`

**`src/modules/products/pages/ProductListPage.tsx`**
- Search form with `aria-label="Search products"` input and Search / Clear filters buttons
- Category navigation via `CategoryNav`
- Pagination controls (`aria-label="Pagination"`, Previous/Next page buttons)
- Empty state: "No products found." with Clear filters button
- Loading: 12 `CardSkeleton` instances
- Error: re-throws to `ErrorBoundary`
- **Bug fixed**: Two occurrences of `data.content` corrected to `data.items`

**`src/modules/products/pages/ProductDetailsPage.tsx`**
- Loading skeleton while fetching
- 404 handling: `role="alert"` with "Product not found" for unknown slug
- "In stock" / "Out of stock" `role="status"` badge
- "Add to cart" button: `aria-label="Add {name} to cart"`, disabled when out-of-stock
- Category breadcrumb link
- Add-to-cart triggers cart mutation + opens cart drawer on success

**`src/modules/products/index.ts`** -- Barrel export (was empty; populated with all module exports)

**`src/shared/test/msw/handlers/products.handlers.ts`** -- MSW handlers for list + getBySlug

Tests: `src/modules/products/__tests__/productDiscovery.test.tsx` (see test section below)

---

### Task 4.3 -- Cart System [DONE]

**`src/modules/cart/api/cart.api.ts`** -- Full CRUD:
- `POST /api/v1/cart` -- create cart (returns `cartId` + `sessionId`)
- `GET /api/v1/cart/{cartId}` -- fetch cart (`X-SESSION-ID` header required)
- `POST /api/v1/cart/{cartId}/items` -- add item
- `PUT /api/v1/cart/{cartId}/items/{itemId}` -- update quantity
- `DELETE /api/v1/cart/{cartId}/items/{itemId}` -- remove item

**`src/modules/cart/store/cartStore.ts`** -- Zustand store: `cartId`, `sessionId`, `isDrawerOpen`; `sessionId` persisted to `localStorage` as recovery fallback

**`src/modules/cart/hooks/useCart.ts`**
- `useCart()` -- fetches current cart by cartId from store
- `useCreateCart()` -- creates cart and stores IDs
- `useAddToCart()` -- optimistic add with rollback on error
- `useUpdateCartItem()` -- optimistic quantity update with rollback
- `useRemoveCartItem()` -- optimistic removal with rollback
- All mutations inject `X-SESSION-ID` header

**`src/shared/test/msw/handlers/cart.handlers.ts`** -- MSW handlers for all cart endpoints

---

### Task 4.4 -- Checkout [DONE]

**`src/modules/checkout/api/checkout.api.ts`** -- `checkoutApi.createOrder`: `POST /api/v1/checkout/create-order`

**`src/modules/checkout/utils/checkoutSchemas.ts`** -- Zod schema for checkout form (shipping address, payment method)

**`src/modules/checkout/hooks/useCheckout.ts`** -- `useMutation`; on success navigates to `/order-confirmation/:externalId`

**`src/modules/checkout/pages/CheckoutPage.tsx`** -- RHF + zodResolver; shipping address fields; submit calls checkout mutation

**`src/modules/checkout/pages/OrderConfirmationPage.tsx`** -- Renders order summary for confirmed order; reads `externalId` from route params

---

### Task 4.5 -- Refund Requests [DONE]

**Refund API**: `POST /api/v1/public/orders/{externalId}/refund-request`

**`RefundForm`** component -- RHF + Zod; reason field; submits refund request mutation

**Status display** -- Shows `PENDING` status after successful submission

---

### Phase 4 Bug Fixes Summary

| File | Bug | Fix |
|------|-----|-----|
| `src/modules/categories/api/categories.api.ts` | `response.data.content` — `.content` is undefined; API returns `CategoryDto[]` directly | Changed to `response.data` |
| `src/modules/products/api/products.api.ts` | `PaginatedProducts.content: ProductDto[]` — wrong field name | Renamed to `items: ProductDto[]` |
| `src/modules/products/pages/ProductListPage.tsx` | Two runtime `data.content` accesses | Changed both to `data.items` |
| `src/modules/categories/index.ts` | Empty file — no exports | Added full barrel exports |
| `src/modules/products/index.ts` | Empty file — no exports | Added full barrel exports |

---

### Phase 4 File Inventory

| File | Status | Task |
|------|--------|------|
| `src/modules/categories/api/categories.api.ts` | Bug fixed | 4.1 |
| `src/modules/categories/hooks/useCategories.ts` | Complete | 4.1 |
| `src/modules/categories/components/CategoryNav.tsx` | Complete | 4.1 |
| `src/modules/categories/pages/CategoryListPage.tsx` | Complete | 4.1 |
| `src/modules/categories/index.ts` | Populated (was empty) | 4.1 |
| `src/shared/test/msw/handlers/categories.handlers.ts` | Complete | 4.1 |
| `src/modules/products/api/products.api.ts` | Bug fixed | 4.2 |
| `src/modules/products/hooks/useProducts.ts` | Complete | 4.2 |
| `src/modules/products/components/ProductCard.tsx` | Complete | 4.2 |
| `src/modules/products/pages/ProductListPage.tsx` | Bug fixed | 4.2 |
| `src/modules/products/pages/ProductDetailsPage.tsx` | Complete | 4.2 |
| `src/modules/products/index.ts` | Populated (was empty) | 4.2 |
| `src/shared/test/msw/handlers/products.handlers.ts` | Complete | 4.2 |
| `src/modules/cart/api/cart.api.ts` | Complete | 4.3 |
| `src/modules/cart/store/cartStore.ts` | Complete | 4.3 |
| `src/modules/cart/hooks/useCart.ts` | Complete | 4.3 |
| `src/shared/test/msw/handlers/cart.handlers.ts` | Complete | 4.3 |
| `src/modules/checkout/api/checkout.api.ts` | Complete | 4.4 |
| `src/modules/checkout/utils/checkoutSchemas.ts` | Complete | 4.4 |
| `src/modules/checkout/hooks/useCheckout.ts` | Complete | 4.4 |
| `src/modules/checkout/pages/CheckoutPage.tsx` | Complete | 4.4 |
| `src/modules/checkout/pages/OrderConfirmationPage.tsx` | Complete | 4.4 |

### Phase 4 Test Files

| File | New Tests | Notes |
|------|-----------|-------|
| `src/modules/products/__tests__/productDiscovery.test.tsx` | 15 new (21 total) | Search, pagination, empty state, clear filters, out-of-stock, add-to-cart, ProductCard unit suite |
| Phase 4 total new tests | **82** | 139 (Phase 3) → 221 (Phase 4) |

### Phase 4 Test Fix Notes

- `ProductDetailsPage` out-of-stock button keeps `aria-label="Add {name} to cart"` regardless of stock — query by aria-label, assert `toBeDisabled()`, not by button text
- `ProductCard` image is inside `<Link aria-hidden="true">` — use `getByAltText` not `getByRole('img')`
- Hover-prefetch test queries `container.querySelector('a[aria-hidden="true"]')` directly (not in ARIA tree)
- `renderCard` callback typed as `(p: typeof mockProduct) => void` to match `ProductCard` prop signature

---

## Phase 4 Added Constraints

- `GET /api/v1/public/categories` returns `CategoryDto[]` directly — NOT wrapped in a paginated object
- All cart requests after cart creation MUST include `X-SESSION-ID` header
- Cart IDs are server-driven — never generate client-side IDs
- Optimistic updates MUST cancel in-flight queries, snapshot previous cache, and restore on error
- `usePrefetchProduct` MUST be called on `onMouseEnter`/`onFocus` of product links — not on render
- `ProductDetailsPage` re-throws non-404 errors to `ErrorBoundary`; 404 renders inline `role="alert"`
- Checkout redirects to `/order-confirmation/:externalId` — never hardcode order IDs
- All form validation goes through Zod + `zodResolver` — no manual validation logic

---

## Phase 5 -- Admin Platform (Operator Control Layer) [COMPLETE]

Validation gate (all passing):
- `npm run typecheck` -- 0 errors
- `npm run lint` -- 0 warnings
- `npm run test` -- 34 files, 246 tests, all pass (221 → 246, +25 tests)

---

### Task 5.1 -- Admin Layout [DONE]

**`src/layouts/AdminLayout.tsx`** (updated from shell)
- Config-driven `NAV_ITEMS` array drives sidebar `<NavLink>` items: Dashboard, Categories, Products, Orders, Customers
- Active link uses `bg-gray-700 text-white`; inactive uses `text-gray-300 hover:bg-gray-800`
- `/admin` link uses `end` prop to prevent it matching all `/admin/*` paths
- Header shows `user.email` (`data-testid="admin-user-email"`) + Logout button
- Logout calls `useAuthStore().logout()` then `navigate('/login', { replace: true })`

---

### Task 5.2 -- Admin Categories CRUD [DONE]

**`src/modules/admin/api/admin.api.ts`** (extended)
- `AdminCreateCategoryRequest = Omit<CategoryDto, 'id'>` -- `{ name, slug }`
- `AdminUpdateCategoryRequest = Partial<AdminCreateCategoryRequest>`
- `adminApi.listCategories` -- `GET /api/v1/admin/categories` → `CategoryDto[]` (NOT paginated)
- `adminApi.createCategory` -- `POST /api/v1/admin/categories`
- `adminApi.updateCategory(id, data)` -- `PUT /api/v1/admin/categories/{id}`
- `adminApi.deleteCategory(id)` -- `DELETE /api/v1/admin/categories/{id}` (204)

**`src/modules/admin/hooks/useAdminCategories.ts`** (new)
- `adminCategoryKeys` -- `all`, `list`
- `useAdminListCategories()`, `useAdminCreateCategory()`, `useAdminUpdateCategory()`
- `useAdminDeleteCategory()` -- 409 Conflict surfaced via `isApiError(err) && err.status === 409`

**`src/modules/admin/categories/components/CategoryTable.tsx`** -- Edit / Delete action buttons per row
**`src/modules/admin/categories/components/CategoryForm.tsx`** -- Auto-generates slug from name on create; controlled inputs
**`src/modules/admin/categories/pages/AdminCategoriesPage.tsx`** -- Inline create/edit form toggle; ConfirmModal on delete

---

### Task 5.3 -- Admin Products [DONE]

**`src/modules/admin/api/admin.api.ts`** (extended)
- `PaginatedAdminProducts { items, total, page, pageSize }`
- `AdminListProductsParams { search?, categoryId?, page?, pageSize? }`
- `adminApi.listProducts(params?)` -- `GET /api/v1/admin/products`

**`src/modules/admin/hooks/useAdminProducts.ts`** (extended)
- `adminProductKeys.list(params)` added
- `useAdminListProducts(params?)` query added

**`src/shared/api/contentApi.ts`** (new)
- `ContentUploadResponse { id: string; url: string }`
- `contentApi.upload(file: File)` -- `POST /api/v1/content/upload` with `multipart/form-data`

**`src/modules/admin/products/components/ImageUpload.tsx`** -- File picker triggers upload; shows preview on success; error state on failure
**`src/modules/admin/products/components/ProductForm.tsx`** -- name/slug/description/price/stock/category/image; auto-generates slug
**`src/modules/admin/products/components/ProductTable.tsx`** -- Stock=0 renders red text; Edit/Delete action buttons
**`src/modules/admin/products/pages/AdminProductsPage.tsx`** -- Inline form + ConfirmModal for delete

---

### Task 5.4 -- Orders Management [DONE]

**`src/modules/admin/api/admin.api.ts`** (extended)
- `PaginatedOrders { items, total, page, pageSize }`
- `AdminListOrdersParams { status?, page?, pageSize? }`
- `adminApi.listOrders(params?)` -- `GET /api/v1/admin/orders`
- `adminApi.getOrder(externalId)` -- `GET /api/v1/admin/orders/{externalId}`
- `adminApi.refundOrder(externalId)` -- `POST /api/v1/admin/orders/{externalId}/refund`

**`src/modules/admin/hooks/useAdminOrders.ts`** (extended)
- `adminOrderKeys.list(params)`, `adminOrderKeys.detail(externalId)` added
- `useAdminListOrders(params?)`, `useAdminOrderDetails(externalId)`, `useAdminRefundOrder()` added

**`src/modules/admin/orders/components/OrdersTable.tsx`** -- Links each row to `/admin/orders/:externalId`; StatusBadge per row
**`src/modules/admin/orders/components/StatusUpdateControl.tsx`** -- `<select>` for status transition + "Update Status" button
**`src/modules/admin/orders/components/RefundAction.tsx`** -- Rendered only when status ∈ {DELIVERED, CONFIRMED, SHIPPED}; ConfirmModal guards execution
**`src/modules/admin/orders/pages/AdminOrdersPage.tsx`** -- Lists all orders
**`src/modules/admin/orders/pages/AdminOrderDetailsPage.tsx`** -- Shows details, shipping address, items, status control, refund button

---

### Task 5.5 -- Customer Management [DONE]

**`src/modules/admin/api/admin.api.ts`** (extended)
- `AdminCustomerDto = UserDto & { enabled: boolean; createdAt?: string }` -- local extension, avoids editing auto-generated api.ts
- `PaginatedCustomers { items, total, page, pageSize }`
- `AdminListCustomersParams { search?, page?, pageSize? }`
- `adminApi.listCustomers`, `getCustomer`, `enableCustomer`, `disableCustomer`

**`src/modules/admin/hooks/useAdminCustomers.ts`** (new)
- `adminCustomerKeys.all`, `.list(params)`, `.detail(id)`
- `useAdminListCustomers(params?)`, `useAdminCustomerDetails(id)`
- `useAdminEnableCustomer()`, `useAdminDisableCustomer()` -- both invalidate `all` + `detail`

**`src/modules/admin/customers/components/CustomersTable.tsx`** -- ENABLED/DISABLED StatusBadge; links to detail page
**`src/modules/admin/customers/components/EnableDisableControl.tsx`** -- Requires ConfirmModal confirmation before toggling
**`src/modules/admin/customers/pages/AdminCustomersPage.tsx`** -- Lists all customers
**`src/modules/admin/customers/pages/AdminCustomerDetailsPage.tsx`** -- Full customer detail view + EnableDisableControl

---

### Phase 5 Shared Components

**`src/modules/admin/components/ConfirmModal.tsx`** -- Generic confirmation modal; `destructive` prop for red confirm button; guards delete, disable, refund
**`src/modules/admin/components/StatusBadge.tsx`** -- Status → colour map for order statuses + ENABLED/DISABLED

---

### Phase 5 MSW Updates

**`src/shared/test/msw/fixtures/index.ts`** (extended)
- `mockOrderPage`, `mockCustomer`, `mockDisabledCustomer`, `mockCustomerPage` added

**`src/shared/test/msw/handlers/admin.handlers.ts`** (extended)
- `POST /api/v1/admin/orders/:externalId/refund` → `{ ...mockOrder, status: 'REFUNDED' }`
- `GET /api/v1/admin/customers` → `mockCustomerPage`
- `GET /api/v1/admin/customers/:id` → `mockCustomer`
- `PUT /api/v1/admin/customers/:id/enable` → `{ ...mockCustomer, enabled: true }`
- `PUT /api/v1/admin/customers/:id/disable` → `{ ...mockCustomer, enabled: false }`
- `POST /api/v1/content/upload` → `{ id: 'file-1', url: 'https://cdn.example.com/file-1.jpg' }`

---

### Phase 5 Routes Wired

**`src/routes/index.tsx`** (updated)

| Path | Component |
|------|-----------|
| `/admin` | `AdminDashboardPage` |
| `/admin/categories` | `AdminCategoriesPage` |
| `/admin/products` | `AdminProductsPage` |
| `/admin/orders` | `AdminOrdersPage` |
| `/admin/orders/:externalId` | `AdminOrderDetailsPage` |
| `/admin/customers` | `AdminCustomersPage` |
| `/admin/customers/:id` | `AdminCustomerDetailsPage` |

All routes sit inside `<AdminRoute>` (ADMIN role guard) → `<AdminLayout>`.

---

### Phase 5 File Inventory

| File | Action | Task |
|------|--------|------|
| `src/layouts/AdminLayout.tsx` | Updated | 5.1 |
| `src/routes/index.tsx` | Updated (7 admin routes) | 5.1 |
| `src/modules/admin/index.ts` | Updated (all hooks + components) | 5.1 |
| `src/modules/admin/api/admin.api.ts` | Extended (categories, list products, list/get/refund orders, customers) | 5.2–5.5 |
| `src/shared/api/contentApi.ts` | New | 5.3 |
| `src/modules/admin/components/ConfirmModal.tsx` | New | 5.1 |
| `src/modules/admin/components/StatusBadge.tsx` | New | 5.1 |
| `src/modules/admin/pages/AdminDashboardPage.tsx` | New | 5.1 |
| `src/modules/admin/hooks/useAdminCategories.ts` | New | 5.2 |
| `src/modules/admin/hooks/useAdminProducts.ts` | Extended (list query) | 5.3 |
| `src/modules/admin/hooks/useAdminOrders.ts` | Extended (list, detail, refund) | 5.4 |
| `src/modules/admin/hooks/useAdminCustomers.ts` | New | 5.5 |
| `src/modules/admin/categories/components/CategoryTable.tsx` | New | 5.2 |
| `src/modules/admin/categories/components/CategoryForm.tsx` | New | 5.2 |
| `src/modules/admin/categories/pages/AdminCategoriesPage.tsx` | New | 5.2 |
| `src/modules/admin/products/components/ImageUpload.tsx` | New | 5.3 |
| `src/modules/admin/products/components/ProductForm.tsx` | New | 5.3 |
| `src/modules/admin/products/components/ProductTable.tsx` | New | 5.3 |
| `src/modules/admin/products/pages/AdminProductsPage.tsx` | New | 5.3 |
| `src/modules/admin/orders/components/OrdersTable.tsx` | New | 5.4 |
| `src/modules/admin/orders/components/StatusUpdateControl.tsx` | New | 5.4 |
| `src/modules/admin/orders/components/RefundAction.tsx` | New | 5.4 |
| `src/modules/admin/orders/pages/AdminOrdersPage.tsx` | New | 5.4 |
| `src/modules/admin/orders/pages/AdminOrderDetailsPage.tsx` | New | 5.4 |
| `src/modules/admin/customers/components/CustomersTable.tsx` | New | 5.5 |
| `src/modules/admin/customers/components/EnableDisableControl.tsx` | New | 5.5 |
| `src/modules/admin/customers/pages/AdminCustomersPage.tsx` | New | 5.5 |
| `src/modules/admin/customers/pages/AdminCustomerDetailsPage.tsx` | New | 5.5 |
| `src/shared/test/msw/fixtures/index.ts` | Extended | 5.4–5.5 |
| `src/shared/test/msw/handlers/admin.handlers.ts` | Extended | 5.4–5.5 |
| `src/modules/admin/__tests__/adminCriticalPaths.test.tsx` | Extended (+14 tests) | 5.2–5.5 |
| `src/modules/admin/__tests__/adminPages.test.tsx` | New (11 page tests) | 5.1–5.5 |

---

### Phase 5 Test Files

| File | Tests | Notes |
|------|-------|-------|
| `adminCriticalPaths.test.tsx` | 19 (was 5, +14) | categories CRUD, product delete, list products, order list/detail/refund, customer enable/disable |
| `adminPages.test.tsx` | 11 (new) | Page render tests for all 6 admin pages |
| **Phase 5 new tests** | **+25** | 221 (Phase 4) → 246 (Phase 5) |

---

## Phase 5 Added Constraints

- `AdminCustomerDto` is defined as `UserDto & { enabled: boolean; createdAt?: string }` -- never edit auto-generated `api.ts` to add fields
- `GET /api/v1/admin/categories` returns `CategoryDto[]` directly -- NOT paginated
- Refund action is only rendered for orders with status ∈ `{DELIVERED, CONFIRMED, SHIPPED}`
- ALL destructive operations (delete, disable, refund) MUST be gated by `ConfirmModal` confirmation
- Content upload uses `multipart/form-data` -- never send JSON for file uploads
- Admin sidebar uses config-driven `NAV_ITEMS` array -- never hardcode `<NavLink>` directly in JSX
- `refundOrder` endpoint is `POST /api/v1/admin/orders/{externalId}/refund` -- not in api.ts paths; implemented via `OrderDto` response type

---

## Phase 6 -- Testing Infrastructure & Reliability Layer [COMPLETE]

Validation gate (all passing):
- `npm run typecheck` -- 0 errors
- `npm run lint` -- 0 warnings
- `npm run test` -- 37 files, 306 tests, all pass (246 → 306, +60 tests)
- `npm run coverage` -- all thresholds met: branches 87.19% / functions 84.55% / statements 91.44% / lines 89.35% (all ≥ 80%)

---

### Task 6.1 -- MSW Setup [DONE]

MSW v2 infrastructure was completed in prior phases. Confirmed working:
- `src/shared/test/msw/handlers/` -- per-module handler files: `admin.handlers.ts`, `products.handlers.ts`, `categories.handlers.ts`, `cart.handlers.ts`
- `src/shared/test/msw/fixtures/index.ts` -- shared mock data (`mockProduct`, `mockCategory`, `mockOrder`, `mockCustomer`, `mockDisabledCustomer`, etc.)
- All test files use `setupServer(...handlers)` with `beforeAll/afterEach/afterAll` lifecycle management

---

### Task 6.2 -- Coverage Threshold Enforcement [DONE]

Coverage thresholds configured in `vite.config.ts`:
```ts
thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 }
```

**Initial state (before Phase 6 additions):** branches 72.77%, functions 78.04%, statements 79.87% -- all below threshold.

**Root causes identified and fixed:**

| Gap | Fix |
|-----|-----|
| 3 barrel `index.ts` files at 0% | Added to `coverage.exclude` in `vite.config.ts` |
| `contentApi.upload()` uncovered | New `contentApi.test.ts` with MSW upload tests |
| `queryClient` `onError` callback uncovered | Added direct invocation test in `queryClient.test.ts` |
| `ConfirmModal` `open=false` + `destructive` branches | New `adminComponents.test.tsx` |
| `StatusBadge` unknown status `??` fallback | New `adminComponents.test.tsx` |
| `AdminCategoriesPage` mode transitions (idle/create/edit) | New tests in `adminPages.test.tsx` |
| `AdminOrderDetailsPage` shippingAddress null | New MSW override test in `adminPages.test.tsx` |
| `AdminCustomerDetailsPage` enabled/disabled + createdAt | New tests in `adminPages.test.tsx` |
| `ProductDetailsPage` no-slug guard + non-404 throw | New tests in `productDiscovery.test.tsx` |
| `ProductListPage` empty-state clear filters + previous page | New tests in `productDiscovery.test.tsx` |
| `ProductTable` empty state + null category + zero stock + callbacks | New `adminProductComponents.test.tsx` |
| `ProductForm` initial/no-initial, auto-slug, isSubmitting | New `adminProductComponents.test.tsx` |
| `ImageUpload` upload states (uploading/error/success/no-file) | New `adminProductComponents.test.tsx` |
| `RefundAction` non-refundable (returns null) + modal open/close | New `adminProductComponents.test.tsx` |

---

### Phase 6 File Inventory

#### Modified Files
| File | Change |
|------|--------|
| `vite.config.ts` | Added 3 barrel files to `coverage.exclude` |
| `src/shared/api/__tests__/queryClient.test.ts` | Added `onError` invocation test (7 tests total) |

#### New Test Files
| File | Tests | Covers |
|------|-------|--------|
| `src/shared/api/__tests__/contentApi.test.ts` | 2 | `contentApi.upload` function |
| `src/modules/admin/components/__tests__/adminComponents.test.tsx` | 14 | `ConfirmModal` (7) + `StatusBadge` (7) |
| `src/modules/admin/products/__tests__/adminProductComponents.test.tsx` | 26 | `ProductTable` (7) + `ProductForm` (8) + `ImageUpload` (6) + `RefundAction` (5) |

#### Extended Test Files
| File | New Tests | Covers |
|------|-----------|--------|
| `src/modules/admin/__tests__/adminPages.test.tsx` | +20 | Admin page mode transitions, modal flows, null states |
| `src/modules/products/__tests__/productDiscovery.test.tsx` | +6 | ProductDetailsPage edge cases + ProductListPage branches |

---

### Phase 6 Test Files Summary

| File | Total Tests | Delta |
|------|-------------|-------|
| `productDiscovery.test.tsx` | ~30 | +6 |
| `queryClient.test.ts` | 7 | +1 |
| `contentApi.test.ts` | 2 | new |
| `adminComponents.test.tsx` | 14 | new |
| `adminPages.test.tsx` | ~31 | +20 |
| `adminProductComponents.test.tsx` | 26 | new |
| **Phase 6 total** | **+60** | 246 → 306 |

---

### Phase 6 Coverage Results

| Metric | Before | After | Threshold |
|--------|--------|-------|-----------|
| Branches | 72.77% | 87.19% | 80% ✅ |
| Functions | 78.04% | 84.55% | 80% ✅ |
| Statements | 79.87% | 91.44% | 80% ✅ |
| Lines | ~79% | 89.35% | 80% ✅ |

---

## Phase 6 Added Constraints

- Barrel `index.ts` re-export files are excluded from coverage (no executable logic to test)
- `vi.mock(path)` paths must resolve to the same absolute module as the source file's import
- `contentApi.test.ts` requires `// @vitest-environment node` for MSW node server interception
- Tests for components using `useAdminRefundOrder` mock the hook via `vi.mock('../../../hooks/useAdminOrders')`
- `ImageUpload` tests spy on `contentApiModule.contentApi.upload` to control async upload state
- All `afterEach` blocks must call `vi.restoreAllMocks()` when using `vi.spyOn`
