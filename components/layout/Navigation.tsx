import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Navigation(): JSX.Element {
  return (
    <nav className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              Notion
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Product
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Solutions
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Resources
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Log in
            </Link>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              Get Notion free
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}