import { z } from 'zod'

export const authValidation = {
  login: z.object({
    email: z.string().email('Endereço de email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  }),

  signup: z.object({
    email: z.string().email('Endereço de email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ['confirmPassword'],
  }),
}
