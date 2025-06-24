'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface LoginRecord {
  _id: string
  email: string
  loginTime: string
  ipAddress: string
  userAgent: string
  location: string
  status: 'success' | 'failed' | 'blocked'
  method: 'password' | 'oauth' | 'token'
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser?: string
  accountType?: 'admin' | 'worker' | 'user'
}

export default function LoginHistoryPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [logins, setLogins] = useState<LoginRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchLogins = async () => {
      try {
        setLoading(true)
        
        const response = await fetch('/api/admin/logins')
        if (response.ok) {
          const data = await response.json()
          setLogins(data.logins || [])
        } else {
          console.error('Failed to fetch logins')
          setLogins([])
        }
      } catch (error) {
        console.error('Error fetching login history:', error)
        setLogins([])
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchLogins()
    }
  }, [mounted])

  const filteredLogins = logins.filter(login => {
    const matchesSearch = login.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         login.location?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || login.status === statusFilter
    const matchesAccountType = accountTypeFilter === 'all' || login.accountType === accountTypeFilter
    return matchesSearch && matchesStatus && matchesAccountType
  })

  const totalPages = Math.ceil(filteredLogins.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogins = filteredLogins.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'blocked': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <ShieldCheckIcon className="h-4 w-4 text-green-600" />
      case 'failed': return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
      case 'blocked': return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
      default: return null
    }
  }

  const getAccountTypeColor = (accountType: string) => {
    switch (accountType) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'worker': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const statusCounts = {
    total: logins.length,
    success: logins.filter(l => l.status === 'success').length,
    failed: logins.filter(l => l.status === 'failed').length,
    blocked: logins.filter(l => l.status === 'blocked').length,
    admin: logins.filter(l => l.accountType === 'admin').length,
    worker: logins.filter(l => l.accountType === 'worker').length,
    user: logins.filter(l => l.accountType === 'user').length
  }

  const exportLogins = () => {
    const csvContent = [
      ['Email', 'Login Time', 'Status', 'Account Type', 'Location', 'Browser', 'Method'],
      ...filteredLogins.map(login => [
        login.email, 
        login.loginTime, 
        login.status, 
        login.accountType || 'user',
        login.location, 
        login.browser || 'Unknown', 
        login.method || 'password'
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'login-history.csv'
    a.click()
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className={`mr-4 p-2 rounded-md ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Login History ({logins.length.toLocaleString()})
              </h1>
            </div>
            <button
              onClick={exportLogins}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-md">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Total Logins
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {statusCounts.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <div className="flex items-center">
                <div className="bg-green-500 p-3 rounded-md">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Successful
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {statusCounts.success.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <div className="flex items-center">
                <div className="bg-red-500 p-3 rounded-md">
                  <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Failed
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {statusCounts.failed.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <div className="flex items-center">
                <div className="bg-purple-500 p-3 rounded-md">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Admin Logins
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {statusCounts.admin.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg mb-6`}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by email, IP, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                      theme === 'dark'
                        ? 'border-gray-600 bg-gray-700 text-white'
                        : 'border-gray-300 bg-white text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="blocked">Blocked</option>
                </select>
                <select
                  value={accountTypeFilter}
                  onChange={(e) => setAccountTypeFilter(e.target.value)}
                  className={`px-4 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="all">All Account Types</option>
                  <option value="admin">Admin</option>
                  <option value="worker">Worker</option>
                  <option value="user">User</option>
                </select>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {filteredLogins.length.toLocaleString()} records found
                </div>
              </div>
            </div>
          </div>

          {/* Login History Table */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg overflow-hidden`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Account Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Login Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y divide-gray-200 dark:divide-gray-700`}>
                {paginatedLogins.map((login) => (
                  <tr key={login._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {login.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(login.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(login.status)}`}>
                          {login.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(login.accountType || 'user')}`}>
                        {login.accountType || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(login.loginTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">
                      {login.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {login.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                      {login.deviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                      {login.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogins.length)} of {filteredLogins.length.toLocaleString()} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span className={`px-3 py-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 