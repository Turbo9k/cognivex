'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
  KeyIcon,
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface Credential {
  _id: string
  username: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  createdAt: string
  permissions: string[]
  provider: 'local' | 'google' | 'github' | 'microsoft'
}

export default function CredentialsPage() {
  const { theme } = useTheme()
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/credentials')
        const data = await response.json()
        
        if (data.success) {
          // Filter to show only credentials created by the website (local provider)
          const websiteCredentials = data.credentials.filter((cred: any) => 
            cred.provider === 'local' || !cred.provider
          )
          setCredentials(websiteCredentials)
        } else {
          console.error('Failed to fetch credentials:', data.error)
          setCredentials([])
        }
      } catch (error) {
        console.error('Error fetching credentials:', error)
        setCredentials([])
      } finally {
        setLoading(false)
      }
    }

    fetchCredentials()
  }, [])

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || cred.role === roleFilter
    const matchesStatus = statusFilter === 'all' || cred.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'moderator': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheckIcon className="h-4 w-4 text-purple-600" />
      case 'moderator': return <KeyIcon className="h-4 w-4 text-blue-600" />
      case 'user': return <UserIcon className="h-4 w-4 text-gray-600" />
      default: return <UserIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const handleDelete = (credentialId: string) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      setCredentials(prev => prev.filter(cred => cred._id !== credentialId))
    }
  }

  const handleStatusChange = (credentialId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setCredentials(prev => prev.map(cred => 
      cred._id === credentialId ? { ...cred, status: newStatus } : cred
    ))
  }

  const roleCounts = {
    total: credentials.length,
    admin: credentials.filter(c => c.role === 'admin').length,
    moderator: credentials.filter(c => c.role === 'moderator').length,
    user: credentials.filter(c => c.role === 'user').length
  }

  const statusCounts = {
    active: credentials.filter(c => c.status === 'active').length,
    inactive: credentials.filter(c => c.status === 'inactive').length,
    suspended: credentials.filter(c => c.status === 'suspended').length
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
                User Credentials ({credentials.length})
              </h1>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <div className="flex items-center">
                <div className="bg-purple-500 p-3 rounded-md">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Admins
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {roleCounts.admin}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-md">
                  <KeyIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Moderators
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {roleCounts.moderator}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <div className="flex items-center">
                <div className="bg-gray-500 p-3 rounded-md">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Users
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {roleCounts.user}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <div className="flex items-center">
                <div className="bg-green-500 p-3 rounded-md">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Active
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {statusCounts.active}
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
                    placeholder="Search by username or email..."
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
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={`px-4 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </select>
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {filteredCredentials.length} credentials found
                </div>
              </div>
            </div>
          </div>

          {/* Credentials Table */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg overflow-hidden`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y divide-gray-200 dark:divide-gray-700`}>
                {filteredCredentials.map((cred) => (
                  <tr key={cred._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {cred.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {cred.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRoleIcon(cred.role)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(cred.role)}`}>
                          {cred.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cred.status)}`}>
                        {cred.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(cred.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                      {cred.provider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {cred.permissions.slice(0, 3).map((perm, idx) => (
                          <span key={idx} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {perm}
                          </span>
                        ))}
                        {cred.permissions.length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            +{cred.permissions.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cred._id)}
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
        </div>
      </main>
    </div>
  )
} 