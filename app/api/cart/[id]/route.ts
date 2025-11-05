import { NextRequest, NextResponse } from 'next/server'
import { cartRepository } from '@/lib/repositories/cart.repo'
import { cartValidation } from '@/lib/schemas/cart.schema'

// PUT /api/cart/[id] - Atualizar quantidade do item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validar entrada
    const validatedData = cartValidation.cartItemUpdate.parse(body)

    // Atualizar item
    const item = await cartRepository.updateCartItem(id, validatedData)

    return NextResponse.json(item)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Erro de validação', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Falha ao atualizar item' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/[id] - Remover item do carrinho
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await cartRepository.deleteCartItem(id)
    return NextResponse.json({ message: 'Item removido com sucesso' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Falha ao remover item' },
      { status: 500 }
    )
  }
}
