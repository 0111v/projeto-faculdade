import { z } from 'zod'
import { profileValidation } from '@/lib/schemas/profile.schema'

// Infer TypeScript types from Zod schemas
export type Profile = z.infer<typeof profileValidation.profile>

export type UserRole = 'customer' | 'admin'
