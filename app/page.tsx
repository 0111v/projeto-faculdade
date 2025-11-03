'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth.store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuthStore()

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
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

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
                <strong>User ID:</strong> {user?.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>O que q a gente vai fazer nesse krai aqui hein?</CardTitle>
            <CardDescription>Project Ideas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              quem tiver alguma sugestao ai se pronuncie kkk
            </p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}
