'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { uploadProductImage, ImageUploadError } from '@/lib/utils/image-upload'

interface ImageUploadProps {
  value: string | null | undefined
  onChange: (url: string | null) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setIsUploading(true)

    try {
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Upload to Supabase
      const result = await uploadProductImage(file)

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl)

      // Update with actual URL
      setPreview(result.url)
      onChange(result.url)
    } catch (err) {
      if (err instanceof ImageUploadError) {
        setError(err.message)
      } else {
        setError('Erro ao fazer upload da imagem')
      }
      setPreview(value || null)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>Imagem do Produto</Label>

      <div className="flex items-start gap-4">
        {/* Preview or Placeholder */}
        <div className="relative w-32 h-32 border-2 border-dashed rounded-lg overflow-hidden bg-muted">
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />

          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled || isUploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Fazendo upload...' : preview ? 'Trocar imagem' : 'Selecionar imagem'}
          </Button>

          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP ou GIF (máx. 5MB)
          </p>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
