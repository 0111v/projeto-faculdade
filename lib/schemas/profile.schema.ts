import { z } from 'zod'

export const profileValidation = {
  profile: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: z.enum(['customer', 'admin']),
    created_at: z.string(),
  }),
}
