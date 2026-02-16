/**
 * Admin Product & Order Components — Unit Tests
 *
 * Covers branch paths for:
 *  ✅ ProductTable — empty state, null category, zero stock, Edit/Delete callbacks
 *  ✅ ProductForm  — no initial, with initial, auto-slug, isSubmitting, cancel/submit
 *  ✅ ImageUpload  — no preview, with preview, uploading state, error state, success
 *  ✅ RefundAction — non-refundable status (returns null), refundable + modal
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ProductTable } from '../components/ProductTable';
import { ProductForm } from '../components/ProductForm';
import { ImageUpload } from '../components/ImageUpload';
import { RefundAction } from '../../orders/components/RefundAction';
import * as contentApiModule from '@/shared/api/contentApi';

// ── Shared helpers ────────────────────────────────────────────────────────────

function makeQC() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function withQC(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={makeQC()}>{ui}</QueryClientProvider>,
  );
}

const mockCategory = { id: 'c1', name: 'Electronics', slug: 'electronics' };

const mockProduct = {
  id: 'p1',
  name: 'Test Widget',
  slug: 'test-widget',
  description: 'A test product',
  price: 9.99,
  stock: 5,
  category: mockCategory,
};

afterEach(() => {
  vi.restoreAllMocks();
});

// ── ProductTable ──────────────────────────────────────────────────────────────

describe('ProductTable', () => {
  it('shows "No products found" when products array is empty', () => {
    render(<ProductTable products={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it('renders product name, category, price and stock in table row', () => {
    render(
      <ProductTable products={[mockProduct]} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByText('Test Widget')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('shows em dash when category is null', () => {
    const product = { ...mockProduct, category: null as unknown as typeof mockCategory };
    render(<ProductTable products={[product]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('applies red class to stock cell when stock is 0', () => {
    const product = { ...mockProduct, stock: 0 };
    render(<ProductTable products={[product]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const stockSpan = screen.getByText('0');
    expect(stockSpan.className).toContain('text-red-600');
  });

  it('applies gray class to stock cell when stock is positive', () => {
    render(
      <ProductTable products={[mockProduct]} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    const stockSpan = screen.getByText('5');
    expect(stockSpan.className).toContain('text-gray-900');
  });

  it('calls onEdit with the product when Edit button is clicked', () => {
    const onEdit = vi.fn();
    render(
      <ProductTable products={[mockProduct]} onEdit={onEdit} onDelete={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    expect(onEdit).toHaveBeenCalledWith(mockProduct);
  });

  it('calls onDelete with the product when Delete button is clicked', () => {
    const onDelete = vi.fn();
    render(
      <ProductTable products={[mockProduct]} onEdit={vi.fn()} onDelete={onDelete} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(onDelete).toHaveBeenCalledWith(mockProduct);
  });
});

// ── ProductForm ───────────────────────────────────────────────────────────────

describe('ProductForm', () => {
  it('renders empty fields and "Create" button when no initial prop', () => {
    render(
      <ProductForm
        categories={[mockCategory]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/^name$/i)).toHaveValue('');
    expect(screen.getByLabelText(/^slug$/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /^create$/i })).toBeInTheDocument();
  });

  it('renders pre-filled fields and "Update" button when initial is provided', () => {
    render(
      <ProductForm
        initial={mockProduct}
        categories={[mockCategory]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/^name$/i)).toHaveValue('Test Widget');
    expect(screen.getByLabelText(/^slug$/i)).toHaveValue('test-widget');
    expect(screen.getByRole('button', { name: /^update$/i })).toBeInTheDocument();
  });

  it('auto-generates slug from name when no initial', async () => {
    const user = userEvent.setup();
    render(
      <ProductForm
        categories={[mockCategory]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    await user.type(screen.getByLabelText(/^name$/i), 'My New Product');
    expect(screen.getByLabelText(/^slug$/i)).toHaveValue('my-new-product');
  });

  it('does not auto-generate slug when initial is provided', async () => {
    const user = userEvent.setup();
    render(
      <ProductForm
        initial={mockProduct}
        categories={[mockCategory]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    const nameInput = screen.getByLabelText(/^name$/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Changed Name');
    // Slug must remain the original because initial is set
    expect(screen.getByLabelText(/^slug$/i)).toHaveValue('test-widget');
  });

  it('shows "Saving…" and disables submit button when isSubmitting=true', () => {
    render(
      <ProductForm
        categories={[mockCategory]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        isSubmitting
      />,
    );
    const btn = screen.getByRole('button', { name: /saving/i });
    expect(btn).toBeDisabled();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <ProductForm
        categories={[mockCategory]}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls onSubmit when form is filled and submitted', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <ProductForm
        categories={[mockCategory]}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );
    await user.type(screen.getByLabelText(/^name$/i), 'Widget');
    await user.type(screen.getByLabelText(/description/i), 'Desc');
    await user.type(screen.getByLabelText(/price/i), '5.99');
    await user.type(screen.getByLabelText(/stock/i), '10');
    await user.selectOptions(screen.getByLabelText(/category/i), 'c1');
    await user.click(screen.getByRole('button', { name: /^create$/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});

// ── ImageUpload ───────────────────────────────────────────────────────────────

describe('ImageUpload', () => {
  it('renders "Upload Image" button when no currentUrl provided', () => {
    render(<ImageUpload onUploaded={vi.fn()} />);
    expect(screen.getByRole('button', { name: /upload image/i })).toBeInTheDocument();
  });

  it('renders preview image and "Change Image" button when currentUrl is set', () => {
    render(
      <ImageUpload
        currentUrl="https://example.com/img.jpg"
        onUploaded={vi.fn()}
      />,
    );
    expect(screen.getByRole('img', { name: /product preview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change image/i })).toBeInTheDocument();
  });

  it('shows "Uploading…" and disables button while uploading', async () => {
    vi.spyOn(contentApiModule.contentApi, 'upload').mockImplementation(
      () => new Promise(() => {}), // never resolves
    );
    render(<ImageUpload onUploaded={vi.fn()} />);
    const fileInput = screen.getByLabelText(/upload product image/i);
    const file = new File(['hello'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /uploading/i })).toBeDisabled(),
    );
  });

  it('shows error message when upload throws', async () => {
    vi.spyOn(contentApiModule.contentApi, 'upload').mockRejectedValue(new Error('fail'));
    render(<ImageUpload onUploaded={vi.fn()} />);
    const fileInput = screen.getByLabelText(/upload product image/i);
    const file = new File(['hello'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() =>
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument(),
    );
  });

  it('calls onUploaded with the returned URL on success', async () => {
    const onUploaded = vi.fn();
    vi.spyOn(contentApiModule.contentApi, 'upload').mockResolvedValue({
      id: 'f1',
      url: 'https://cdn.example.com/f1.jpg',
    });
    render(<ImageUpload onUploaded={onUploaded} />);
    const fileInput = screen.getByLabelText(/upload product image/i);
    const file = new File(['hello'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() =>
      expect(onUploaded).toHaveBeenCalledWith('https://cdn.example.com/f1.jpg'),
    );
  });

  it('does not call onUploaded when no file is selected (early return)', () => {
    const onUploaded = vi.fn();
    render(<ImageUpload onUploaded={onUploaded} />);
    const fileInput = screen.getByLabelText(/upload product image/i);
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(onUploaded).not.toHaveBeenCalled();
  });
});

// ── RefundAction ──────────────────────────────────────────────────────────────

vi.mock('../../../hooks/useAdminOrders', () => ({
  useAdminRefundOrder: () => ({ mutate: vi.fn(), isPending: false }),
}));

describe('RefundAction', () => {
  it('renders nothing when status is PENDING (not refundable)', () => {
    const { container } = withQC(
      <RefundAction externalId="ext-1" currentStatus="PENDING" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when status is null (canRefund = false)', () => {
    const { container } = withQC(
      <RefundAction externalId="ext-1" currentStatus={null as unknown as 'PENDING'} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders "Refund Order" button when status is DELIVERED (refundable)', () => {
    withQC(<RefundAction externalId="ext-1" currentStatus="DELIVERED" />);
    expect(screen.getByRole('button', { name: /refund order/i })).toBeInTheDocument();
  });

  it('renders "Refund Order" button when status is CONFIRMED (refundable)', () => {
    withQC(<RefundAction externalId="ext-1" currentStatus="CONFIRMED" />);
    expect(screen.getByRole('button', { name: /refund order/i })).toBeInTheDocument();
  });

  it('opens the confirm modal when "Refund Order" button is clicked', async () => {
    const user = userEvent.setup();
    withQC(<RefundAction externalId="ext-1" currentStatus="DELIVERED" />);
    await user.click(screen.getByRole('button', { name: /refund order/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes the confirm modal when Cancel is clicked', async () => {
    const user = userEvent.setup();
    withQC(<RefundAction externalId="ext-1" currentStatus="DELIVERED" />);
    await user.click(screen.getByRole('button', { name: /refund order/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});
