'use client'

import { useState } from 'react'
import { Trash2, RefreshCw } from 'lucide-react'

export default function ResetAdmin() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleReset = async () => {
    if (!confirm('Are you sure you want to delete all admin users? This cannot be undone.')) {
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/admin/check-users', {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Successfully deleted ${data.deletedCount} admin user(s). You can now create new admin users.`)
      } else {
        setError(data.error || 'Failed to delete admin users')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 text-red-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Admin Users
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Delete all existing admin users to start fresh
          </p>
        </div>

        <div className="space-y-6">
          {message && (
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{message}</span>
              <div className="mt-4">
                <a
                  href="/setup-admin"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
                >
                  Create New Admin User
                </a>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p className="font-semibold">Current Admin User Found:</p>
            <ul className="text-sm mt-2">
              <li>• Username: <strong>123</strong></li>
              <li>• Email: <strong>admin@cognivex.com</strong></li>
              <li>• Status: <strong>Active</strong></li>
              <li>• Never logged in</li>
            </ul>
          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            {loading ? 'Deleting Admin Users...' : 'Delete All Admin Users'}
          </button>

          <div className="text-center">
            <a
              href="/setup-admin"
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Back to Admin Setup
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 