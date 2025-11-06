'use client'

import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, PackageOpen, ShoppingCart } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth.store'
import { useFetchProducts } from '@/lib/queries/products.queries'
import { useAddCartItem } from '@/lib/queries/cart.queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { user } = useAuthStore()
  const { data: products, isLoading } = useFetchProducts()
  const addToCartMutation = useAddCartItem()

  const product = products?.find((p) => p.id === productId)

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login')
      return
    }
    if (product) {
      addToCartMutation.mutate({ product_id: product.id, quantity: 1 })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <PackageOpen className="w-16 h-16 text-muted-foreground" />
              <h2 className="text-2xl font-bold">Produto não encontrado</h2>
              <p className="text-muted-foreground text-center">
                O produto que você está procurando não existe ou foi removido.
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a loja
        </Button>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Product Image */}
          <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PackageOpen className="w-24 h-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* Stock Status */}
            <div>
              {product.quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-green-600 font-medium">
                    Em estoque ({product.quantity} {product.quantity === 1 ? 'unidade' : 'unidades'})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-red-600 font-medium">Fora de estoque</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Descrição</h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="mt-auto pt-6">
              <Button
                size="lg"
                className="w-full"
                disabled={product.quantity === 0 || addToCartMutation.isPending}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.quantity === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
