import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  adminApi,
  type AdminUpdateOrderStatusRequest,
  type AdminListOrdersParams,
} from '../api/admin.api';
import { mapApiErrorToMessage } from '@/shared/utils/errorMapper';

export const adminOrderKeys = {
  all: ['admin', 'orders'] as const,
  list: (params?: AdminListOrdersParams) => [...adminOrderKeys.all, 'list', params] as const,
  detail: (externalId: string) => ['admin', 'orders', externalId] as const,
};

/** Lists all orders. Requires ADMIN role. */
export function useAdminListOrders(params?: AdminListOrdersParams) {
  return useQuery({
    queryKey: adminOrderKeys.list(params),
    queryFn: () => adminApi.listOrders(params),
    staleTime: 30_000,
  });
}

/** Fetches a single order by externalId. Requires ADMIN role. */
export function useAdminOrderDetails(externalId: string) {
  return useQuery({
    queryKey: adminOrderKeys.detail(externalId),
    queryFn: () => adminApi.getOrder(externalId),
    enabled: Boolean(externalId),
    staleTime: 30_000,
  });
}

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

/** Executes a refund for an order. Irreversible — requires confirmation before calling. */
export function useAdminRefundOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (externalId: string) => adminApi.refundOrder(externalId),
    onSuccess: (_result, externalId) => {
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.detail(externalId) });
      toast.success('Refund executed successfully.');
    },
    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}
