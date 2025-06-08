import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = body.email

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email })
    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      )
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      email,
      createdAt: new Date()
    })

    return NextResponse.json(
      { message: 'Successfully subscribed', subscriber },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving subscriber:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
} 