'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuthStore } from '@/lib/stores/auth.store'
import { useFetchProducts } from '@/lib/queries/products.queries'
import { useAddCartItem } from '@/lib/queries/cart.queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PackageOpen, ShoppingCart } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'

export default function Home() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { data: products, isLoading, error } = useFetchProducts()
  const addToCartMutation = useAddCartItem()

  const handleAddToCart = (productId: string) => {
    if (!user) {
      router.push('/login')
      return
    }
    addToCartMutation.mutate({ product_id: productId, quantity: 1 })
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Produtos</h2>
          <p className="text-muted-foreground">Navegue pela nossa coleção</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">Falha ao carregar produtos</p>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        {products && (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="flex flex-col overflow-hidden pt-0">
                    {/* Product Image */}
                    <div
                      className="relative w-full h-96 bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PackageOpen className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <CardHeader
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                      <CardDescription>
                        {product.quantity > 0 ? (
                          <span className="text-green-600">Em estoque ({product.quantity})</span>
                        ) : (
                          <span className="text-red-600">Fora de estoque</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grow">
                      <p className="text-3xl font-bold">
                        R$ {product.price.toFixed(2)}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        disabled={product.quantity === 0 || addToCartMutation.isPending}
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.quantity === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Nenhum Produto Ainda</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Não há produtos disponíveis no momento.
                  </p>
                  {user && (
                    <Button onClick={() => router.push('/products')}>
                      Adicionar Produtos
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Loja de Flores. Projeto da faculdade.</p>
        </div>
      </footer>
    </div>
  )
}
