import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { refundSchema, type RefundFormValues } from '../schemas/refundSchemas';
import { useRefundRequest } from '../hooks/useRefundRequest';
import type { RefundResponseDto } from '../types/refund.types';
import { Button, Input } from '@/shared/design-system';

interface RefundFormProps {
  externalId: string;
  /** Maximum refundable amount from the order total */
  maxRefundable?: number;
}

const STATUS_LABELS: Record<RefundResponseDto['status'], string> = {
  PENDING: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const STATUS_CLASSES: Record<RefundResponseDto['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-success-100 text-success-800',
  REJECTED: 'bg-error-100 text-error-800',
};

export function RefundForm({ externalId, maxRefundable }: RefundFormProps) {
  const refundRequest = useRefundRequest(externalId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RefundFormValues>({
    resolver: zodResolver(refundSchema),
  });

  const onSubmit = handleSubmit((values) => {
    refundRequest.mutate(values, {
      onSuccess: () => reset(),
    });
  });

  // Show submitted status
  if (refundRequest.isSuccess && refundRequest.data) {
    const status = refundRequest.data.status;
    return (
      <div
        className="rounded-lg border border-secondary-200 p-5 space-y-3"
        role="status"
        aria-live="polite"
      >
        <h3 className="font-semibold text-secondary-900">Refund Request Submitted</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-600">Status:</span>
          <span
            className={[
              'rounded-full px-2.5 py-0.5 text-xs font-semibold',
              STATUS_CLASSES[status],
            ].join(' ')}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>
        <p className="text-sm text-secondary-500">
          Amount requested: <strong>${refundRequest.data.amount.toFixed(2)}</strong>
        </p>
        <p className="text-sm text-secondary-500">
          Reason: {refundRequest.data.reason}
        </p>
        <p className="text-xs text-secondary-400">
          Refunds are not immediate. You will be notified once your request has been reviewed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Refund request form">
      <div>
        <Input
          id="refund-amount"
          label={maxRefundable ? `Amount (max $${maxRefundable.toFixed(2)})` : 'Refund Amount'}
          type="number"
          step="0.01"
          min="0.01"
          max={maxRefundable}
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />
      </div>

      <div>
        <label
          htmlFor="refund-reason"
          className="mb-1 block text-sm font-medium text-secondary-700"
        >
          Reason
        </label>
        <textarea
          id="refund-reason"
          rows={4}
          placeholder="Please describe why you are requesting a refund…"
          className={[
            'w-full rounded-md border px-3 py-2 text-sm text-secondary-900 placeholder-secondary-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            errors.reason
              ? 'border-error-500 bg-error-50'
              : 'border-secondary-300 bg-white hover:border-secondary-400',
          ].join(' ')}
          aria-describedby={errors.reason ? 'refund-reason-error' : undefined}
          {...register('reason')}
        />
        {errors.reason && (
          <p id="refund-reason-error" className="mt-1 text-xs text-error-600" role="alert">
            {errors.reason.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="danger"
        disabled={refundRequest.isPending}
        loading={refundRequest.isPending}
        className="w-full sm:w-auto"
      >
        {refundRequest.isPending ? 'Submitting…' : 'Submit Refund Request'}
      </Button>

      <p className="text-xs text-secondary-400">
        Refund requests are PENDING by default and do not guarantee an immediate refund.
      </p>
    </form>
  );
}
