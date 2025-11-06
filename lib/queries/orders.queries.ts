import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersService } from '@/lib/services/orders.service'
import { cartKeys } from '@/lib/queries/cart.queries'
import type { OrderCheckout } from '@/types/orders.types'

// Create order mutation
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (customerInfo: OrderCheckout) => ordersService.createOrder(customerInfo),
    onSuccess: () => {
      // Invalidate cart queries since cart will be cleared after order
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
    },
  })
}
