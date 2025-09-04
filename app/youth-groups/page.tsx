"use client"

import YouthGroups from '@/components/youth-groups'
import { Navigation } from '@/components/navigation'
import { SmartBackButton } from '@/components/smart-back-button'

export default function YouthGroupsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Smart Back Button */}
        <div className="mb-6">
          <SmartBackButton 
            fallbackPath="/features"
            showHomeButton={true}
          />
        </div>
        
        <YouthGroups />
      </div>
    </div>
  )
}
