"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Share2, X } from "lucide-react"
import { generateShareImage, downloadImage, type ShareImageData } from "@/lib/generate-share-image"
import { useToast } from "@/hooks/use-toast"
import { logIfEnabled } from "@/lib/performance-monitor"

interface SharePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  data: ShareImageData | null
}

export function SharePreviewModal({ isOpen, onClose, data }: SharePreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && data) {
      generatePreview()
    }
  }, [isOpen, data])

  const generatePreview = async () => {
    if (!data) return
    
    setIsGenerating(true)
    try {
      const imageBlob = await generateShareImage(data)
      const url = URL.createObjectURL(imageBlob)
      setPreviewUrl(url)
    } catch (error) {
      logIfEnabled(`Error generating preview: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      toast({
        title: "Error",
        description: "Failed to generate preview. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!data) return
    
    setIsDownloading(true)
    try {
      const imageBlob = await generateShareImage(data)
      const filename = `bible-verse-${new Date().toISOString().split('T')[0]}.png`
      downloadImage(imageBlob, filename)
      
      toast({
        title: "Image Downloaded!",
        description: "Your shareable image has been saved successfully.",
        variant: "default",
      })
    } catch (error) {
      logIfEnabled(`Error downloading image: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Share Your Bible Verse
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Preview */}
          <div className="flex justify-center">
            {isGenerating ? (
              <div className="flex items-center justify-center h-96 w-64 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating preview...</p>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Bible verse share preview" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '70vh' }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleDownload}
              disabled={isDownloading || !previewUrl}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download Image'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>

          {/* Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>This image is optimized for social media sharing</p>
            <p>Perfect for Instagram stories, WhatsApp status, or any social platform</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
