'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer style={{
      backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      padding: '2rem 0',
      marginTop: 'auto',
      borderTop: '1px solid',
      borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Company
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/about" style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  About
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/contact" style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Resources
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/resources/guides" style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Guides
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/resources/templates" style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Templates
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/resources/community" style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Solutions
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/solutions/enterprise" style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Enterprise
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/solutions/small-business" style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Small Business
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/solutions/education" style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Education
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/solutions/non-profit" style={{
                  color: theme === 'dark' ? '#9ca3af' : '#4b5563',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}>
                  Non-profit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid',
          borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb',
          paddingTop: '2rem',
          textAlign: 'center',
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        }}>
          <p>© 2024 Cognivex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 