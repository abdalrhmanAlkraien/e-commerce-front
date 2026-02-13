import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </QueryProvider>
    </ErrorBoundary>
  );
}
