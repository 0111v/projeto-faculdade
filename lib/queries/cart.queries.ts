import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartService } from '@/lib/services/cart.service'
import type { CartItemInsert, CartItemUpdate } from '@/types/cart.types'

// Query keys
export const cartKeys = {
  all: ['cart'] as const,
  items: () => [...cartKeys.all, 'items'] as const,
}

// Fetch cart items
export function useFetchCartItems() {
  return useQuery({
    queryKey: cartKeys.items(),
    queryFn: () => cartService.fetchCartItems(),
  })
}

// Add item to cart
export function useAddCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (item: CartItemInsert) => cartService.addCartItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
    },
  })
}

// Update cart item
export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CartItemUpdate }) =>
      cartService.updateCartItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
    },
  })
}

// Delete cart item
export function useDeleteCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cartService.deleteCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
    },
  })
}

// Clear cart
export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
    },
  })
}
