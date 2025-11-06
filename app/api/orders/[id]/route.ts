import { NextResponse } from 'next/server'
import { ordersRepository } from '@/lib/repositories/orders.repo'

// GET /api/orders/[id] - Fetch order by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const order = await ordersRepository.fetchOrderById(id)

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Fetch order error:', error)
    return NextResponse.json(
      { error: error.message || 'Falha ao carregar pedido' },
      { status: 400 }
    )
  }
}
