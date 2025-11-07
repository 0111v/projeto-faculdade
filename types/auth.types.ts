import { z } from 'zod'
import { authValidation } from '@/lib/schemas/auth.schema'
import type { User } from '@supabase/supabase-js'
import type { Profile } from './profile.types'

// Infer types from Zod schemas
export type LoginCredentials = z.infer<typeof authValidation.login>
export type SignupCredentials = z.infer<typeof authValidation.signup>

// Auth user with profile
export interface AuthUser extends User {
  profile?: Profile | null
}

export interface AuthStore {
  user: AuthUser | null
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  setIsLoading: (isLoading: boolean) => void
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  isAdmin: () => boolean
}
