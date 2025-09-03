'use client'

import { useState } from 'react'
import { JournalImageUpload } from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { X } from 'lucide-react'

interface JournalUploadExampleProps {
  onImagesUpload?: (urls: string[]) => void
  onImageRemove?: (url: string) => void
}

export function JournalUploadExample({ 
  onImagesUpload,
  onImageRemove 
}: JournalUploadExampleProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const { toast } = useToast()

  const handleImageUpload = (url: string) => {
    setUploadedImages(prev => [...prev, url])
    onImagesUpload?.(uploadedImages.concat(url))
    toast({
      title: "Image uploaded",
      description: "Your journal image has been uploaded successfully.",
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
        <h3 className="text-lg font-semibold mb-2">Journal Images</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add up to 3 images to your journal entry
        </p>
        
        <JournalImageUpload
          onUpload={handleImageUpload}
          onError={handleUploadError}
          className="max-w-md"
        />
      </div>

      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Uploaded Images ({uploadedImages.length}/3)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((url, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <img
                    src={url}
                    alt={`Journal image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-md"
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
