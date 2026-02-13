import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi, type AdminUpdateOrderStatusRequest } from '../api/admin.api';
import { mapApiErrorToMessage } from '@/shared/utils/errorMapper';

export const adminOrderKeys = {
  all: ['admin', 'orders'] as const,
  detail: (externalId: string) => ['admin', 'orders', externalId] as const,
};

/** Changes the lifecycle status of an order. Requires ADMIN role. */
export function useAdminUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      externalId,
      data,
    }: {
      externalId: string;
      data: AdminUpdateOrderStatusRequest;
    }) => adminApi.updateOrderStatus(externalId, data),
    onSuccess: (_result, { externalId }) => {
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.detail(externalId) });
      toast.success('Order status updated.');
    },
    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}
