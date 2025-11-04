'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth.store'
import { useFetchProducts } from '@/lib/queries/products.queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { data: products, isLoading, error } = useFetchProducts()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Loja de Flores</h1>
            <p className="text-sm text-muted-foreground">Um logo aqui</p>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button onClick={() => router.push('/dashboard')} variant="outline">
                  Painel
                </Button>
                <Button onClick={() => router.push('/products')} variant="outline">
                  Gerenciar Produtos
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push('/login')} variant="outline">
                  Entrar
                </Button>
                <Button onClick={() => router.push('/signup')}>
                  Cadastrar
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

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
                  <Card key={product.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                      <CardDescription>
                        {product.quantity > 0 ? (
                          <span className="text-green-600">Em estoque ({product.quantity})</span>
                        ) : (
                          <span className="text-red-600">Fora de estoque</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-3xl font-bold">
                        R$ {product.price.toFixed(2)}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        disabled={product.quantity === 0}
                      >
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
