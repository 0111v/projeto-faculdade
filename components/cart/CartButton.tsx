'use client'

import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFetchCartItems } from '@/lib/queries/cart.queries'

export function CartButton() {
  const router = useRouter()
  const { data: cartItems } = useFetchCartItems()

  const totalItems = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => router.push('/cart')}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          {totalItems}
        </span>
      )}
      <span className="sr-only">Carrinho ({totalItems} itens)</span>
    </Button>
  )
}
