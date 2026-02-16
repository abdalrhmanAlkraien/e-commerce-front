import { useState } from 'react';
import { useAdminUpdateOrderStatus } from '../../hooks/useAdminOrders';
import type { OrderDto } from '../../api/admin.api';

const ORDER_STATUSES: OrderDto['status'][] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

interface StatusUpdateControlProps {
  externalId: string;
  currentStatus: OrderDto['status'];
}

export function StatusUpdateControl({ externalId, currentStatus }: StatusUpdateControlProps) {
  const [selected, setSelected] = useState<OrderDto['status']>(currentStatus ?? 'PENDING');
  const mutation = useAdminUpdateOrderStatus();

  function handleUpdate() {
    if (selected === currentStatus) return;
    mutation.mutate({ externalId, data: { status: selected } });
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as OrderDto['status'])}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        aria-label="Order status"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleUpdate}
        disabled={mutation.isPending || selected === currentStatus}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {mutation.isPending ? 'Updating…' : 'Update Status'}
      </button>
    </div>
  );
}
