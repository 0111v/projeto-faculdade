import type { CartItem, CartItemInsert, CartItemUpdate, CartItemWithProduct } from '@/types/cart.types'

export const cartService = {
  async fetchCartItems(): Promise<CartItemWithProduct[]> {
    const res = await fetch('/api/cart', {
      cache: 'no-store',
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Falha ao buscar carrinho')
    }

    return res.json()
  },

  async addCartItem(item: CartItemInsert): Promise<CartItem> {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Falha ao adicionar item ao carrinho')
    }

    return res.json()
  },

  async updateCartItem(id: string, updates: CartItemUpdate): Promise<CartItem> {
    const res = await fetch(`/api/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Falha ao atualizar item')
    }

    return res.json()
  },

  async deleteCartItem(id: string): Promise<void> {
    const res = await fetch(`/api/cart/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Falha ao remover item')
    }
  },

  async clearCart(): Promise<void> {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Falha ao limpar carrinho')
    }
  },
}
