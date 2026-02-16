import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/StatusBadge';
import type { AdminCustomerDto } from '../../api/admin.api';

interface CustomersTableProps {
  customers: AdminCustomerDto[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  if (customers.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">No customers found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Joined</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-900">{c.email}</td>
              <td className="px-4 py-3">
                <StatusBadge status={c.enabled ? 'ENABLED' : 'DISABLED'} />
              </td>
              <td className="px-4 py-3 text-gray-500">
                {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/admin/customers/${c.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
