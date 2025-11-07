'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth.store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'
import { useFetchAllOrders } from '@/lib/queries/dashboard.queries'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isLoading, isAdmin } = useAuthStore()
  const { data: orders, isLoading: ordersLoading } = useFetchAllOrders()

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin()) {
      router.push('/')
    }
  }, [user, isAdmin, router])

  // Calculate sales statistics
  const totalOrders = orders?.length || 0
  const totalRevenue = orders?.reduce((sum, order) => sum + order.total_price, 0) || 0
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0

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
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>

          {/* Sales Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Receita Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {totalRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pedidos Concluídos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pedidos Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <p className="text-muted-foreground">Carregando pedidos...</p>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 10).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold">R$ {order.total_price.toFixed(2)}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status === 'completed'
                            ? 'Concluído'
                            : order.status === 'pending'
                            ? 'Pendente'
                            : 'Cancelado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum pedido encontrado</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
