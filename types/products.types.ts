import { z } from 'zod'
import { productsValidation } from '@/lib/schemas/products.schema'

// Infer TypeScript types from Zod schemas
export type Product = z.infer<typeof productsValidation.product>
export type ProductInsert = z.infer<typeof productsValidation.productInsert>
export type ProductUpdate = z.infer<typeof productsValidation.productUpdate>
