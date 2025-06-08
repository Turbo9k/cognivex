import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navigation(): JSX.Element {
  return (
    <nav className="border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-white">
              Cognivex
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/product" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm">
                Product
              </Link>
              <Link href="/solutions" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm">
                Solutions
              </Link>
              <Link href="/resources" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm">
                Resources
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm">
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Log in
              </Button>
            </Link>
            <Link href="/pricing">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Get Started
        </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}