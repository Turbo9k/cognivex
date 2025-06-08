'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Cognivex
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/product"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Product
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Solutions
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Resources
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/product"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
            >
              Product
            </Link>
            <Link
              href="/solutions"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
            >
              Solutions
            </Link>
            <Link
              href="/resources"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
            >
              Resources
            </Link>
            <Link
              href="/pricing"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
            >
              Pricing
            </Link>
            <div className="mt-4 pl-3 pr-4">
              <Link
                href="/pricing"
                className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 