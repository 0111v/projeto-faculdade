import { create } from 'zustand'
import { authService } from '@/lib/services/auth.service'
import type { AuthStore, LoginCredentials, SignupCredentials } from '@/types/auth.types'

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  setIsLoading: (isLoading) => set({ isLoading }),

  login: async (credentials: LoginCredentials) => {
    try {
      const user = await authService.login(credentials)
      set({ user, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  signup: async (credentials: SignupCredentials) => {
    try {
      const user = await authService.signup(credentials)
      set({ user, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await authService.logout()
      set({ user: null })
    } catch (error) {
      throw error
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true })
      const user = await authService.getCurrentUser()
      set({ user, isLoading: false })

      // Listen for auth state changes
      authService.onAuthStateChange((user) => {
        set({ user })
      })
    } catch (error) {
      set({ user: null, isLoading: false })
    }
  },
}))
