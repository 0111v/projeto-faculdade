import { z } from 'zod'
import { authValidation } from '@/lib/schemas/auth.schema'
import type { User } from '@supabase/supabase-js'

// Infer types from Zod schemas
export type LoginCredentials = z.infer<typeof authValidation.login>
export type SignupCredentials = z.infer<typeof authValidation.signup>

// Auth store types
export type AuthUser = User | null

export interface AuthStore {
  user: AuthUser
  isLoading: boolean
  setUser: (user: AuthUser) => void
  setIsLoading: (isLoading: boolean) => void
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
}
