import { useAdminListOrders } from '../../hooks/useAdminOrders';
import { OrdersTable } from '../components/OrdersTable';

export function AdminOrdersPage() {
  const { data, isLoading } = useAdminListOrders();
  const orders = data?.items ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Orders</h1>
      {isLoading ? (
        <p className="py-8 text-center text-sm text-gray-500">Loading…</p>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
