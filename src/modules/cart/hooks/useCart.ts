import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cart.api';
import { useCartStore } from '../store/cartStore';
import type { AddCartItemRequest, UpdateCartItemRequest, CartDto } from '../api/cart.api';
import { mapApiErrorToMessage } from '@/shared/utils/errorMapper';
import { toast } from 'sonner';

export const cartKeys = {
  all: ['cart'] as const,
  session: (cartId: string) => [...cartKeys.all, cartId] as const,
};

/** Fetches the current server-side cart. */
export function useCart() {
  const { cartId, sessionId } = useCartStore();

  return useQuery({
    queryKey: cartKeys.session(cartId ?? ''),
    queryFn: () => cartApi.get(cartId!, sessionId!),
    enabled: Boolean(cartId && sessionId),
    staleTime: 30_000,
  });
}

/** Creates an anonymous cart and persists the session. */
export function useCreateCart() {
  const setSession = useCartStore((s) => s.setSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.create(),
    onSuccess: (cart) => {
      setSession(cart.id, cart.sessionId);
      queryClient.setQueryData(cartKeys.session(cart.id), cart);
    },
  });
}

/** Adds a product to the cart. Creates the cart first if none exists. */
export function useAddToCart() {
  const { cartId, sessionId } = useCartStore();
  const setSession = useCartStore((s) => s.setSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCartItemRequest) => {
      let currentCartId = cartId;
      let currentSessionId = sessionId;

      // Auto-create cart on first add
      if (!currentCartId || !currentSessionId) {
        const newCart = await cartApi.create();
        setSession(newCart.id, newCart.sessionId);
        currentCartId = newCart.id;
        currentSessionId = newCart.sessionId;
      }

      return cartApi.addItem(currentCartId, currentSessionId, data);
    },

    onMutate: async () => {
      if (!cartId) return;
      // Optimistic update: snapshot previous data
      await queryClient.cancelQueries({ queryKey: cartKeys.session(cartId) });
      const previous = queryClient.getQueryData<CartDto>(cartKeys.session(cartId));
      return { previous };
    },

    onError: (_err, _vars, context) => {
      // Rollback on failure
      if (cartId && context?.previous) {
        queryClient.setQueryData(cartKeys.session(cartId), context.previous);
      }
      toast.error(mapApiErrorToMessage(_err));
    },

    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.session(updatedCart.id), updatedCart);
      toast.success('Item added to cart');
    },
  });
}

/** Updates the quantity of a cart item. */
export function useUpdateCartItem() {
  const { cartId, sessionId } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: UpdateCartItemRequest & { itemId: string }) => {
      if (!cartId || !sessionId) throw new Error('No active cart session');
      return cartApi.updateItem(cartId, itemId, sessionId, { quantity });
    },

    onMutate: async ({ itemId, quantity }) => {
      if (!cartId) return;
      await queryClient.cancelQueries({ queryKey: cartKeys.session(cartId) });
      const previous = queryClient.getQueryData<CartDto>(cartKeys.session(cartId));
      if (previous) {
        queryClient.setQueryData<CartDto>(cartKeys.session(cartId), {
          ...previous,
          items: previous.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item,
          ),
        });
      }
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (cartId && context?.previous) {
        queryClient.setQueryData(cartKeys.session(cartId), context.previous);
      }
      toast.error(mapApiErrorToMessage(_err));
    },

    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.session(updatedCart.id), updatedCart);
    },
  });
}

/** Removes an item from the cart. */
export function useRemoveCartItem() {
  const { cartId, sessionId } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => {
      if (!cartId || !sessionId) throw new Error('No active cart session');
      return cartApi.removeItem(cartId, itemId, sessionId);
    },

    onMutate: async (itemId) => {
      if (!cartId) return;
      await queryClient.cancelQueries({ queryKey: cartKeys.session(cartId) });
      const previous = queryClient.getQueryData<CartDto>(cartKeys.session(cartId));
      if (previous) {
        queryClient.setQueryData<CartDto>(cartKeys.session(cartId), {
          ...previous,
          items: previous.items.filter((item) => item.id !== itemId),
        });
      }
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (cartId && context?.previous) {
        queryClient.setQueryData(cartKeys.session(cartId), context.previous);
      }
      toast.error(mapApiErrorToMessage(_err));
    },

    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.session(updatedCart.id), updatedCart);
      toast.success('Item removed');
    },
  });
}
