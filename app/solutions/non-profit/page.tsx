'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

export default function NonProfitPage() {
  const { theme } = useTheme()

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            padding: '2rem',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              marginBottom: '2rem',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}>
              <Image
                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3"
                alt="Non-profit Solutions"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Non-profit
            </h1>
            <p style={{
              fontSize: '1.2rem',
              lineHeight: '1.6',
              marginBottom: '2rem',
              textAlign: 'center',
              maxWidth: '800px'
            }}>
              For organizations making a difference in the world.
            </p>
            <Link 
              href="/contact"
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
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 