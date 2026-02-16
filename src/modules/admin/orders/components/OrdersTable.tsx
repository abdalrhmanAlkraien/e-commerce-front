import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/StatusBadge';
import type { OrderDto } from '../../api/admin.api';

interface OrdersTableProps {
  orders: OrderDto[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">No orders found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Order ID</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Total</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order.externalId} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-700">{order.externalId}</td>
              <td className="px-4 py-3">
                <StatusBadge status={order.status ?? 'PENDING'} />
              </td>
              <td className="px-4 py-3 text-right text-gray-900">${order.total.toFixed(2)}</td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/admin/orders/${order.externalId}`}
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
