'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Subscriber {
  _id: string
  email: string
  createdAt: string
  status: 'active' | 'inactive'
  source: string
}

export default function SubscribersPage() {
  const { theme } = useTheme()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'website' | 'api' | 'import' | 'referral'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        // Mock data for demonstration
        const mockSubscribers: Subscriber[] = Array.from({ length: 150 }, (_, i) => ({
          _id: `sub_${i + 1}`,
          email: `user${i + 1}@example.com`,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: Math.random() > 0.1 ? 'active' : 'inactive',
          source: ['website', 'api', 'import', 'referral'][Math.floor(Math.random() * 4)]
        }))
        
        setSubscribers(mockSubscribers)
      } catch (error) {
        console.error('Error fetching subscribers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscribers()
  }, [])

  // Filter and search functionality
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || subscriber.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubscribers = filteredSubscribers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (subscriberId: string) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      setSubscribers(prev => prev.filter(sub => sub._id !== subscriberId))
    }
  }

  const handleExportAll = async () => {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const csvContent = [
        ['Email', 'Status', 'Source', 'Created At'],
        ...subscribers.map(sub => [
          sub.email,
          sub.status,
          sub.source,
          new Date(sub.createdAt).toISOString()
        ])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `all-subscribers-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      
      alert(`Successfully exported ${subscribers.length} subscribers!`)
    } catch (error) {
      alert('Error exporting subscribers. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportFiltered = async () => {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const csvContent = [
        ['Email', 'Status', 'Source', 'Created At'],
        ...filteredSubscribers.map(sub => [
          sub.email,
          sub.status,
          sub.source,
          new Date(sub.createdAt).toISOString()
        ])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `filtered-subscribers-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      
      alert(`Successfully exported ${filteredSubscribers.length} filtered subscribers!`)
    } catch (error) {
      alert('Error exporting subscribers. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) {
      alert('Please select subscribers to delete.');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscribers?`)) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedSubscribers = subscribers.filter(sub => !selectedSubscribers.includes(sub._id));
        setSubscribers(updatedSubscribers);
        setSelectedSubscribers([]);
        setShowBulkActions(false);
        
        alert(`Successfully deleted ${selectedSubscribers.length} subscribers!`);
      } catch (error) {
        alert('Error deleting subscribers. Please try again.');
      }
    }
  };

  const handleBulkStatusUpdate = async (newStatus: 'active' | 'inactive') => {
    if (selectedSubscribers.length === 0) {
      alert('Please select subscribers to update.');
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedSubscribers = subscribers.map(sub => 
        selectedSubscribers.includes(sub._id) 
          ? { ...sub, status: newStatus }
          : sub
      );
      setSubscribers(updatedSubscribers);
      setSelectedSubscribers([]);
      setShowBulkActions(false);
      
      alert(`Successfully updated ${selectedSubscribers.length} subscribers to ${newStatus}!`);
    } catch (error) {
      alert('Error updating subscribers. Please try again.');
    }
  };

  const handleSendNewsletter = async () => {
    const activeSubscribers = subscribers.filter(sub => sub.status === 'active')
    
    if (activeSubscribers.length === 0) {
      alert('No active subscribers to send newsletter to.')
      return
    }
    
    if (confirm(`Send newsletter to ${activeSubscribers.length} active subscribers?`)) {
      setIsSendingNewsletter(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert(`Newsletter sent successfully to ${activeSubscribers.length} active subscribers!`)
      } catch (error) {
        alert('Error sending newsletter. Please try again.')
      } finally {
        setIsSendingNewsletter(false)
      }
    }
  }

  const handleSelectAll = () => {
    if (selectedSubscribers.length === currentSubscribers.length && currentSubscribers.length > 0) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(currentSubscribers.map(sub => sub._id));
    }
  };

  const handleSelectSubscriber = (id: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(id) 
        ? prev.filter(subId => subId !== id)
        : [...prev, id]
    )
  }

  useEffect(() => {
    setShowBulkActions(selectedSubscribers.length > 0)
  }, [selectedSubscribers])

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
                Subscribers ({subscribers.length})
              </h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleExportAll}
                disabled={isExporting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isExporting ? 'Exporting...' : 'Export All'}
              </button>
              <button
                onClick={handleExportFiltered}
                disabled={isExporting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {isExporting ? 'Exporting...' : 'Export Filtered'}
              </button>
              <button
                onClick={handleSendNewsletter}
                disabled={isSendingNewsletter}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {isSendingNewsletter ? 'Sending...' : 'Send Newsletter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Enhanced Controls */}
          <div className="mb-6 space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`px-4 py-2 border rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as any)}
                className={`px-4 py-2 border rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="all">All Sources</option>
                <option value="website">Website</option>
                <option value="api">API</option>
                <option value="import">Import</option>
                <option value="referral">Referral</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportAll}
                disabled={isExporting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : `Export All (${subscribers.length})`}
              </button>
              <button
                onClick={handleExportFiltered}
                disabled={isExporting}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : `Export Filtered (${filteredSubscribers.length})`}
              </button>
              <button
                onClick={handleSendNewsletter}
                disabled={isSendingNewsletter}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isSendingNewsletter ? 'Sending...' : 'Send Newsletter'}
              </button>
            </div>

            {/* Bulk Actions */}
            {showBulkActions && (
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {selectedSubscribers.length} selected:
                  </span>
                  <button
                    onClick={() => handleBulkStatusUpdate('active')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Mark Active
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('inactive')}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                  >
                    Mark Inactive
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedSubscribers([])}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Subscribers Table */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg overflow-hidden`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.length === currentSubscribers.length && currentSubscribers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y divide-gray-200 dark:divide-gray-700`}>
                {currentSubscribers.map((subscriber) => (
                  <tr key={subscriber._id}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber._id)}
                        onChange={() => handleSelectSubscriber(subscriber._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscriber.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                      {subscriber.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(subscriber.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(subscriber._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSubscribers.length)} of {filteredSubscribers.length} results
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