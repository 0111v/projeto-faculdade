import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersService } from '@/lib/services/orders.service'
import { cartKeys } from '@/lib/queries/cart.queries'
import type { OrderCheckout } from '@/types/orders.types'

// Query keys
export const ordersKeys = {
  all: ['orders'] as const,
  userOrders: () => [...ordersKeys.all, 'user'] as const,
}

// Fetch user orders
export function useFetchUserOrders() {
  return useQuery({
    queryKey: ordersKeys.userOrders(),
    queryFn: () => ordersService.fetchUserOrders(),
  })
}

// Create order mutation
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (customerInfo: OrderCheckout) => ordersService.createOrder(customerInfo),
    onSuccess: () => {
      // Invalidate cart queries since cart will be cleared after order
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      // Invalidate orders queries to refetch updated orders list
      queryClient.invalidateQueries({ queryKey: ordersKeys.userOrders() })
    },
  })
}
