# System Prompt  Project State Tracker

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
| Phase 2 | Auth Module | PENDING |  |
| Phase 3 | Product & Category Module | PENDING |  |
| Phase 4 | Cart & Checkout Module | PENDING |  |
| Phase 5 | Orders Module | PENDING |  |
| Phase 6 | Admin Portal | PENDING |  |

---

## Phase 0  Project Foundation [COMPLETE]

### Task 0.1  Folder Architecture [DONE]

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

### Task 0.2  Environment Strategy [DONE]

Files created:
- `.env.development`  `VITE_API_BASE_URL=http://localhost:8080`, `VITE_APP_ENV=development`
- `.env.staging`  `VITE_API_BASE_URL=https://api-staging.example.com`, `VITE_APP_ENV=staging`
- `.env.production`  `VITE_API_BASE_URL=https://api.example.com`, `VITE_APP_ENV=production`
- `.env.test`  `VITE_API_BASE_URL=http://localhost:8080`, `VITE_APP_ENV=development`
- `src/shared/config/env.ts`  typed, frozen, fail-fast env accessor (`env.apiBaseUrl`, `env.appEnv`)

### Task 0.3  Core Stack Install [DONE]

Dependencies installed:
- `react-router-dom`, `@tanstack/react-query`, `axios`, `zustand`, `sonner`
- `tailwindcss` (v4), `@tailwindcss/vite`
- `@tanstack/react-query-devtools`
- `openapi-typescript`
- `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `msw`, `@vitest/coverage-v8`
- `prettier`, `eslint-config-prettier`

Configuration files:
- `vite.config.ts`  `defineConfig` from `vitest/config`; Tailwind v4 plugin; `@/` alias; jsdom env; 80% coverage thresholds
- `tsconfig.app.json`  strict mode; `vitest/globals` types; `@/*` path alias
- `.prettierrc`, `.prettierignore`
- `eslint.config.js`  prettier integration
- `src/shared/test/setup.ts`  jest-dom matchers
- `src/shared/test/msw/handlers.ts`, `server.ts`, `browser.ts`

Scripts in `package.json`:
```
dev | build | preview | test | coverage | lint | typecheck | generate:types
```

---

## Phase 1  Infrastructure Layer [COMPLETE]

Validation gate (all passing):
- `npm run typecheck`  0 errors
- `npm run lint`  0 warnings
- `npm run test`  9 files, 49 tests, all pass

---

### Task 1.1  Axios API Client [DONE]

Files created/modified:

**`src/modules/auth/types/auth.types.ts`**
- `UserRole`  `'ADMIN' | 'CUSTOMER'`
- `AuthUser`  `{ id, email, role }`
- `AuthState`  `{ token, user, isAuthenticated }`

**`src/modules/auth/store/authStore.ts`**
- Zustand store with `setAuth(token, user)` and `logout()`
- JWT stored in memory only  never localStorage

**`src/shared/api/apiError.ts`**
- `ApiError` interface  `{ message, status, code? }`
- `ApiErrorInstance` class  extends `Error`, implements `ApiError`
- `isApiError(error)`  type guard

**`src/shared/api/axiosClient.ts`**  *(replaces deleted `axiosInstance.ts`)*
- `axios.create` with `baseURL: env.apiBaseUrl`, `timeout: 10_000`, `Content-Type: application/json`
- Request interceptor  injects `Authorization: Bearer <token>` from `useAuthStore.getState().token`
- Response interceptor  401 ’ `logout()` + throw; all errors ’ `ApiErrorInstance`

Tests: `src/shared/api/__tests__/axiosClient.test.ts` (6 tests), `src/shared/api/__tests__/apiError.test.ts` (8 tests)

---

### Task 1.2  Global Error Handling [DONE]

**`src/shared/utils/errorMapper.ts`**
- Maps `ApiErrorInstance` status codes to safe user messages
- Status map: `0` (network), `401`, `403`, `404`, `500`  all others ’ generic fallback

**`src/shared/components/ErrorBoundary.tsx`**
- Class component (React requirement for render error catching)
- `getDerivedStateFromError` ’ sets `hasError: true`
- `handleReset` ’ clears error state
- Accepts optional `fallback` prop; default fallback has `role="alert"` and "Try again" button

Tests: `src/shared/utils/__tests__/errorMapper.test.ts` (8 tests), `src/shared/components/__tests__/ErrorBoundary.test.tsx` (4 tests)

---

### Task 1.3  DTO Generator [DONE]

**`src/shared/types/api.ts`**
- Bootstrap stub in openapi-typescript v7 format
- Covers all endpoints from `ApiIndex.md`: auth, public products, categories, cart, checkout, orders, admin
- Header comment: `// AUTO-GENERATED  DO NOT EDIT MANUALLY. Regenerate with: npm run generate:types`
- `paths`, `components.schemas` (RegisterRequest, LoginRequest, AuthResponse, UserDto, CategoryDto, ProductDto, CartDto, OrderDto, etc.)

Generation script: `npm run generate:types` ’ `openapi-typescript http://localhost:8080/api-docs -o src/shared/types/api.ts`

Tests: `src/shared/types/__tests__/api.types.test.ts` (5 type compilation tests via `expectTypeOf`)

---

### Task 1.4  React Query Provider [DONE]

**`src/shared/api/queryClient.ts`**
- `staleTime: 60_000`, `retry: 2`, `refetchOnWindowFocus: false`
- Global mutation `onError` ’ `toast.error(mapApiErrorToMessage(error))`

**`src/providers/QueryProvider.tsx`**
- Wraps `QueryClientProvider`
- Renders `<ReactQueryDevtools initialIsOpen={false} />` only when `env.appEnv === 'development'`

Tests: `src/shared/api/__tests__/queryClient.test.ts` (6 tests), `src/providers/__tests__/QueryProvider.test.tsx` (2 tests)

---

### Task 1.5  Routing System [DONE]

**Layouts:**
- `src/layouts/PublicLayout.tsx`  header + `<Outlet />` + footer
- `src/layouts/AuthLayout.tsx`  centered card layout
- `src/layouts/AdminLayout.tsx`  sidebar (gray-900) + main area

**Route Guards:**
- `src/routes/guards/ProtectedRoute.tsx`  redirects to `/login` if not authenticated
- `src/routes/guards/AdminRoute.tsx`  redirects to `/login` (unauthenticated) or `/` (non-ADMIN)
- `src/routes/guards/CustomerRoute.tsx`  redirects to `/` if role is not `CUSTOMER`

**Central route registry:**
- `src/routes/index.tsx`  `createBrowserRouter` with lazy loading via `React.lazy()`; `AppRoutes` component using `RouterProvider`
- `src/shared/components/LoadingFallback.tsx`  Suspense fallback spinner
- `src/shared/components/NotFoundPage.tsx`  `*` catch-all route

**App wiring:**
- `src/providers/AppProviders.tsx`  `ErrorBoundary` > `QueryProvider` > `Toaster`
- `src/App.tsx`  `AppProviders` > `AppRoutes`

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

- JWT is **never** stored in localStorage  Zustand in-memory only
- No inline `import.meta.env` usage outside `src/shared/config/env.ts`
- No inline axios calls outside `src/shared/api/axiosClient.ts`
- `src/shared/types/api.ts` is auto-generated  never edit manually
- Route guards use `<Outlet />` pattern  never render restricted content
- `ErrorBoundary` must be a class component (React requirement)
- DevTools (`ReactQueryDevtools`) render only when `env.appEnv === 'development'`
- Tailwind v4  no `tailwind.config.js`; uses `@tailwindcss/vite` plugin + `@import "tailwindcss"` in CSS
- `axiosClient.test.ts` requires `// @vitest-environment node` for MSW node server interception

---

## What Phase 2 Must Do

The `src/routes/index.tsx` children arrays are intentionally empty  ready for Phase 2 routes.

Phase 2 (Auth Module) will need to:
- Implement login, register, logout pages under `src/modules/auth/`
- Add auth routes to `routes/index.tsx` under `AuthLayout` and `PublicLayout`
- Consume `POST /api/v1/auth/register` and `POST /api/v1/auth/login` via `axiosClient`
- Use generated types from `src/shared/types/api.ts`
- Store token via `useAuthStore.setAuth()`

---

*Last updated: Phase 1 complete  49/49 tests passing, typecheck clean, lint clean.*
