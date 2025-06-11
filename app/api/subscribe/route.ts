import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export const runtime = 'nodejs'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = body.email?.trim()

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ 
      email: email.toLowerCase() 
    })

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 409 }
      )
    }

    // Create new subscriber
    const newSubscriber = new Subscriber({
      email: email.toLowerCase(),
      status: 'active',
      source: 'website',
      tags: ['newsletter'],
      emailCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Save to database
    await newSubscriber.save()

    // Log the subscription
    console.log('✅ NEW SUBSCRIBER SAVED TO DB:', {
      id: newSubscriber._id,
      email: newSubscriber.email,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json(
      { 
        success: true,
        message: 'Successfully subscribed! Thank you for joining our newsletter.',
        timestamp: new Date().toISOString()
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('❌ Subscription error:', error)
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        )
      }
      if (error.message.includes('Database')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again.' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Unable to process subscription. Please try again.' },
      { status: 500 }
    )
  }
} 