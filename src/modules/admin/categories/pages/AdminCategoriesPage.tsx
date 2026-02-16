import { useState } from 'react';
import {
  useAdminListCategories,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from '../../hooks/useAdminCategories';
import { CategoryTable } from '../components/CategoryTable';
import { CategoryForm } from '../components/CategoryForm';
import { ConfirmModal } from '../../components/ConfirmModal';
import type { CategoryDto, AdminCreateCategoryRequest } from '../../api/admin.api';

type Mode = 'idle' | 'create' | 'edit';

export function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useAdminListCategories();
  const createMutation = useAdminCreateCategory();
  const updateMutation = useAdminUpdateCategory();
  const deleteMutation = useAdminDeleteCategory();

  const [mode, setMode] = useState<Mode>('idle');
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryDto | null>(null);

  function handleEdit(cat: CategoryDto) {
    setEditing(cat);
    setMode('edit');
  }

  function handleFormSubmit(data: AdminCreateCategoryRequest) {
    if (mode === 'create') {
      createMutation.mutate(data, { onSuccess: () => setMode('idle') });
    } else if (mode === 'edit' && editing) {
      updateMutation.mutate(
        { id: editing.id, data },
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
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        {mode === 'idle' && (
          <button
            type="button"
            onClick={() => setMode('create')}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Category
          </button>
        )}
      </div>

      {mode !== 'idle' && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            {mode === 'create' ? 'Create Category' : 'Edit Category'}
          </h2>
          <CategoryForm
            initial={editing ?? undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => { setMode('idle'); setEditing(null); }}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {isLoading ? (
        <p className="py-8 text-center text-sm text-gray-500">Loading…</p>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
