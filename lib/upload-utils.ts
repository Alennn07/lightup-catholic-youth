// File upload utilities and validation
export interface UploadConfig {
  maxSize: number // in bytes
  allowedTypes: string[]
  allowedExtensions: string[]
}

export const UPLOAD_CONFIGS = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  },
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  }
} as const

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateFile(file: File, config: UploadConfig): ValidationResult {
  // Check file size
  if (file.size > config.maxSize) {
    const maxSizeMB = Math.round(config.maxSize / (1024 * 1024))
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    }
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`
    }
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!config.allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `File extension ${extension} is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`
    }
  }

  return { isValid: true }
}

export function generateFileName(userId: string, originalName: string, type: 'avatar' | 'image'): string {
  const timestamp = Date.now()
  const extension = originalName.substring(originalName.lastIndexOf('.'))
  const randomId = Math.random().toString(36).substring(2, 8)
  
  if (type === 'avatar') {
    return `${userId}/avatar_${timestamp}_${randomId}${extension}`
  }
  
  return `${userId}/image_${timestamp}_${randomId}${extension}`
}

export function getPublicUrl(bucket: string, fileName: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`
}

export function sanitizeFileName(fileName: string): string {
  // Remove any potentially dangerous characters
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}
