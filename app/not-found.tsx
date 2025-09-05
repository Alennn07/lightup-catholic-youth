"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            {/* 404 Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                <Search className="w-16 h-16 text-red-500" />
              </div>
            </div>

            {/* 404 Text */}
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 bg-white">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 p-6 bg-white/50 rounded-xl backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Looking for something specific?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/features" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-blue-600 font-medium">Features</div>
                  <div className="text-sm text-gray-600">Explore all our tools</div>
                </Link>
                <Link href="/youth-groups" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-green-600 font-medium">Youth Groups</div>
                  <div className="text-sm text-gray-600">Connect with others</div>
                </Link>
                <Link href="/about" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-purple-600 font-medium">About</div>
                  <div className="text-sm text-gray-600">Learn more about us</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
