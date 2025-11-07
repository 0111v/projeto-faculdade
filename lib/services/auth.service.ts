import { createClient } from '@/lib/supabase/client'
import type { LoginCredentials, SignupCredentials, AuthUser } from '@/types/auth.types'
import type { Profile } from '@/types/profile.types'
import type { User } from '@supabase/supabase-js'

// Helper function to fetch user profile
async function fetchUserProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

// Helper function to attach profile to user
async function attachProfile(user: User | null): Promise<AuthUser | null> {
  if (!user) return null

  const profile = await fetchUserProfile(user.id)
  return {
    ...user,
    profile,
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword(credentials)

    if (error) throw error
    return attachProfile(data.user)
  },

  async signup(credentials: SignupCredentials): Promise<AuthUser | null> {
    const supabase = createClient()
    const { email, password } = credentials

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
    return attachProfile(data.user)
  },

  async logout(): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) throw error
    return attachProfile(user)
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const userWithProfile = await attachProfile(session?.user ?? null)
        callback(userWithProfile)
      }
    )

    return subscription
  },
}
