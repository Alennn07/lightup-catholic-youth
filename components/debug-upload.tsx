'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PrayerWallImageUpload, JournalImageUpload } from '@/components/image-upload'
import { useToast } from '@/hooks/use-toast'

export function DebugUpload() {
  const [prayerImage, setPrayerImage] = useState<string>('')
  const [journalImages, setJournalImages] = useState<string[]>([])
  const { toast } = useToast()

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Debug Image Upload</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Prayer Wall Upload</h3>
        <PrayerWallImageUpload
          onUpload={(url) => {
            setPrayerImage(url)
            toast({ title: "Prayer image uploaded", description: url })
          }}
          onError={(error) => {
            toast({ title: "Prayer upload failed", description: error, variant: "destructive" })
          }}
        />
        {prayerImage && (
          <div>
            <p className="text-sm text-gray-600">Uploaded: {prayerImage}</p>
            <img src={prayerImage} alt="Prayer" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Journal Upload</h3>
        <JournalImageUpload
          onUpload={(url) => {
            setJournalImages(prev => [...prev, url])
            toast({ title: "Journal image uploaded", description: url })
          }}
          onError={(error) => {
            toast({ title: "Journal upload failed", description: error, variant: "destructive" })
          }}
        />
        {journalImages.length > 0 && (
          <div>
            <p className="text-sm text-gray-600">Uploaded {journalImages.length} images:</p>
            <div className="flex gap-2">
              {journalImages.map((url, i) => (
                <img key={i} src={url} alt={`Journal ${i+1}`} className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
