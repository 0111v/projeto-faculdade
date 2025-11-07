import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/lib/services/orders.service'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  orders: () => [...dashboardKeys.all, 'orders'] as const,
}

export function useFetchAllOrders() {
  return useQuery({
    queryKey: dashboardKeys.orders(),
    queryFn: () => ordersService.fetchAllOrders(),
  })
}
