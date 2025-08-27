"use client"

import { YouthGroups } from '@/components/youth-groups'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function YouthGroupsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Go Back Button */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <YouthGroups />
    </div>
  )
}
