'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

export default function CommunityPage() {
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
          Community
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
          Connect with other Cognivex users and share ideas.
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
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3"
                alt="Community Forums"
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
              Community Forums
            </h2>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Join our vibrant community forums to connect with other users, share experiences, 
              and learn from each other. Our forums are a great place to ask questions, share 
              tips and tricks, and stay updated on the latest platform developments.
            </p>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              The community is moderated by experienced users and platform experts who ensure 
              a supportive and productive environment. Whether you're a beginner or an advanced 
              user, you'll find valuable insights and connections in our forums.
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
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3"
                alt="Events & Meetups"
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
              Events & Meetups
            </h2>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Stay connected with the community through our regular events and meetups. 
              These gatherings provide opportunities for networking, learning, and sharing 
              experiences with fellow users and platform experts.
            </p>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              From virtual workshops to in-person meetups, our events cover a wide range 
              of topics and skill levels. Join us to expand your knowledge, build your 
              network, and be part of our growing community.
            </p>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <Link 
            href="/resources/community/all"
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