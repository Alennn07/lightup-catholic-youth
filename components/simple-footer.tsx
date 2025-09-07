"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

export function SimpleFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">LightUp</span>
            </div>
            <p className="text-gray-600 max-w-md text-sm sm:text-base">
              A platform for Catholic youth to connect, grow in faith, and build community together.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors block py-1">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors block py-1">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support#help-center" className="text-gray-600 hover:text-gray-900 transition-colors block py-1">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/support#contact" className="text-gray-600 hover:text-gray-900 transition-colors block py-1">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/support#privacy" className="text-gray-600 hover:text-gray-900 transition-colors block py-1">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-600">© 2024 LightUp. Made with ❤️ for Catholic youth worldwide.</p>
        </div>
      </div>
    </footer>
  )
}
