'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth.store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isLoading, isAdmin } = useAuthStore()

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin()) {
      router.push('/')
    }
  }, [user, isAdmin, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  // Show loading while checking admin status
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Verificando permissões...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Painel</h1>

        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo!</CardTitle>
            <CardDescription>Login realizado com sucesso.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> {user?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>ID do Usuário:</strong> {user?.id}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links Rápidos</CardTitle>
            <CardDescription>Navegue para diferentes seções</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={() => router.push('/products')}>
              Gerenciar Produtos
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
