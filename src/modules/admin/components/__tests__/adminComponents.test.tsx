/**
 * Admin Shared Components — Unit Tests
 *
 * Covers ConfirmModal and StatusBadge component branches.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ConfirmModal } from '../ConfirmModal';
import { StatusBadge } from '../StatusBadge';

// ── ConfirmModal ──────────────────────────────────────────────────────────────

describe('ConfirmModal', () => {
  it('renders nothing when open=false', () => {
    const { container } = render(
      <ConfirmModal
        open={false}
        title="Test"
        description="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog when open=true', () => {
    render(
      <ConfirmModal
        open={true}
        title="Test Title"
        description="Test description"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('confirm button has red style when destructive=true', () => {
    render(
      <ConfirmModal
        open={true}
        title="Delete"
        description="This cannot be undone"
        destructive
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    expect(confirmBtn.className).toContain('bg-red-600');
  });

  it('confirm button has blue style when destructive=false', () => {
    render(
      <ConfirmModal
        open={true}
        title="Proceed"
        description="Continue with action?"
        destructive={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    expect(confirmBtn.className).toContain('bg-blue-600');
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        open={true}
        title="Test"
        description="desc"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmModal
        open={true}
        title="Test"
        description="desc"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('renders custom confirmLabel and cancelLabel', () => {
    render(
      <ConfirmModal
        open={true}
        title="Test"
        description="desc"
        confirmLabel="Yes, delete"
        cancelLabel="Keep it"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /yes, delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /keep it/i })).toBeInTheDocument();
  });
});

// ── StatusBadge ───────────────────────────────────────────────────────────────

describe('StatusBadge', () => {
  it('renders PENDING status with yellow style', () => {
    const { container } = render(<StatusBadge status="PENDING" />);
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-yellow-100');
  });

  it('renders CONFIRMED status with blue style', () => {
    const { container } = render(<StatusBadge status="CONFIRMED" />);
    expect(container.firstChild).toHaveClass('bg-blue-100');
  });

  it('renders DELIVERED status with green style', () => {
    const { container } = render(<StatusBadge status="DELIVERED" />);
    expect(container.firstChild).toHaveClass('bg-green-100');
  });

  it('renders CANCELLED status with gray style', () => {
    const { container } = render(<StatusBadge status="CANCELLED" />);
    expect(container.firstChild).toHaveClass('bg-gray-100');
  });

  it('renders unknown status with fallback gray style', () => {
    const { container } = render(<StatusBadge status="UNKNOWN_XYZ" />);
    expect(screen.getByText('UNKNOWN_XYZ')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-gray-100');
  });

  it('renders ENABLED status with green style', () => {
    const { container } = render(<StatusBadge status="ENABLED" />);
    expect(container.firstChild).toHaveClass('bg-green-100');
  });

  it('renders DISABLED status with red style', () => {
    const { container } = render(<StatusBadge status="DISABLED" />);
    expect(container.firstChild).toHaveClass('bg-red-100');
  });
});
