'use client'

import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/stores/auth.store'
import { cartKeys } from '@/lib/queries/cart.queries'
import { ordersKeys } from '@/lib/queries/orders.queries'
import { Button } from '@/components/ui/button'
import { CartButton } from '@/components/cart/CartButton'
import { useState } from 'react'
import { Ghost, Menu, X } from 'lucide-react'

interface NavbarProps {
  showAuth?: boolean
}

export function Navbar({ showAuth = true }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { user, logout, isAdmin } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      // Clear all user-specific queries on logout
      queryClient.removeQueries({ queryKey: cartKeys.all })
      queryClient.removeQueries({ queryKey: ordersKeys.all })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
          >
            <div className="relative w-40 h-16 overflow-hidden flex items-center justify-center">
              {/* Placeholder - Replace with actual logo */}
              <Image
                src="/images/logo3.png"
                alt="Logo"
                fill
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  if (target.parentElement) {
                    target.parentElement.innerHTML = '<span class="text-2xl font-bold">🌸</span>'
                  }
                }}
              />
            </div>
            {/* <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">Loja</span>
              <span className="text-xs text-muted-foreground">Seus produtos favoritos</span>
            </div> */}
          </div>

          {/* Navigation Actions */}

          {/* Desktop Menu */}
          {showAuth && (
            <>
              <div className="md:flex items-center gap-3 hidden">
                <CartButton />
                {/* <Button
                  onClick={() => router.push('/about')}
                  variant={pathname === '/about' ? 'default' : 'outline'}
                  size="sm"
                >
                  About
                </Button> */}

                {user ? (
                  <>
                    <Button
                      onClick={() => router.push('/profile')}
                      variant={pathname === '/profile' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Perfil
                    </Button>
                    {isAdmin() && (
                      <>
                        <Button
                          onClick={() => router.push('/dashboard')}
                          variant={pathname === '/dashboard' ? 'default' : 'outline'}
                          size="sm"
                        >
                          Painel
                        </Button>
                        <Button
                          onClick={() => router.push('/products')}
                          variant={pathname === '/products' ? 'default' : 'outline'}
                          size="sm"
                        >
                          Gerenciar Produtos
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => router.push('/login')}
                      variant={pathname === '/login' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Entrar
                    </Button>
                    <Button
                      onClick={() => router.push('/signup')}
                      variant={pathname === '/signup' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Cadastrar
                    </Button>
                  </>
                )}
              </div>
              <div className='flex gap-3 md:hidden'>
                <CartButton />
                <Button
                  size='sm'
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X /> : <Menu />}
                </Button>
              </div>
            </>
            
          )}
        </div> 

        {/* Mobile Menu */}
        {showAuth && menuOpen && (
          <div className='flex flex-col bg-gray-100'>
              {user ? (
                  <>
                    <Button
                      onClick={() => router.push('/profile')}
                      variant="ghost"
                      size="sm"
                      className={`rounded-none ${pathname === '/profile' ? 'bg-gray-300' : ''}`}
                    >
                      Perfil
                    </Button>
                    {isAdmin() && (
                      <>
                        <Button
                          onClick={() => router.push('/dashboard')}
                          variant="ghost"
                          size="sm"
                          className={`rounded-none ${pathname === '/dashboard' ? 'bg-gray-300' : ''}`}
                        >
                          Painel
                        </Button>
                        <Button
                          onClick={() => router.push('/products')}
                          variant="ghost"
                          size="sm"
                          className={`rounded-none ${pathname === '/products' ? 'bg-gray-300' : ''}`}
                        >
                          Gerenciar Produtos
                        </Button>
                      </>
                    )}
                    {/* <Button
                      onClick={() => router.push('/about')}
                      variant="ghost"
                      size="sm"
                      className={`rounded-none ${pathname === '/about' ? 'bg-gray-300' : ''}`}
                    >
                      Sobre nos
                    </Button> */}
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      size="sm"
                      className="rounded-none"
                    >
                      Sair
                    </Button>

                    </>
                ) : (
                  <>
                    <Button
                      onClick={() => router.push('/login')}
                      variant="ghost"
                      size="sm"
                      className={`rounded-none ${pathname === '/login' ? 'bg-gray-300' : ''}`}
                    >
                      Entrar
                    </Button>
                    <Button
                      onClick={() => router.push('/signup')}
                      variant='ghost'
                      size="sm"
                      className={`rounded-none ${pathname === '/signup' ? 'bg-gray-300' : ''}`}
                    >
                      Cadastrar
                    </Button>
                  </>
                )}
          </div>
        )}
      </div>
    </header>
  )
}
