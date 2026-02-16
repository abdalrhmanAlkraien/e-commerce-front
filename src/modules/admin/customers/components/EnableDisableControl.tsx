import { useState } from 'react';
import { useAdminEnableCustomer, useAdminDisableCustomer } from '../../hooks/useAdminCustomers';
import { ConfirmModal } from '../../components/ConfirmModal';

interface EnableDisableControlProps {
  customerId: string;
  enabled: boolean;
}

export function EnableDisableControl({ customerId, enabled }: EnableDisableControlProps) {
  const [open, setOpen] = useState(false);
  const enableMutation = useAdminEnableCustomer();
  const disableMutation = useAdminDisableCustomer();

  const isPending = enableMutation.isPending || disableMutation.isPending;

  function handleConfirm() {
    if (enabled) {
      disableMutation.mutate(customerId, { onSuccess: () => setOpen(false) });
    } else {
      enableMutation.mutate(customerId, { onSuccess: () => setOpen(false) });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isPending}
        className={[
          'rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-50',
          enabled
            ? 'border border-red-300 text-red-600 hover:bg-red-50'
            : 'border border-green-300 text-green-600 hover:bg-green-50',
        ].join(' ')}
      >
        {enabled ? 'Disable Account' : 'Enable Account'}
      </button>

      <ConfirmModal
        open={open}
        title={enabled ? 'Disable Customer' : 'Enable Customer'}
        description={
          enabled
            ? 'This will prevent the customer from logging in. Continue?'
            : 'This will restore the customer\'s access. Continue?'
        }
        confirmLabel={enabled ? 'Disable' : 'Enable'}
        destructive={enabled}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
