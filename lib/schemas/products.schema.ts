import { z } from 'zod'

export const productsValidation = {
  product: z.object({
    id: z.string().uuid(),
    created_at: z.string(),
    name: z.string().min(1, 'Nome é obrigatório'),
    price: z.number().nonnegative('Preço deve ser positivo'),
    quantity: z.number().int().nonnegative('Quantidade deve ser um número inteiro positivo'),
    image_url: z.string().url('URL da imagem inválida').nullable().optional(),
  }),

  productInsert: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    price: z.coerce.number().nonnegative('Preço deve ser positivo'),
    quantity: z.coerce.number().int().nonnegative('Quantidade deve ser um número inteiro positivo'),
    image_url: z.string().url('URL da imagem inválida').nullable().optional(),
  }),

  productUpdate: z.object({
    name: z.string().min(1, 'Nome é obrigatório').optional(),
    price: z.coerce.number().nonnegative('Preço deve ser positivo').optional(),
    quantity: z.coerce.number().int().nonnegative('Quantidade deve ser um número inteiro positivo').optional(),
    image_url: z.string().url('URL da imagem inválida').nullable().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização',
  }),
}
