'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

type QuoteRequest = {
  id: string
  name: string
  email: string
  company: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

interface WorkerStats {
  totalQuotes: number
  pendingQuotes: number
  approvedQuotes: number
  rejectedQuotes: number
  todayQuotes: number
  completionRate: number
  avgResponseTime: number
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export default function WorkerDashboard() {
  const { theme } = useTheme()
  const router = useRouter()
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [stats, setStats] = useState<WorkerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [dataSource, setDataSource] = useState<'loading' | 'database' | 'mock' | 'fallback'>('loading')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchData = async () => {
    try {
      // Set a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const [quotesResponse, statsResponse] = await Promise.all([
        fetch('/api/worker/quotes', {
          credentials: 'include',
          signal: controller.signal
        }),
        fetch('/api/worker/stats', {
          credentials: 'include',
          signal: controller.signal
        })
      ]);
      
      clearTimeout(timeoutId);
      
      let quotesData = []
      let statsData = null
             let sourceType: 'loading' | 'database' | 'mock' | 'fallback' = 'database'
      
      if (quotesResponse.ok) {
        const data = await quotesResponse.json();
        if (data.success) {
          quotesData = data.quotes;
          sourceType = data.source || 'database';
        }
      }
      
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        if (data.success) {
          statsData = data.stats;
        }
      }
      
      // If no data or API fails, use fallback data
      if (quotesData.length === 0) {
        quotesData = generateFallbackQuotes();
        sourceType = 'fallback';
      }
      
      if (!statsData) {
        statsData = calculateStatsFromQuotes(quotesData);
      }
      
      setQuoteRequests(quotesData);
      setStats(statsData);
      setDataSource(sourceType);
      setLastUpdated(new Date());
      setError('');
      
    } catch (err) {
      console.error('Error fetching data:', err);
      
      // If request times out or fails, show fallback data
      const fallbackQuotes = generateFallbackQuotes();
      setQuoteRequests(fallbackQuotes);
      setStats(calculateStatsFromQuotes(fallbackQuotes));
      setDataSource('fallback');
      setError('Connection timeout - showing offline data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackQuotes = (): QuoteRequest[] => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: `quote_${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      company: `Company ${i + 1}`,
      message: `Request for quote on project ${i + 1}. Need pricing for services and timeline.`,
      status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as any,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  const calculateStatsFromQuotes = (quotes: QuoteRequest[]): WorkerStats => {
    const today = new Date().toDateString();
    const todayQuotes = quotes.filter(q => new Date(q.createdAt).toDateString() === today).length;
    const approved = quotes.filter(q => q.status === 'approved').length;
    const total = quotes.length;
    
    return {
      totalQuotes: total,
      pendingQuotes: quotes.filter(q => q.status === 'pending').length,
      approvedQuotes: approved,
      rejectedQuotes: quotes.filter(q => q.status === 'rejected').length,
      todayQuotes,
      completionRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      avgResponseTime: Math.floor(Math.random() * 24) + 1, // Mock average hours
      recentActivity: [
        {
          id: '1',
          type: 'quote_approved',
          description: 'Quote approved for TechCorp Inc.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'quote_received',
          description: 'New quote request from StartupXYZ',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'quote_rejected',
          description: 'Quote declined for ProjectABC',
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString()
        }
      ]
    };
  };

  useEffect(() => {
    fetchData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [])

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/worker/quotes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQuoteRequests(prev =>
            prev.map(request =>
              request.id === id ? { ...request, status: newStatus } : request
            )
          );
          // Refresh stats after status change
          setTimeout(fetchData, 1000);
        } else {
          setError(data.error || 'Failed to update status');
        }
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating quote:', err);
      setError('Failed to update status');
    }
  }

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/worker/login');
  };

  // Filter requests
  const filteredRequests = quoteRequests.filter(request => 
    statusFilter === 'all' ? true : request.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-900 dark:text-white text-lg">Loading dashboard...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Worker Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage quote requests and track performance
            </p>
            
            {/* Data Source Indicator */}
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-green-600 dark:text-green-400">
                  Live Updates • Last: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              
              {dataSource === 'mock' && (
                <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                  ⚡ Demo Data
                </div>
              )}
              {dataSource === 'fallback' && (
                <div className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs">
                  📡 Offline Mode
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quotes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingQuotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Quotes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayQuotes}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Requests Table */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
                    Quote Requests ({filteredRequests.length})
                  </h2>
                  
                  <div className="flex space-x-2">
                    {['all', 'pending', 'approved', 'rejected'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter as any)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          statusFilter === filter
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {request.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {request.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusChange(request.id, 'approved')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(request.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {request.status !== 'pending' && (
                            <span className="text-gray-400 dark:text-gray-500">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          {stats && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-xs">📋</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}