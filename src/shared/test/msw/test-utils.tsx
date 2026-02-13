import React from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { MemoryRouterProps } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// ── Query Client factory ──────────────────────────────────────────────────────

/**
 * Creates a fresh QueryClient for each test with retry disabled.
 */
export function makeTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

// ── Provider wrapper ──────────────────────────────────────────────────────────

interface ProvidersOptions extends RenderOptions {
  /** Override MemoryRouter initial entries / other props. */
  routerProps?: MemoryRouterProps;
  /** Provide a shared QueryClient (e.g. to inspect cache after render). */
  queryClient?: QueryClient;
}

interface RenderWithProvidersResult extends RenderResult {
  queryClient: QueryClient;
}

/**
 * Wraps `ui` with:
 * - `QueryClientProvider` (fresh client per call unless one is passed)
 * - `MemoryRouter` (configurable via `routerProps`)
 * - `Toaster` from sonner (captures toast notifications in DOM)
 */
export function renderWithProviders(
  ui: React.ReactElement,
  { routerProps, queryClient, ...renderOptions }: ProvidersOptions = {},
): RenderWithProvidersResult {
  const client = queryClient ?? makeTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <MemoryRouter {...routerProps}>
          {children}
          <Toaster />
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }), queryClient: client };
}

// ── React Query wrapper factory ───────────────────────────────────────────────

/**
 * Returns a React component wrapper for `renderHook` calls.
 * Includes QueryClientProvider only — useful for testing hooks
 * that do NOT need a Router.
 */
export function makeQueryWrapper(qc?: QueryClient) {
  const client = qc ?? makeTestQueryClient();
  return function QueryWrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client }, children);
  };
}
