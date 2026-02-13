import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../components/Button';

describe('Button — rendering', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('has type="button" by default', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('accepts type="submit"', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});

describe('Button — disabled state', () => {
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Button — loading state', () => {
  it('shows loading spinner and sr-only text when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('is disabled when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('Button — icon support', () => {
  it('renders leftIcon', () => {
    render(<Button leftIcon={<span data-testid="icon-left" />}>Click</Button>);
    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
  });

  it('renders rightIcon', () => {
    render(<Button rightIcon={<span data-testid="icon-right" />}>Click</Button>);
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });
});

describe('Button — variants', () => {
  it.each(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const)(
    'renders %s variant without error',
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    },
  );
});

describe('Button — onClick', () => {
  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
