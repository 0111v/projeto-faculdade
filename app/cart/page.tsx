'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, PackageOpen } from 'lucide-react'
import {
  useFetchCartItems,
  useUpdateCartItem,
  useDeleteCartItem,
  useClearCart,
} from '@/lib/queries/cart.queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/layout/Navbar'

export default function CartPage() {
  const router = useRouter()
  const { data: items, isLoading } = useFetchCartItems()
  const updateMutation = useUpdateCartItem()
  const deleteMutation = useDeleteCartItem()
  const clearMutation = useClearCart()

  const totalPrice = items?.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateMutation.mutate({ id: itemId, updates: { quantity: newQuantity } })
  }

  const handleRemoveItem = (itemId: string) => {
    deleteMutation.mutate(itemId)
  }

  const handleClearCart = () => {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      clearMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando carrinho...</p>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">

          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center gap-4">
              <ShoppingBag className="w-24 h-24 text-muted-foreground" />
              <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
              <p className="text-muted-foreground">
                Adicione produtos ao carrinho para continuar comprando
              </p>
              <Button onClick={() => router.push('/')} className="mt-4">
                Ir para a loja
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? 'produto' : 'produtos'} no carrinho
              </p>
            </div>
          </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PackageOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow space-y-2">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        Estoque: {item.product.quantity}
                      </p>
                      <p className="text-lg font-bold">
                        R$ {item.product.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateMutation.isPending}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <Input
                          type="number"
                          min="1"
                          max={item.product.quantity}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                          }
                          className="w-20 text-center"
                          disabled={updateMutation.isPending}
                        />

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.quantity || updateMutation.isPending}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={deleteMutation.isPending}
                          className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Subtotal */}
                      <p className="text-sm text-muted-foreground">
                        Subtotal: <span className="font-semibold text-foreground">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" size="lg">
                  Finalizar Compra
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearCart}
                  disabled={clearMutation.isPending}
                >
                  {clearMutation.isPending ? 'Limpando...' : 'Limpar Carrinho'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
