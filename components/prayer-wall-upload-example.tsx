'use client'

import { useState } from 'react'
import { PrayerWallImageUpload } from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { X } from 'lucide-react'

interface PrayerWallUploadExampleProps {
  onImageUpload?: (url: string) => void
  onImageRemove?: (url: string) => void
}

export function PrayerWallUploadExample({ 
  onImageUpload,
  onImageRemove 
}: PrayerWallUploadExampleProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const { toast } = useToast()

  const handleImageUpload = (url: string) => {
    setUploadedImages(prev => [...prev, url])
    onImageUpload?.(url)
    toast({
      title: "Image uploaded",
      description: "Your prayer image has been uploaded successfully.",
    })
  }

  const handleUploadError = (error: string) => {
    toast({
      title: "Upload failed",
      description: error,
      variant: "destructive",
    })
  }

  const handleRemoveImage = (url: string) => {
    setUploadedImages(prev => prev.filter(img => img !== url))
    onImageRemove?.(url)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Prayer Image</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add an image to accompany your prayer request
        </p>
        
        <PrayerWallImageUpload
          onUpload={handleImageUpload}
          onError={handleUploadError}
          className="max-w-md"
        />
      </div>

      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((url, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <img
                    src={url}
                    alt={`Prayer image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(url)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
