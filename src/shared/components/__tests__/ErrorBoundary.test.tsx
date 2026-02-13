import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../ErrorBoundary';

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test explosion');
  }
  return <p>All good</p>;
}

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders default fallback UI when a child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('resets error state when "Try again" is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const user = userEvent.setup();

    const { rerender } = render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );

    // Error boundary catches the throw and shows fallback
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Update tree to non-throwing children BEFORE reset — still showing fallback
    rerender(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    );

    // Click "Try again" — resets hasError, children now render without throwing
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByText('All good')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
