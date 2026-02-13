import type { CartItemDto } from '../api/cart.api';
import { useUpdateCartItem, useRemoveCartItem } from '../hooks/useCart';
import { Button } from '@/shared/design-system';

interface CartItemProps {
  item: CartItemDto;
}

export function CartItem({ item }: CartItemProps) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const isUpdating = updateItem.isPending;
  const isRemoving = removeItem.isPending;
  const isBusy = isUpdating || isRemoving;

  function handleDecrement() {
    if (item.quantity <= 1) {
      removeItem.mutate(item.id);
    } else {
      updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 });
    }
  }

  function handleIncrement() {
    updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 });
  }

  function handleRemove() {
    removeItem.mutate(item.id);
  }

  return (
    <li className="flex gap-3 py-4" aria-label={item.product.name}>
      {/* Product image */}
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-secondary-100">
        {item.product.imageUrl ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-secondary-300">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-secondary-900 leading-tight">{item.product.name}</p>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isBusy}
            className="flex-shrink-0 text-secondary-400 hover:text-error-600 disabled:opacity-40 transition-colors"
            aria-label={`Remove ${item.product.name} from cart`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-secondary-500">${item.unitPrice.toFixed(2)} each</p>

        {/* Quantity controls + line total */}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1" role="group" aria-label="Quantity">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={isBusy}
              aria-label="Decrease quantity"
              className="h-7 w-7 p-0"
            >
              –
            </Button>
            <span
              className="min-w-[2rem] text-center text-sm font-medium text-secondary-900"
              aria-live="polite"
              aria-atomic="true"
            >
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              disabled={isBusy}
              aria-label="Increase quantity"
              className="h-7 w-7 p-0"
            >
              +
            </Button>
          </div>
          <p className="text-sm font-semibold text-secondary-900">
            ${(item.unitPrice * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </li>
  );
}
