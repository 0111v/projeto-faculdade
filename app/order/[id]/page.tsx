'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { CheckCircle2, Home } from 'lucide-react'
import { ordersService } from '@/lib/services/orders.service'
import type { OrderWithItems } from '@/types/orders.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'

export default function OrderConfirmationPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await ordersService.fetchOrderById(orderId)
        setOrder(orderData)
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar pedido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Carregando pedido...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <h2 className="text-2xl font-bold">Erro</h2>
              <p className="text-muted-foreground text-center">
                {error || 'Pedido não encontrado'}
              </p>
              <Button onClick={() => router.push('/')}>
                Voltar para a loja
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
          <p className="text-muted-foreground">
            Seu pedido foi realizado com sucesso
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Número do Pedido</p>
                <p className="font-mono font-semibold">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Data</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium text-green-600">Confirmado</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-bold text-lg">
                  R$ {order.total_price.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Nome</p>
              <p className="font-medium">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Telefone</p>
              <p className="font-medium">{order.customer_phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Endereço</p>
              <p className="font-medium whitespace-pre-line">{order.customer_address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: {item.quantity} × R$ {item.price_at_time.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <p className="font-semibold">
                    R$ {(item.quantity * item.price_at_time).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center">
          <Button size="lg" onClick={() => router.push('/')}>
            <Home className="w-4 h-4 mr-2" />
            Voltar para a loja
          </Button>
        </div>
      </div>
    </div>
  )
}
