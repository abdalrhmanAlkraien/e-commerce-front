import { useState } from 'react';
import { useAdminRefundOrder } from '../../hooks/useAdminOrders';
import { ConfirmModal } from '../../components/ConfirmModal';
import type { OrderDto } from '../../api/admin.api';

interface RefundActionProps {
  externalId: string;
  currentStatus: OrderDto['status'];
}

const REFUNDABLE_STATUSES: Array<OrderDto['status']> = ['DELIVERED', 'CONFIRMED', 'SHIPPED'];

export function RefundAction({ externalId, currentStatus }: RefundActionProps) {
  const [open, setOpen] = useState(false);
  const mutation = useAdminRefundOrder();

  const canRefund = currentStatus != null && REFUNDABLE_STATUSES.includes(currentStatus);

  if (!canRefund) return null;

  function handleConfirm() {
    mutation.mutate(externalId, { onSuccess: () => setOpen(false) });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Refund Order
      </button>
      <ConfirmModal
        open={open}
        title="Refund Order"
        description="This will issue a full refund and cannot be undone. Are you sure?"
        confirmLabel="Issue Refund"
        destructive
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
