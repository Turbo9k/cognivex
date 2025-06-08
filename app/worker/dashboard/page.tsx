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
  const [dataSource, setDataSource] = useState<'loading' | 'database' | 'mock' | 'fallback'>('loading')

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // Set a timeout for the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch('/api/worker/quotes', {
          credentials: 'include',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setQuoteRequests(data.quotes);
            setDataSource(data.source || 'database');
            
            // Show info message if using mock data
            if (data.source === 'mock') {
              console.log('Using temporary data - database connection pending');
            }
          } else {
            setError(data.error || 'Failed to fetch quotes');
          }
        } else {
          setError('Failed to fetch quotes');
        }
      } catch (err) {
        console.error('Error fetching quotes:', err);
        
        // If request times out or fails, show fallback data
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Request timed out, using fallback data');
          // Generate fallback data locally for instant loading
          const fallbackQuotes = Array.from({ length: 25 }, (_, i) => ({
            id: `quote_${i + 1}`,
            name: `Customer ${i + 1}`,
            email: `customer${i + 1}@example.com`,
            company: `Company ${i + 1}`,
            message: `Request for quote on project ${i + 1}. Need pricing for services and timeline.`,
            status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as any,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
                     }));
           setQuoteRequests(fallbackQuotes);
           setDataSource('fallback');
         } else {
          setError('Failed to fetch quotes');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
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

  // Stats
  const stats = {
    total: quoteRequests.length,
    pending: quoteRequests.filter(r => r.status === 'pending').length,
    approved: quoteRequests.filter(r => r.status === 'approved').length,
    rejected: quoteRequests.filter(r => r.status === 'rejected').length
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000'
      }}>
        <div style={{ textAlign: 'center', fontSize: '1.25rem' }}>Loading quote requests...</div>
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
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Worker Dashboard
            </h1>
            <p style={{
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}>
              Manage quote requests and customer inquiries
            </p>
            {dataSource === 'mock' && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}>
                ⚡ Using temporary data - database connection pending
              </div>
            )}
            {dataSource === 'fallback' && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}>
                📡 Connection timeout - showing offline data
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.total}</div>
            <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>Total Requests</div>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pending}</div>
            <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>Pending</div>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{stats.approved}</div>
            <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>Approved</div>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.rejected}</div>
            <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>Rejected</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            Quote Requests ({filteredRequests.length})
          </h2>
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

        {/* Table */}
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
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                backgroundColor: theme === 'dark' ? '#374151' : '#f1f5f9'
              }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Company</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Message</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
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
                  <td style={{ padding: '1rem', maxWidth: '200px', wordBreak: 'break-word' }}>
                    {request.message.length > 50 ? `${request.message.substring(0, 50)}...` : request.message}
                  </td>
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
                            cursor: 'pointer',
                            fontSize: '0.875rem'
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
                            cursor: 'pointer',
                            fontSize: '0.875rem'
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

        {filteredRequests.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: theme === 'dark' ? '#9ca3af' : '#6b7280'
          }}>
            No quote requests found for the selected filter.
          </div>
        )}
      </div>
    </div>
  )
}