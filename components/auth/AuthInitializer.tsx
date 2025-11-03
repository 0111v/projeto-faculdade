'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth.store'

export function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return null
}
