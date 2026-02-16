import { useState } from 'react';
import type { ProductDto, CategoryDto, AdminCreateProductRequest } from '../../api/admin.api';
import { ImageUpload } from './ImageUpload';

interface ProductFormProps {
  initial?: ProductDto;
  categories: CategoryDto[];
  onSubmit: (data: AdminCreateProductRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ProductForm({
  initial,
  categories,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(initial?.price?.toString() ?? '');
  const [stock, setStock] = useState(initial?.stock?.toString() ?? '');
  const [categoryId, setCategoryId] = useState(initial?.category?.id ?? '');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  function handleNameChange(value: string) {
    setName(value);
    if (!initial) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data: AdminCreateProductRequest = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      categoryId,
      ...(imageUrl ? { imageUrl } : {}),
    };
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="prod-name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="prod-name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="prod-slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            id="prod-slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="prod-desc" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="prod-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="prod-price" className="block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            id="prod-price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="prod-stock" className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            id="prod-stock"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="prod-category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="prod-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ImageUpload onUploaded={setImageUrl} />

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
