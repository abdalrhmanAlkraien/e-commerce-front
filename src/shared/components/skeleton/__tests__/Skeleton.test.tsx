import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../Skeleton';
import { TextSkeleton } from '../TextSkeleton';
import { CardSkeleton } from '../CardSkeleton';
import { TableRowSkeleton } from '../TableRowSkeleton';
import { AvatarSkeleton } from '../AvatarSkeleton';

describe('Skeleton (base)', () => {
  it('renders with role="status" and aria-busy', () => {
    render(<Skeleton />);
    const el = screen.getByRole('status');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('applies width and height via style', () => {
    const { container } = render(<Skeleton width="200px" height="1rem" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('1rem');
  });

  it('includes animate-pulse class', () => {
    const { container } = render(<Skeleton />);
    expect((container.firstChild as HTMLElement).className).toContain('animate-pulse');
  });
});

describe('TextSkeleton', () => {
  it('renders a single line by default', () => {
    render(<TextSkeleton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the correct number of line elements', () => {
    const { container } = render(<TextSkeleton lines={3} />);
    // TextSkeleton wraps in a div with role=status; inner skeletons are divs
    const inner = container.querySelectorAll('.animate-pulse');
    expect(inner.length).toBe(3);
  });
});

describe('CardSkeleton', () => {
  it('renders with aria-label "Loading card"', () => {
    render(<CardSkeleton />);
    expect(screen.getByRole('status', { name: 'Loading card' })).toBeInTheDocument();
  });

  it('renders image area by default', () => {
    const { container } = render(<CardSkeleton />);
    // Image skeleton is the first animate-pulse child
    const pulseEls = container.querySelectorAll('.animate-pulse');
    expect(pulseEls.length).toBeGreaterThan(1);
  });

  it('does not render image area when withImage=false', () => {
    const { container } = render(<CardSkeleton withImage={false} />);
    const pulseEls = container.querySelectorAll('.animate-pulse');
    // Without image there are fewer pulse elements
    const withImageContainer = document.createElement('div');
    document.body.appendChild(withImageContainer);
    const { container: withImageResult } = render(<CardSkeleton withImage={true} />);
    expect(pulseEls.length).toBeLessThan(
      withImageResult.querySelectorAll('.animate-pulse').length,
    );
    document.body.removeChild(withImageContainer);
  });
});

describe('TableRowSkeleton', () => {
  it('renders with aria-label "Loading table"', () => {
    render(<TableRowSkeleton />);
    expect(screen.getByRole('status', { name: 'Loading table' })).toBeInTheDocument();
  });

  it('renders correct number of rows', () => {
    const { container } = render(<TableRowSkeleton rows={3} columns={2} />);
    // Each row is a flex div inside the status container
    const rows = container.querySelectorAll('[role="status"] > div');
    expect(rows.length).toBe(3);
  });
});

describe('AvatarSkeleton', () => {
  it('renders with aria-label "Loading avatar"', () => {
    render(<AvatarSkeleton />);
    expect(screen.getByRole('status', { name: 'Loading avatar' })).toBeInTheDocument();
  });

  it('renders circle (rounded-full)', () => {
    const { container } = render(<AvatarSkeleton />);
    const circle = container.querySelector('.rounded-full');
    expect(circle).toBeInTheDocument();
  });

  it('renders label lines when withLabel=true', () => {
    const { container } = render(<AvatarSkeleton withLabel />);
    const pulseEls = container.querySelectorAll('.animate-pulse');
    // Avatar circle + 2 label lines = 3
    expect(pulseEls.length).toBe(3);
  });
});
