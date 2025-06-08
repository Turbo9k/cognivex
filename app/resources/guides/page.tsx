'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

export default function GuidesPage() {
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
          Guides & Tutorials
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
          Step-by-step guides to help you master Cognivex.
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
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3"
                alt="Getting Started Guide"
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
              Getting Started Guide
            </h2>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Our comprehensive getting started guide will help you understand the basics 
              of the platform and get up and running quickly. Learn about key features, 
              navigation, and best practices to make the most of your experience.
            </p>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              The guide includes step-by-step instructions, helpful tips, and common 
              troubleshooting solutions. Whether you're a new user or looking to refresh 
              your knowledge, this guide provides everything you need to get started.
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
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3"
                alt="Advanced Features Tutorial"
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
              Advanced Features Tutorial
            </h2>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Take your skills to the next level with our advanced features tutorial. 
              Discover powerful tools and techniques that will help you work more 
              efficiently and achieve better results.
            </p>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              Learn about automation, customization options, and advanced workflows 
              that can transform your experience. This tutorial is perfect for users 
              who want to explore the full potential of the platform.
            </p>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <Link 
            href="/resources/guides/all"
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