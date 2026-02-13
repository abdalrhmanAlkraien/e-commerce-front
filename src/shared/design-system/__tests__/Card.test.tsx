import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../components/Card';
import { Container } from '../components/Container';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with default padding and shadow', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('p-6');
    expect(card.className).toContain('shadow-sm');
  });

  it('accepts padding="lg"', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('p-8');
  });

  it('accepts custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect((container.firstChild as HTMLElement).className).toContain('custom-class');
  });

  it('forwards HTML attributes', () => {
    render(<Card data-testid="my-card">Content</Card>);
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });
});

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Page content</Container>);
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('applies max-width class for xl size by default', () => {
    const { container } = render(<Container>Content</Container>);
    expect((container.firstChild as HTMLElement).className).toContain('max-w-screen-xl');
  });

  it('applies sm size class', () => {
    const { container } = render(<Container size="sm">Content</Container>);
    expect((container.firstChild as HTMLElement).className).toContain('max-w-screen-sm');
  });

  it('adds vertical padding when padded=true', () => {
    const { container } = render(<Container padded>Content</Container>);
    expect((container.firstChild as HTMLElement).className).toContain('py-8');
  });
});
