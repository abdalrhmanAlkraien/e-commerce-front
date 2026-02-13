import { axiosClient } from '@/shared/api/axiosClient';
import type { RefundRequest, RefundResponseDto } from '../types/refund.types';

export const refundApi = {
  createRefundRequest: async (
    externalId: string,
    data: RefundRequest,
  ): Promise<RefundResponseDto> => {
    const response = await axiosClient.post<RefundResponseDto>(
      `/api/v1/public/orders/${externalId}/refund-request`,
      data,
    );
    return response.data;
  },
};
