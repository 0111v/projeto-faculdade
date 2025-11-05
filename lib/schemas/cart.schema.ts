import { z } from 'zod'

export const cartValidation = {
  // Complete cart item object (from database)
  cartItem: z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    product_id: z.string().uuid(),
    quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
    created_at: z.string(),
    updated_at: z.string(),
  }),

  // For adding item to cart
  cartItemInsert: z.object({
    product_id: z.string().uuid('ID do produto inválido'),
    quantity: z.coerce.number().int().positive('Quantidade deve ser maior que zero').default(1),
  }),

  // For updating quantity
  cartItemUpdate: z.object({
    quantity: z.coerce.number().int().positive('Quantidade deve ser maior que zero'),
  }),
}
