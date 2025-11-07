'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, PackageOpen } from 'lucide-react'
import { useFetchCartItems } from '@/lib/queries/cart.queries'
import { useCreateOrder } from '@/lib/queries/orders.queries'
import { ordersValidation } from '@/lib/schemas/orders.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: cartItems, isLoading } = useFetchCartItems()
  const createOrderMutation = useCreateOrder()

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
  })
  const [cardData, setCardData] = useState({
    card_number: '',
    card_name: '',
    card_expiry: '',
    card_cvv: '',
  })
  const [formError, setFormError] = useState('')

  const totalPrice = cartItems?.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    try {
      // Validate form data
      const validatedData = ordersValidation.orderCheckout.parse(formData)

      // Create order
      const order = await createOrderMutation.mutateAsync(validatedData)

      // Redirect to order confirmation
      router.push(`/order/${order.id}`)
    } catch (err: any) {
      if (err.name === 'ZodError') {
        setFormError(err.errors[0].message)
      } else {
        setFormError(err.message || 'Falha ao criar pedido')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <PackageOpen className="w-16 h-16 text-muted-foreground" />
              <h2 className="text-2xl font-bold">Carrinho Vazio</h2>
              <p className="text-muted-foreground text-center">
                Adicione produtos ao carrinho antes de finalizar a compra.
              </p>
              <Button onClick={() => router.push('/')}>
                Ir para a loja
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/cart')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o carrinho
        </Button>

        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div>


            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card_number">Número do Cartão</Label>
                    <Input
                      id="card_number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardData.card_number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
                        const formatted = value.match(/.{1,4}/g)?.join(' ') || value
                        setCardData({ ...cardData, card_number: formatted })
                      }}
                      disabled={createOrderMutation.isPending}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card_name">Nome no Cartão</Label>
                    <Input
                      id="card_name"
                      type="text"
                      placeholder="JOÃO SILVA"
                      value={cardData.card_name}
                      onChange={(e) =>
                        setCardData({ ...cardData, card_name: e.target.value.toUpperCase() })
                      }
                      disabled={createOrderMutation.isPending}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card_expiry">Validade</Label>
                      <Input
                        id="card_expiry"
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        value={cardData.card_expiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '')
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4)
                          }
                          setCardData({ ...cardData, card_expiry: value })
                        }}
                        disabled={createOrderMutation.isPending}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card_cvv">CVV</Label>
                      <Input
                        id="card_cvv"
                        type="text"
                        placeholder="123"
                        maxLength={3}
                        value={cardData.card_cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          setCardData({ ...cardData, card_cvv: value })
                        }}
                        disabled={createOrderMutation.isPending}
                        required
                      />
                    </div>
                  </div>


                </form>
              </CardContent>
            </Card>

            <Card className='mt-4'>
              <CardHeader>
                <CardTitle>Informações de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md whitespace-pre-line">
                      {formError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Nome Completo</Label>
                    <Input
                      id="customer_name"
                      placeholder="João Silva"
                      value={formData.customer_name}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_name: e.target.value })
                      }
                      disabled={createOrderMutation.isPending}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Telefone</Label>
                    <Input
                      id="customer_phone"
                      type="tel"
                      placeholder="(11) 98765-4321"
                      maxLength={15}
                      value={formData.customer_phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        let formatted = value

                        if (value.length > 0) {
                          if (value.length <= 2) {
                            formatted = `(${value}`
                          } else if (value.length <= 6) {
                            formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`
                          } else if (value.length <= 10) {
                            formatted = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
                          } else {
                            formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`
                          }
                        }

                        setFormData({ ...formData, customer_phone: formatted })
                      }}
                      disabled={createOrderMutation.isPending}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_address">Endereço Completo</Label>
                    <Textarea
                      id="customer_address"
                      placeholder="Rua Exemplo, 123&#10;Bairro, Cidade - Estado&#10;CEP: 12345-678"
                      value={formData.customer_address}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_address: e.target.value })
                      }
                      disabled={createOrderMutation.isPending}
                      rows={2}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? 'Processando...' : 'Confirmar Pedido'}
                  </Button>

                </form>
              </CardContent>
            </Card>
          </div>

          

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b last:border-0">
                      <div className="relative w-16 h-16 shrink-0 rounded bg-muted overflow-hidden">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PackageOpen className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="grow">
                        <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
