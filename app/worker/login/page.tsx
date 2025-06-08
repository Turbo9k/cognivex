'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function WorkerLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { theme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/auth/worker-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // JWT token is set in httpOnly cookie by the API
        router.push('/worker/dashboard')
        router.refresh() // Refresh to update authentication state
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred during login')
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
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid',
                borderColor: theme === 'dark' ? '#4a4a4a' : '#d1d5db',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                backgroundColor: theme === 'dark' ? '#3d3d3d' : 'white',
                color: theme === 'dark' ? '#ffffff' : '#000000'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid',
                borderColor: theme === 'dark' ? '#4a4a4a' : '#d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: theme === 'dark' ? '#3d3d3d' : 'white',
                color: theme === 'dark' ? '#ffffff' : '#000000'
              }}
            />
          </div>

          {error && (
            <div style={{ 
              color: '#ef4444',
              fontSize: '0.875rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#4338ca'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5'
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
} 