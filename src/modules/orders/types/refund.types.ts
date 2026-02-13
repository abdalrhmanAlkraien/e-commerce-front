/** Local types for refund endpoints — not yet in the bootstrap api.ts stub. */

export interface RefundRequest {
  amount: number;
  reason: string;
}

export interface RefundResponseDto {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}
