import { createClient } from '@/lib/supabase/client'

const BUCKET_NAME = 'product-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export interface ImageUploadResult {
  url: string
  path: string
}

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ImageUploadError'
  }
}

/**
 * Upload an image to Supabase Storage
 * @param file - The image file to upload
 * @returns Promise with the public URL and storage path
 */
export async function uploadProductImage(file: File): Promise<ImageUploadResult> {
  // Validate file
  if (!file) {
    throw new ImageUploadError('Nenhum arquivo fornecido')
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    throw new ImageUploadError('Tipo de arquivo inválido. Use JPG, PNG, WebP ou GIF')
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new ImageUploadError('Arquivo muito grande. Máximo 5MB')
  }

  const supabase = createClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `products/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new ImageUploadError(`Falha no upload: ${error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return {
    url: publicUrl,
    path: data.path,
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The public URL or path of the image
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return

  const supabase = createClient()

  // Extract path from URL
  let path = imageUrl
  if (imageUrl.includes(BUCKET_NAME)) {
    const parts = imageUrl.split(`${BUCKET_NAME}/`)
    path = parts[parts.length - 1]
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])

  if (error) {
    console.error('Failed to delete image:', error)
    // Don't throw error, just log it
    // Product can still be deleted even if image deletion fails
  }
}

/**
 * Get the file name from a File object for display
 */
export function getFileName(file: File | null): string {
  if (!file) return ''
  return file.name
}

/**
 * Validate if a URL is a valid image URL
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
