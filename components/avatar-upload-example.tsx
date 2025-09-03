'use client'

import { useState } from 'react'
import { AvatarUpload } from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'

interface AvatarUploadExampleProps {
  currentAvatarUrl?: string
  userName?: string
  onAvatarUpdate?: (newUrl: string) => void
}

export function AvatarUploadExample({ 
  currentAvatarUrl, 
  userName = 'User',
  onAvatarUpdate 
}: AvatarUploadExampleProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl)
  const { toast } = useToast()

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url)
    onAvatarUpdate?.(url)
    toast({
      title: "Avatar updated",
      description: "Your profile picture has been updated successfully.",
    })
  }

  const handleUploadError = (error: string) => {
    toast({
      title: "Upload failed",
      description: error,
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl} alt={userName} />
          <AvatarFallback className="text-lg">
            {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">
            Upload a new profile picture
          </p>
        </div>
      </div>
      
      <AvatarUpload
        onUpload={handleAvatarUpload}
        onError={handleUploadError}
        className="max-w-md"
      />
    </div>
  )
}
