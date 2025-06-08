'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

export default function TemplatesPage() {
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
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Templates
        </h1>
        <p style={{
          fontSize: '1.2rem',
          lineHeight: '1.6',
          marginBottom: '2rem',
          textAlign: 'center',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Ready-to-use templates for any use case.
        </p>

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
              height: '300px',
              marginBottom: '2rem',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}>
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3"
                alt="Business Templates"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Business Templates
            </h2>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Our collection of business templates is designed to help you streamline your 
              workflow and maintain consistency across your organization. From project 
              management to client communication, these templates provide a solid foundation 
              for your business needs.
            </p>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              Each template is customizable and includes best practices for various business 
              scenarios. Whether you're managing a small team or a large enterprise, our 
              business templates can help you save time and improve efficiency.
            </p>
          </div>

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
              height: '300px',
              marginBottom: '2rem',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}>
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3"
                alt="Creative Templates"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Creative Templates
            </h2>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Express your creativity with our diverse collection of creative templates. 
              These templates are perfect for designers, artists, and creative professionals 
              looking to showcase their work in unique and engaging ways.
            </p>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              From portfolio layouts to presentation designs, our creative templates offer 
              endless possibilities for customization. Each template is crafted with attention 
              to detail and modern design principles to help you make a lasting impression.
            </p>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <Link 
            href="/resources/templates/all"
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
            Explore
          </Link>
        </div>
      </div>
    </div>
  )
} 