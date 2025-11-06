import { createClient } from '@/lib/supabase/server'
import type { Order, OrderItem, OrderCheckout, OrderWithItems } from '@/types/orders.types'

class OrdersRepository {
  // Create order from user's cart with stock validation
  async createOrderFromCart(customerInfo: OrderCheckout): Promise<OrderWithItems> {
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Usuário não autenticado')
    }

    // 2. Fetch user's cart with product details
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        product:products (
          id,
          name,
          price,
          quantity
        )
      `)
      .eq('user_id', user.id)

    if (cartError) {
      throw new Error('Falha ao carregar carrinho')
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Carrinho está vazio')
    }

    // 3. Validate stock availability for all products
    const stockErrors: string[] = []
    for (const item of cartItems) {
      const product = item.product as any
      if (product.quantity < item.quantity) {
        stockErrors.push(`${product.name}: estoque insuficiente (disponível: ${product.quantity}, solicitado: ${item.quantity})`)
      }
    }

    if (stockErrors.length > 0) {
      throw new Error(`Produtos sem estoque suficiente:\n${stockErrors.join('\n')}`)
    }

    // 4. Calculate total price
    const totalPrice = cartItems.reduce((total, item) => {
      const product = item.product as any
      return total + (product.price * item.quantity)
    }, 0)

    // 5. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        customer_name: customerInfo.customer_name,
        customer_phone: customerInfo.customer_phone,
        customer_address: customerInfo.customer_address,
        total_price: totalPrice,
        status: 'completed',
      })
      .select()
      .single()

    if (orderError || !order) {
      throw new Error('Falha ao criar pedido')
    }

    // 6. Create order items and update product quantities
    const orderItemsToInsert = []
    const productUpdates = []

    for (const cartItem of cartItems) {
      const product = cartItem.product as any

      // Prepare order item
      orderItemsToInsert.push({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        quantity: cartItem.quantity,
        price_at_time: product.price,
      })

      // Prepare product quantity update
      productUpdates.push({
        id: product.id,
        newQuantity: product.quantity - cartItem.quantity,
      })
    }

    // Insert order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert)
      .select()

    if (itemsError || !orderItems) {
      // Rollback: delete the order if items creation fails
      await supabase.from('orders').delete().eq('id', order.id)
      throw new Error('Falha ao criar itens do pedido')
    }

    // 7. Update product quantities
    for (const update of productUpdates) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ quantity: update.newQuantity })
        .eq('id', update.id)

      if (updateError) {
        // This is a critical error - order is created but stock not updated
        // In production, you'd want more sophisticated error handling/transactions
        console.error(`Failed to update quantity for product ${update.id}:`, updateError)
        throw new Error('Falha ao atualizar estoque dos produtos')
      }
    }

    // 8. Clear user's cart
    const { error: clearError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (clearError) {
      console.error('Failed to clear cart:', clearError)
      // Not throwing here as order is already created
    }

    // 9. Return order with items
    return {
      ...order,
      items: orderItems,
    } as OrderWithItems
  }

  // Fetch order by ID
  async fetchOrderById(orderId: string): Promise<OrderWithItems | null> {
    const supabase = await createClient()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return null
    }

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (itemsError) {
      throw new Error('Falha ao carregar itens do pedido')
    }

    return {
      ...order,
      items: items || [],
    } as OrderWithItems
  }

  // Fetch all orders for current user
  async fetchUserOrders(): Promise<OrderWithItems[]> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Usuário não autenticado')
    }

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (ordersError) {
      throw new Error('Falha ao carregar pedidos')
    }

    return (orders || []) as OrderWithItems[]
  }
}

export const ordersRepository = new OrdersRepository()
