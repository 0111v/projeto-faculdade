import { createClient } from '@/lib/supabase/client'
import type { LoginCredentials, SignupCredentials, AuthUser } from '@/types/auth.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword(credentials)

    if (error) throw error
    return data.user
  },

  async signup(credentials: SignupCredentials): Promise<AuthUser> {
    const supabase = createClient()
    const { email, password } = credentials

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
    return data.user
  },

  async logout(): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  },

  async getCurrentUser(): Promise<AuthUser> {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) throw error
    return user
  },

  onAuthStateChange(callback: (user: AuthUser) => void) {
    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        callback(session?.user ?? null)
      }
    )

    return subscription
  },
}
