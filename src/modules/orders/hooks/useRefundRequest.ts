import { useMutation } from '@tanstack/react-query';
import { refundApi } from '../api/refund.api';
import type { RefundFormValues } from '../schemas/refundSchemas';
import { mapApiErrorToMessage } from '@/shared/utils/errorMapper';
import { toast } from 'sonner';

export function useRefundRequest(externalId: string) {
  return useMutation({
    mutationFn: (data: RefundFormValues) => refundApi.createRefundRequest(externalId, data),

    onSuccess: () => {
      toast.success(
        'Refund request submitted. Your request is PENDING review. We will notify you once processed.',
      );
    },

    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}
