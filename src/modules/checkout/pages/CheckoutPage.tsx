import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { shippingAddressSchema, type ShippingAddressValues } from '../schemas/checkoutSchemas';
import { useCheckout } from '../hooks/useCheckout';
import { useCart } from '@/modules/cart/hooks/useCart';
import { Container, Button, Input } from '@/shared/design-system';

function OrderSummary() {
  const { data: cart, isLoading } = useCart();

  if (isLoading) return <p className="text-sm text-secondary-500">Loading cart…</p>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4 text-center">
        <p className="text-sm text-secondary-500">Your cart is empty.</p>
        <Link to="/products" className="mt-2 inline-block text-sm text-primary-600 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-secondary-200 p-4 space-y-3">
      <h2 className="font-semibold text-secondary-900">Order Summary</h2>
      <ul className="divide-y divide-secondary-100">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-2 text-sm">
            <span className="text-secondary-700">
              {item.product.name}
              <span className="ml-1 text-secondary-400">× {item.quantity}</span>
            </span>
            <span className="font-medium text-secondary-900">
              ${(item.unitPrice * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-secondary-200 pt-3">
        <span className="font-semibold text-secondary-900">Total</span>
        <span className="text-lg font-bold text-secondary-900">${cart.total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const checkout = useCheckout();
  const { data: cart } = useCart();
  const hasItems = (cart?.items.length ?? 0) > 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressValues>({
    resolver: zodResolver(shippingAddressSchema),
  });

  const onSubmit = handleSubmit((values) => {
    checkout.mutate(values);
  });

  return (
    <Container padded>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Checkout</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Shipping form */}
        <section aria-labelledby="shipping-heading">
          <h2 id="shipping-heading" className="mb-4 text-lg font-semibold text-secondary-900">
            Shipping Address
          </h2>
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <Input
              id="street"
              label="Street"
              placeholder="123 Main St"
              autoComplete="street-address"
              error={errors.street?.message}
              {...register('street')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="city"
                label="City"
                placeholder="Springfield"
                autoComplete="address-level2"
                error={errors.city?.message}
                {...register('city')}
              />
              <Input
                id="state"
                label="State / Province"
                placeholder="IL"
                autoComplete="address-level1"
                error={errors.state?.message}
                {...register('state')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="country"
                label="Country"
                placeholder="US"
                autoComplete="country"
                error={errors.country?.message}
                {...register('country')}
              />
              <Input
                id="postalCode"
                label="Postal Code"
                placeholder="62701"
                autoComplete="postal-code"
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={checkout.isPending || !hasItems}
              loading={checkout.isPending}
            >
              {checkout.isPending ? 'Placing order…' : 'Place Order'}
            </Button>
          </form>
        </section>

        {/* Order summary */}
        <aside aria-label="Order summary">
          <OrderSummary />
        </aside>
      </div>
    </Container>
  );
}
