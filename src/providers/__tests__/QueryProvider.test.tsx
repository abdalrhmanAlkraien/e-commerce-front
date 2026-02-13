import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { QueryProvider } from '../QueryProvider';

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}));

function TestChild() {
  return <p>Query provider works</p>;
}

function QueryConsumer() {
  const { data, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: () => Promise.resolve('ok'),
  });

  if (isLoading) return <p>Loading...</p>;
  return <p>Data: {data}</p>;
}

describe('QueryProvider', () => {
  it('renders children', () => {
    render(
      <QueryProvider>
        <TestChild />
      </QueryProvider>,
    );
    expect(screen.getByText('Query provider works')).toBeInTheDocument();
  });

  it('provides query context to consumers', async () => {
    render(
      <QueryProvider>
        <QueryConsumer />
      </QueryProvider>,
    );
    expect(await screen.findByText('Data: ok')).toBeInTheDocument();
  });
});
