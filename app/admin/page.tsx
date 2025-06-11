'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalUsers: number
  totalSubscribers: number
  activeUsers: number
  totalQuotes: number
  pendingQuotes: number
  approvedQuotes: number
  rejectedQuotes: number
  todayLogins: number
  recentActivity: ActivityItem[]
}

interface ActivityItem {
  id: string
  type: 'login' | 'subscription' | 'quote' | 'user_registration'
  description: string
  timestamp: string
  user?: string
}

interface Subscriber {
  _id: string
  email: string
  createdAt: string
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const router = useRouter()

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [statsResponse, subscribersResponse] = await Promise.all([
        fetch('/api/admin/dashboard-stats'),
        fetch('/api/subscribers')
      ])

      let statsData = null
      let subscribersData = []

      if (statsResponse.ok) {
        const result = await statsResponse.json()
        if (result.success) {
          statsData = result.stats
        }
      }

      if (subscribersResponse.ok) {
        subscribersData = await subscribersResponse.json()
      }

      // If no real data, generate mock data for demonstration
      if (!statsData) {
        const mockStats: DashboardStats = {
          totalUsers: 1247,
          totalSubscribers: subscribersData.length || 89,
          activeUsers: 23,
          totalQuotes: 156,
          pendingQuotes: 12,
          approvedQuotes: 98,
          rejectedQuotes: 46,
          todayLogins: 45,
          recentActivity: [
            {
              id: '1',
              type: 'login',
              description: 'Admin user logged in',
              timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
              user: 'admin@cognivex.com'
            },
            {
              id: '2',
              type: 'quote',
              description: 'New quote request submitted',
              timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
              user: 'client@company.com'
            },
            {
              id: '3',
              type: 'subscription',
              description: 'New user subscribed to newsletter',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              user: 'newuser@email.com'
            },
            {
              id: '4',
              type: 'user_registration',
              description: 'New user account created',
              timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
              user: 'worker@cognivex.com'
            },
            {
              id: '5',
              type: 'login',
              description: 'Worker dashboard accessed',
              timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              user: 'worker@cognivex.com'
            }
          ]
        }
        statsData = mockStats
      }

      setStats(statsData)
      setSubscribers(subscribersData)
      setLastUpdated(new Date())
      setError('')
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return '🔐'
      case 'subscription': return '📧'
      case 'quote': return '💼'
      case 'user_registration': return '👤'
      default: return '📊'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return 'text-blue-600 dark:text-blue-400'
      case 'subscription': return 'text-green-600 dark:text-green-400'
      case 'quote': return 'text-purple-600 dark:text-purple-400'
      case 'user_registration': return 'text-orange-600 dark:text-orange-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-900 dark:text-white">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time system overview and analytics
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-green-600 dark:text-green-400">Live Updates</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200">
            {error} - Using demo data for demonstration.
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <span className="text-2xl">📧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Subscribers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSubscribers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <span className="text-2xl">💼</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuotes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <span className="text-2xl">🟢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quote Statistics */}
        {stats && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quote Analytics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Pending</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(stats.pendingQuotes / stats.totalQuotes) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.pendingQuotes}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Approved</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(stats.approvedQuotes / stats.totalQuotes) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.approvedQuotes}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Rejected</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(stats.rejectedQuotes / stats.totalQuotes) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.rejectedQuotes}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {stats && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                    {activity.user && (
                      <p className={`text-xs ${getActivityColor(activity.type)}`}>{activity.user}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subscribers Table */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Subscribers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subscribed At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No subscribers found. Database connection may be pending.
                  </td>
                </tr>
              ) : (
                subscribers.slice(0, 10).map((subscriber) => (
                  <tr key={subscriber._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(subscriber.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {subscribers.length > 10 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-center">
            <button 
              onClick={() => router.push('/admin/subscribers')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
            >
              View all {subscribers.length} subscribers →
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 