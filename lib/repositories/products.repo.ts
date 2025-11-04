import { createClient } from '@/lib/supabase/server'
import type { Product, ProductInsert, ProductUpdate } from '@/types/products.types'

export const productsRepository = {
  async fetchProducts(): Promise<Product[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Product[]
  },

  async fetchProductById(id: string): Promise<Product> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Product
  },

  async createProduct(product: ProductInsert): Promise<Product> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  async updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  async deleteProduct(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
