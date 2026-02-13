import { z } from 'zod';

export const refundSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be greater than zero.')
    .multipleOf(0.01, 'Amount must have at most two decimal places.'),
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters).').max(500, 'Reason must not exceed 500 characters.'),
});

export type RefundFormValues = z.infer<typeof refundSchema>;
