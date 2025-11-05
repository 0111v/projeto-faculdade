import { createClient } from '@/lib/supabase/server'
import type { CartItem, CartItemInsert, CartItemUpdate, CartItemWithProduct } from '@/types/cart.types'

export const cartRepository = {
  // Fetch all cart items for the user (with product data)
  async fetchCartItems(): Promise<CartItemWithProduct[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform to expected format
    return (data || []).map((item: any) => ({
      ...item,
      product: item.product,
    })) as CartItemWithProduct[]
  },

  // Add item to cart (or update if already exists)
  async addCartItem(item: CartItemInsert): Promise<CartItem> {
    const supabase = await createClient()

    // Get authenticated user's ID
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Usuário não autenticado')

    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('product_id', item.product_id)
      .single()

    if (existing) {
      // If exists, update quantity (add)
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + item.quantity })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return data as CartItem
    } else {
      // If doesn't exist, insert new (including user_id)
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          ...item,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as CartItem
    }
  },

  // Update cart item quantity
  async updateCartItem(id: string, updates: CartItemUpdate): Promise<CartItem> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('cart_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as CartItem
  },

  // Remove item from cart
  async deleteCartItem(id: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Clear entire cart for the user
  async clearCart(): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (error) throw error
  },
}
