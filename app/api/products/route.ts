import { NextRequest, NextResponse } from 'next/server'
import { productsRepository } from '@/lib/repositories/products.repo'
import { productsValidation } from '@/lib/schemas/products.schema'

// GET /api/products - Fetch all products
export async function GET() {
  try {
    const products = await productsRepository.fetchProducts()
    return NextResponse.json(products)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = productsValidation.productInsert.parse(body)

    // Create product
    const product = await productsRepository.createProduct(validatedData)

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}
