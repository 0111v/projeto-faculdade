import type { Product, ProductInsert, ProductUpdate } from '@/types/products.types'

export const productsService = {
  async fetchProducts(): Promise<Product[]> {
    const res = await fetch('/api/products', {
      cache: 'no-store',
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to fetch products')
    }

    return res.json()
  },

  async fetchProductById(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to fetch product')
    }

    return res.json()
  },

  async createProduct(product: ProductInsert): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to create product')
    }

    return res.json()
  },

  async updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to update product')
    }

    return res.json()
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to delete product')
    }
  },
}
