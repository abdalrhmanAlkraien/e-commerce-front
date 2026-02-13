import { useParams, Link } from 'react-router-dom';
import { Container } from '@/shared/design-system';

export function ConfirmationPage() {
  const { externalId } = useParams<{ externalId: string }>();

  return (
    <Container padded>
      <div className="mx-auto max-w-lg py-16 text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
          <svg
            className="h-10 w-10 text-success-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-secondary-900">Order Confirmed!</h1>
        <p className="mt-3 text-secondary-600">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {externalId && (
          <div className="mt-6 rounded-lg bg-secondary-50 px-6 py-4">
            <p className="text-sm text-secondary-500">Order reference</p>
            <p
              className="mt-1 font-mono text-sm font-semibold text-secondary-800 break-all"
              aria-label={`Order ID: ${externalId}`}
            >
              {externalId}
            </p>
          </div>
        )}

        <p className="mt-6 text-sm text-secondary-500">
          You will receive a confirmation email once your order is confirmed.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-md font-medium px-5 py-2.5 text-base bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </Container>
  );
}
