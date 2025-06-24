'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react'

export default function ContactPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      // Clear form and redirect to success page
      setFormData({ name: '', email: '', company: '', message: '' })
      router.push('/contact/success')
    } catch (err) {
      setError('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
        margin: '0 auto',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Contact Us
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: '1.1rem',
          marginBottom: '3rem',
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        }}>
          Get in touch with our team. We're here to help with any questions or support you need.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Contact Information */}
          <div style={{
            padding: '2rem',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '2rem'
            }}>
              Get in Touch
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Mail style={{ color: '#3b82f6' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>Email</div>
                  <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>support@cognivex.com</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Phone style={{ color: '#3b82f6' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>Phone</div>
                  <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>+1 (555) 123-4567</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <MapPin style={{ color: '#3b82f6' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>Address</div>
                  <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                    123 Innovation Drive<br />
                    San Francisco, CA 94105
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Clock style={{ color: '#3b82f6' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>Business Hours</div>
                  <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                    Mon-Fri: 9AM-6PM PST<br />
                    Sat-Sun: 10AM-4PM PST
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              borderRadius: '0.5rem'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Response Time</h3>
              <p style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: '0.9rem' }}>
                We typically respond to all inquiries within 24 hours during business days. 
                For urgent matters, please call us directly.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            padding: '2rem',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <MessageSquare style={{ color: '#3b82f6' }} />
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label htmlFor="name" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                />
              </div>

              <div>
                <label htmlFor="email" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@company.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                />
              </div>

              <div>
                <label htmlFor="company" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Your company name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                />
              </div>

              <div>
                <label htmlFor="message" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us about your inquiry, project requirements, or how we can help you..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    resize: 'vertical'
                  }}
                />
              </div>

              {error && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  borderRadius: '0.375rem',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send style={{ width: '1rem', height: '1rem' }} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div style={{
          padding: '2rem',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Why Choose Cognivex?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Clock style={{ color: '#ffffff' }} />
              </div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>24/7 Support</h3>
              <p style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                Round-the-clock customer support to help you succeed
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Send style={{ color: '#ffffff' }} />
              </div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Fast Response</h3>
              <p style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                Get answers to your questions within 24 hours
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#f59e0b',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <MessageSquare style={{ color: '#ffffff' }} />
              </div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Expert Team</h3>
              <p style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                Experienced professionals ready to assist you
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 