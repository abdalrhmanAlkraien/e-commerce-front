type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

interface StatusBadgeProps {
  status: OrderStatus | string;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-700',
  REFUNDED: 'bg-red-100 text-red-800',
  // Customer account states
  ENABLED: 'bg-green-100 text-green-800',
  DISABLED: 'bg-red-100 text-red-800',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700';

  return (
    <span
      className={['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', style].join(' ')}
    >
      {status}
    </span>
  );
}
