import { useState } from 'react';
import {
  useAdminListProducts,
  useAdminCreateProduct,
  useAdminUpdateProduct,
  useAdminDeleteProduct,
} from '../../hooks/useAdminProducts';
import { useAdminListCategories } from '../../hooks/useAdminCategories';
import { ProductTable } from '../components/ProductTable';
import { ProductForm } from '../components/ProductForm';
import { ConfirmModal } from '../../components/ConfirmModal';
import type { ProductDto, AdminCreateProductRequest } from '../../api/admin.api';

type Mode = 'idle' | 'create' | 'edit';

export function AdminProductsPage() {
  const { data, isLoading } = useAdminListProducts();
  const { data: categories = [] } = useAdminListCategories();
  const createMutation = useAdminCreateProduct();
  const updateMutation = useAdminUpdateProduct();
  const deleteMutation = useAdminDeleteProduct();

  const [mode, setMode] = useState<Mode>('idle');
  const [editing, setEditing] = useState<ProductDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductDto | null>(null);

  const products = data?.items ?? [];

  function handleEdit(product: ProductDto) {
    setEditing(product);
    setMode('edit');
  }

  function handleFormSubmit(payload: AdminCreateProductRequest) {
    if (mode === 'create') {
      createMutation.mutate(payload, { onSuccess: () => setMode('idle') });
    } else if (mode === 'edit' && editing) {
      updateMutation.mutate(
        { id: editing.id, data: payload },
        { onSuccess: () => { setMode('idle'); setEditing(null); } },
      );
    }
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: () => setDeleteTarget(null),
    });
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        {mode === 'idle' && (
          <button
            type="button"
            onClick={() => setMode('create')}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Product
          </button>
        )}
      </div>

      {mode !== 'idle' && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            {mode === 'create' ? 'Create Product' : 'Edit Product'}
          </h2>
          <ProductForm
            initial={editing ?? undefined}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={() => { setMode('idle'); setEditing(null); }}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {isLoading ? (
        <p className="py-8 text-center text-sm text-gray-500">Loading…</p>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
