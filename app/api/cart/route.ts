import { NextRequest, NextResponse } from 'next/server'
import { cartRepository } from '@/lib/repositories/cart.repo'
import { cartValidation } from '@/lib/schemas/cart.schema'

// GET /api/cart - Buscar itens do carrinho
export async function GET() {
  try {
    const items = await cartRepository.fetchCartItems()
    return NextResponse.json(items)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Falha ao buscar carrinho' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Adicionar item ao carrinho
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar entrada
    const validatedData = cartValidation.cartItemInsert.parse(body)

    // Adicionar item
    const item = await cartRepository.addCartItem(validatedData)

    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Erro de validação', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Falha ao adicionar item ao carrinho' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Limpar carrinho
export async function DELETE() {
  try {
    await cartRepository.clearCart()
    return NextResponse.json({ message: 'Carrinho limpo com sucesso' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Falha ao limpar carrinho' },
      { status: 500 }
    )
  }
}
