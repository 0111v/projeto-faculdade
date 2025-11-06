import { z } from 'zod'
import { ordersValidation } from '@/lib/schemas/orders.schema'

// Infer TypeScript types from Zod schemas
export type Order = z.infer<typeof ordersValidation.order>
export type OrderItem = z.infer<typeof ordersValidation.orderItem>
export type OrderCheckout = z.infer<typeof ordersValidation.orderCheckout>

// Extended type for order with items
export interface OrderWithItems extends Order {
  items: OrderItem[]
}
