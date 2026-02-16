import type { ProductDto } from '../../api/admin.api';

interface ProductTableProps {
  products: ProductDto[];
  onEdit: (product: ProductDto) => void;
  onDelete: (product: ProductDto) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">No products found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Price</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Stock</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
              <td className="px-4 py-3 text-gray-500">{p.category?.name ?? '—'}</td>
              <td className="px-4 py-3 text-right text-gray-900">${p.price.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">
                <span className={p.stock === 0 ? 'text-red-600' : 'text-gray-900'}>
                  {p.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  className="mr-2 text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
