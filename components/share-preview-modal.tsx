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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ✨ Share Your Bible Verse
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            Create a beautiful, shareable image for your faith journey
          </p>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Preview with enhanced styling */}
          <div className="flex justify-center">
            {isGenerating ? (
              <div className="flex items-center justify-center h-[600px] w-[320px] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl shadow-2xl">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
                    <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">Creating your masterpiece...</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This may take a moment</p>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Bible verse share preview" 
                    className="max-w-full h-auto rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{ maxHeight: '75vh' }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm transition-all duration-200"
                    onClick={handleClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleDownload}
              disabled={isDownloading || !previewUrl}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Download className="h-5 w-5 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download Image'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-8 py-3 rounded-xl font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
            >
              Close
            </Button>
          </div>

          {/* Enhanced Info Section */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full">
              <span className="text-2xl">📱</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Optimized for social media
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">📸</span>
                <span>Instagram Stories</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">💬</span>
                <span>WhatsApp Status</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🐦</span>
                <span>Twitter & More</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
