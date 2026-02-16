import { useParams, Link } from 'react-router-dom';
import { useAdminOrderDetails } from '../../hooks/useAdminOrders';
import { StatusBadge } from '../../components/StatusBadge';
import { StatusUpdateControl } from '../components/StatusUpdateControl';
import { RefundAction } from '../components/RefundAction';

export function AdminOrderDetailsPage() {
  const { externalId = '' } = useParams();
  const { data: order, isLoading } = useAdminOrderDetails(externalId);

  if (isLoading) {
    return <p className="py-8 text-center text-sm text-gray-500">Loading…</p>;
  }

  if (!order) {
    return <p className="py-8 text-center text-sm text-red-500">Order not found.</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/admin/orders" className="mb-1 block text-sm text-blue-600 hover:underline">
            ← Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.externalId}</h1>
        </div>
        <StatusBadge status={order.status ?? 'PENDING'} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 font-semibold text-gray-800">Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="font-medium text-gray-600">Total:</dt>
              <dd className="text-gray-900">${order.total.toFixed(2)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-gray-600">Placed:</dt>
              <dd className="text-gray-900">{new Date(order.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 font-semibold text-gray-800">Shipping Address</h2>
          {order.shippingAddress ? (
            <address className="not-italic text-sm text-gray-700">
              <div>{order.shippingAddress.street}</div>
              <div>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </div>
              <div>{order.shippingAddress.country}</div>
            </address>
          ) : (
            <p className="text-sm text-gray-500">No address on file.</p>
          )}
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 font-semibold text-gray-800">Items</h2>
        <ul className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-900">{item.product?.name ?? item.id}</span>
              <span className="text-gray-500">
                {item.quantity} × ${item.unitPrice.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="font-semibold text-gray-800">Manage Order</h2>
        <StatusUpdateControl externalId={order.externalId} currentStatus={order.status ?? 'PENDING'} />
        <RefundAction externalId={order.externalId} currentStatus={order.status ?? 'PENDING'} />
      </div>
    </div>
  );
}
