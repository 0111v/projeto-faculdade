'use client'

import { useRouter } from 'next/navigation'
import { User, Package, ShoppingBag, Calendar } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth.store'
import { useFetchUserOrders } from '@/lib/queries/orders.queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { data: orders, isLoading } = useFetchUserOrders()

  const totalOrders = orders?.length || 0
  const totalSpent = orders?.reduce((sum, order) => sum + order.total_price, 0) || 0

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* User Information Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Conta</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">
                    {user?.profile?.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                  {user?.profile?.role === 'admin' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID do Usuário</p>
                <p className="font-mono text-xs">{user?.id}</p>
              </div>
              {/* <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Estatísticas</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total de Pedidos</span>
                    <span className="font-semibold">{totalOrders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Gasto</span>
                    <span className="font-semibold">
                      R$ {totalSpent.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-medium">Total de Pedidos</CardTitle>
                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalOrders === 0 && 'Nenhum pedido ainda'}
                  {totalOrders === 1 && 'Pedido realizado'}
                  {totalOrders > 1 && 'Pedidos realizados'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-medium">Total Gasto</CardTitle>
                <Package className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {totalSpent.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Em {totalOrders} {totalOrders === 1 ? 'pedido' : 'pedidos'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pedidos</CardTitle>
            <CardDescription>
              {totalOrders > 0
                ? `Você tem ${totalOrders} ${totalOrders === 1 ? 'pedido' : 'pedidos'}`
                : 'Nenhum pedido realizado ainda'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <p className="text-center text-muted-foreground py-8">Carregando pedidos...</p>
            )}

            {!isLoading && orders && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              Pedido #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                              {order.status === 'completed' && 'Concluído'}
                              {order.status === 'pending' && 'Pendente'}
                              {order.status === 'cancelled' && 'Cancelado'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Total:</span>{' '}
                            <span className="font-bold text-lg">
                              R$ {order.total_price.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => router.push(`/order/${order.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>

                      {/* Order Items Preview */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Itens:</p>
                        <div className="space-y-1">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="text-sm text-muted-foreground flex justify-between">
                              <span>
                                {item.quantity}x {item.product_name}
                              </span>
                              <span>
                                R$ {(item.quantity * item.price_at_time).toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{order.items.length - 3} {order.items.length - 3 === 1 ? 'item' : 'itens'}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && (!orders || orders.length === 0) && (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum pedido ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Quando você fizer um pedido, ele aparecerá aqui.
                </p>
                <Button onClick={() => router.push('/')}>
                  Ir para a loja
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
