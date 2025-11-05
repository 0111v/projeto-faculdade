import { z } from 'zod'
import { cartValidation } from '@/lib/schemas/cart.schema'
import type { Product } from './products.types'

// Types inferred from Zod schemas
export type CartItem = z.infer<typeof cartValidation.cartItem>
export type CartItemInsert = z.infer<typeof cartValidation.cartItemInsert>
export type CartItemUpdate = z.infer<typeof cartValidation.cartItemUpdate>

// Combined type: CartItem + Product (for display)
export interface CartItemWithProduct extends CartItem {
  product: Product
}
