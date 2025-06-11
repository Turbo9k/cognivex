'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { CheckCircle, XCircle, Clock, TrendingUp, Activity, BarChart3, Calendar, Users } from 'lucide-react'

interface WorkerStats {
  totalQuotes: number
  completionRate: number
  avgResponseTime: number
  todayQuotes: number
}

interface QuoteRequest {
  _id: string
  clientName?: string
  clientEmail: string
  company?: string
  projectType: string
  budget: string
  description: string
  timeline: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

interface DashboardData {
  stats: WorkerStats
  quotes: QuoteRequest[]
}

export default function WorkerDashboard() {
  const { theme } = useTheme()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [statsResponse, quotesResponse] = await Promise.all([
        fetch('/api/worker/stats', {
          headers: { 'Cache-Control': 'no-cache' }
        }),
        fetch('/api/worker/quotes', {
          headers: { 'Cache-Control': 'no-cache' }
        })
      ])

      if (!statsResponse.ok || !quotesResponse.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const [statsData, quotesData] = await Promise.all([
        statsResponse.json(),
        quotesResponse.json()
      ])

      if (!statsData.success || !quotesData.success) {
        throw new Error('Failed to load dashboard data')
      }

      setData({
        stats: statsData.stats,
        quotes: quotesData.quotes
      })
      setError(null)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      setData(null)
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }

  const handleQuoteAction = async (quoteId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/worker/quotes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId,
          status: action === 'approve' ? 'approved' : 'rejected'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update quote')
      }

      // Refresh data after action
      await fetchDashboardData()
    } catch (err) {
      console.error('Error updating quote:', err)
      alert('Failed to update quote. Please try again.')
    }
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dashboard Unavailable</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Data Available</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Unable to load dashboard data.</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { stats, quotes } = data
  const pendingQuotes = quotes.filter(q => q.status === 'pending')
  const approvedQuotes = quotes.filter(q => q.status === 'approved')
  const rejectedQuotes = quotes.filter(q => q.status === 'rejected')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Worker Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Activity className="h-4 w-4" />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuotes}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgResponseTime}h</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Quotes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayQuotes}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quote Management */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Quote Requests ({pendingQuotes.length} pending)
              </h2>
            </div>
            <div className="p-6">
              {pendingQuotes.length > 0 ? (
                <div className="space-y-4">
                  {pendingQuotes.slice(0, 5).map((quote) => (
                    <div key={quote._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {quote.clientName || quote.clientEmail}
                            </h3>
                            {quote.company && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                @ {quote.company}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {quote.projectType} • Budget: {quote.budget} • Timeline: {quote.timeline}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            {quote.description.length > 150 
                              ? `${quote.description.substring(0, 150)}...` 
                              : quote.description
                            }
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Submitted: {new Date(quote.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleQuoteAction(quote._id, 'approve')}
                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleQuoteAction(quote._id, 'reject')}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingQuotes.length > 5 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                      Showing 5 of {pendingQuotes.length} pending requests
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No pending quote requests</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Processing Summary
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{pendingQuotes.length}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: quotes.length > 0 ? `${(pendingQuotes.length / quotes.length) * 100}%` : '0%' }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Approved</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{approvedQuotes.length}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: quotes.length > 0 ? `${(approvedQuotes.length / quotes.length) * 100}%` : '0%' }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{rejectedQuotes.length}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: quotes.length > 0 ? `${(rejectedQuotes.length / quotes.length) * 100}%` : '0%' }}
                ></div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Total Processed</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{quotes.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}