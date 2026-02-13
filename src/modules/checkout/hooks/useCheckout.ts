import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { checkoutApi } from '../api/checkout.api';
import type { ShippingAddressValues } from '../schemas/checkoutSchemas';
import { useCartStore } from '@/modules/cart/store/cartStore';
import { cartKeys } from '@/modules/cart/hooks/useCart';
import { mapApiErrorToMessage } from '@/shared/utils/errorMapper';
import { toast } from 'sonner';

export function useCheckout() {
  const { cartId } = useCartStore();
  const clearSession = useCartStore((s) => s.clearSession);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (shippingAddress: ShippingAddressValues) => {
      if (!cartId) throw new Error('No active cart. Please add items to your cart first.');
      return checkoutApi.createOrder({ cartId, shippingAddress });
    },

    onSuccess: (order) => {
      // Clear cart session — order has been placed
      if (cartId) {
        queryClient.removeQueries({ queryKey: cartKeys.session(cartId) });
      }
      clearSession();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.externalId}`);
    },

    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}
