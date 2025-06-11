'use client'

import React, { useState, useEffect } from 'react'

interface Subscriber {
  _id: string
  email: string
  createdAt: string
}

export default function AdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/subscribers')
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers')
      }
      const data = await response.json()
      setSubscribers(data)
    } catch (err) {
      console.error('Error fetching subscribers:', err)
      setError('Failed to load subscribers')
      // Set empty array to show empty table instead of error
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-gray-900 dark:text-white">Loading subscribers...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Subscribers</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md">
          <p className="text-yellow-800 dark:text-yellow-200">
            {error} - Using demo mode without database connection.
          </p>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Subscribed At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No subscribers found. Database may not be connected.
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber) => (
                <tr key={subscriber._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(subscriber.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 