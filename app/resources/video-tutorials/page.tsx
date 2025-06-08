'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'

export default function VideoTutorialsPage() {
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
          Video Tutorials
        </h1>

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
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3"
                alt="Getting Started Videos"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Getting Started Videos
            </h2>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Our collection of getting started videos provides a comprehensive introduction 
              to the platform. From basic navigation to essential features, these tutorials 
              guide you through everything you need to know to begin using the platform 
              effectively. Each video is concise, clear, and designed to help you get up 
              and running quickly.
            </p>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              The videos are organized in a logical sequence, making it easy to follow along 
              and build your knowledge step by step. Whether you're a visual learner or 
              prefer to see features in action, our getting started videos provide an 
              engaging and effective way to learn the platform.
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
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3"
                alt="Advanced Tutorials"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Advanced Tutorials
            </h2>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              Take your skills to the next level with our advanced video tutorials. These 
              in-depth guides cover complex features, advanced workflows, and expert tips 
              to help you maximize your productivity. Learn about automation, custom 
              integrations, and advanced reporting capabilities through detailed, 
              step-by-step demonstrations.
            </p>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              Our advanced tutorials are created by platform experts and power users who 
              share their insights and best practices. Each video includes practical 
              examples and real-world use cases to help you understand how to apply 
              advanced features in your own work. Whether you're looking to optimize 
              your workflow or explore new capabilities, these tutorials provide the 
              guidance you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 