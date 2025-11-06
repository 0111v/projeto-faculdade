import { z } from 'zod'

export const ordersValidation = {
  order: z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    customer_name: z.string().min(1, 'Nome é obrigatório'),
    customer_phone: z.string().min(1, 'Telefone é obrigatório'),
    customer_address: z.string().min(1, 'Endereço é obrigatório'),
    total_price: z.number().nonnegative('Preço total deve ser positivo'),
    status: z.enum(['pending', 'completed', 'cancelled']),
    created_at: z.string(),
  }),

  orderItem: z.object({
    id: z.string().uuid(),
    order_id: z.string().uuid(),
    product_id: z.string().uuid(),
    product_name: z.string(),
    quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
    price_at_time: z.number().nonnegative('Preço deve ser positivo'),
    created_at: z.string(),
  }),

  orderCheckout: z.object({
    customer_name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
    customer_phone: z.string().min(1, 'Telefone é obrigatório').min(10, 'Telefone inválido'),
    customer_address: z.string().min(1, 'Endereço é obrigatório').min(10, 'Endereço deve ter pelo menos 10 caracteres'),
  }),
}
