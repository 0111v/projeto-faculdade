import type { OrderCheckout, OrderWithItems } from '@/types/orders.types'

class OrdersService {
  // Create order from cart
  async createOrder(customerInfo: OrderCheckout): Promise<OrderWithItems> {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerInfo),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Falha ao criar pedido')
    }

    return data
  }

  // Fetch order by ID
  async fetchOrderById(orderId: string): Promise<OrderWithItems> {
    const response = await fetch(`/api/orders/${orderId}`)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Falha ao carregar pedido')
    }

    return data
  }

  // Fetch all orders for current user
  async fetchUserOrders(): Promise<OrderWithItems[]> {
    const response = await fetch('/api/orders')

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Falha ao carregar pedidos')
    }

    return data
  }

  // Fetch all orders (admin only)
  async fetchAllOrders(): Promise<OrderWithItems[]> {
    const response = await fetch('/api/admin/orders')

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Falha ao carregar pedidos')
    }

    return data
  }
}

export const ordersService = new OrdersService()
