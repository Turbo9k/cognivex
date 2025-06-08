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

export default function WorkerDashboard() {
  const { theme } = useTheme()
  const router = useRouter()
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  // Check authentication immediately
  const token = localStorage.getItem('workerToken')
  if (!token) {
    router.push('/worker/login')
    return null
  }

  useEffect(() => {
    const fetchQuoteRequests = async () => {
      try {
        const response = await fetch('/api/quote')
        if (!response.ok) {
          throw new Error('Failed to fetch quote requests')
        }
        const data = await response.json()
        // Ensure data is an array
        const requests = Array.isArray(data) ? data : data.quotes || []
        setQuoteRequests(requests)
      } catch (err) {
        setError('Failed to load quote requests')
        setQuoteRequests([]) // Set empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuoteRequests()
  }, [])

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/quote/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setQuoteRequests(prev =>
        prev.map(request =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      )
    } catch (err) {
      setError('Failed to update status')
    }
  }

  // Ensure quoteRequests is an array before filtering
  const filteredRequests = Array.isArray(quoteRequests) 
    ? quoteRequests.filter(request => 
        statusFilter === 'all' ? true : request.status === statusFilter
      )
    : []

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000'
      }}>
        <div style={{ textAlign: 'center' }}>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000'
      }}>
        <div style={{ textAlign: 'center', color: '#dc2626' }}>{error}</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            Quote Requests
          </h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid',
              borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div style={{
          overflowX: 'auto',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db'
              }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Company</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Message</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  style={{
                    borderBottom: '1px solid',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db'
                  }}
                >
                  <td style={{ padding: '1rem' }}>{request.name}</td>
                  <td style={{ padding: '1rem' }}>{request.email}</td>
                  <td style={{ padding: '1rem' }}>{request.company}</td>
                  <td style={{ padding: '1rem' }}>{request.message}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor:
                        request.status === 'approved'
                          ? '#dcfce7'
                          : request.status === 'rejected'
                          ? '#fee2e2'
                          : '#fef3c7',
                      color:
                        request.status === 'approved'
                          ? '#166534'
                          : request.status === 'rejected'
                          ? '#991b1b'
                          : '#92400e'
                    }}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {request.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleStatusChange(request.id, 'approved')}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            borderRadius: '0.375rem',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(request.id, 'rejected')}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            borderRadius: '0.375rem',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 