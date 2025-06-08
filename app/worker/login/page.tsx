'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function WorkerLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { theme } = useTheme()

  // Check if user is already authenticated as worker
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if there's a valid worker token
        const response = await fetch('/api/auth/check-worker', {
          credentials: 'include'
        });
        
        if (response.ok) {
          // Already authenticated as worker, redirect to dashboard
          window.location.href = '/worker/dashboard';
          return;
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        // Invalid token will be handled by the API
      }
    };
    
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Attempting worker login...');
      const response = await fetch('/api/auth/worker-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      console.log('Response status:', response.status);
      const data = await response.json()
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Login successful, redirecting...');
        
        // Immediate redirect without timeout
        window.location.href = '/worker/dashboard';
        
      } else {
        setError(data.error || 'Login failed')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login')
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f3f4f6'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: theme === 'dark' ? '#2d2d2d' : 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          marginBottom: '2rem',
          textAlign: 'center',
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: theme === 'dark' ? '#ffffff' : '#111827'
        }}>
          Worker Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid',
                borderColor: theme === 'dark' ? '#4a4a4a' : '#d1d5db',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                backgroundColor: theme === 'dark' ? '#3d3d3d' : 'white',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                opacity: loading ? 0.6 : 1
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid',
                borderColor: theme === 'dark' ? '#4a4a4a' : '#d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: theme === 'dark' ? '#3d3d3d' : 'white',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                opacity: loading ? 0.6 : 1
              }}
            />
          </div>

          {error && (
            <div style={{ 
              color: '#ef4444',
              fontSize: '0.875rem',
              textAlign: 'center',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#fee2e2',
              borderRadius: '0.25rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: loading ? '#9ca3af' : '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#4338ca'
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#4f46e5'
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ 
          marginTop: '1rem', 
          textAlign: 'center', 
          fontSize: '0.75rem',
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        }}>
          Use: worker / worker
        </div>
      </div>
    </div>
  )
} 