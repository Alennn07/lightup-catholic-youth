"use client"

// Development-only test page for Youth Groups features
// Only accessible in development mode

import { YouthGroupsTestPanel } from '@/components/dev/youth-groups-test-panel'

export default function DevTestYouthGroupsPage() {
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">This page is only available in development mode.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong>Development Mode:</strong> This is a testing panel for Youth Groups features.
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Youth Groups Testing</h1>
          <p className="text-gray-600 mt-2">
            Test all high-priority features: Real-time updates, Notifications, Advanced Search, and Analytics
          </p>
        </div>
        
        <YouthGroupsTestPanel />
      </div>
    </div>
  )
}
