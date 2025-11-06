import { NextResponse } from 'next/server'
import { ordersRepository } from '@/lib/repositories/orders.repo'
import { ordersValidation } from '@/lib/schemas/orders.schema'

// POST /api/orders - Create order from cart with customer info
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate customer info
    const customerInfo = ordersValidation.orderCheckout.parse(body)

    // Create order (validates stock, creates order, updates quantities, clears cart)
    const order = await ordersRepository.createOrderFromCart(customerInfo)

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('Create order error:', error)

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    // Handle custom errors (stock, cart empty, etc)
    return NextResponse.json(
      { error: error.message || 'Falha ao criar pedido' },
      { status: 400 }
    )
  }
}
