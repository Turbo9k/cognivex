'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function AllCommunityPage() {
  const { theme } = useTheme()

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          padding: '2rem',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Coming Soon
          </h1>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            We're working on bringing you a comprehensive community platform. Check back soon!
          </p>
          <Link 
            href="/resources/community"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            Back to Community
          </Link>
        </div>
      </div>
    </div>
  )
} 