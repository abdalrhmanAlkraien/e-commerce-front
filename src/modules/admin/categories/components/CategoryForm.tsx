import { useState } from 'react';
import type { CategoryDto, AdminCreateCategoryRequest } from '../../api/admin.api';

interface CategoryFormProps {
  initial?: CategoryDto;
  onSubmit: (data: AdminCreateCategoryRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CategoryForm({ initial, onSubmit, onCancel, isSubmitting }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');

  function handleNameChange(value: string) {
    setName(value);
    if (!initial) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name: name.trim(), slug: slug.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="cat-name"
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="e.g. Electronics"
        />
      </div>
      <div>
        <label htmlFor="cat-slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          id="cat-slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="e.g. electronics"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
