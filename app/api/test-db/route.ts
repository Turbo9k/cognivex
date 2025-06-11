import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export const runtime = 'nodejs'

export async function GET() {
  try {
    console.log('🔄 Testing database connection...')
    
    // Connect to MongoDB
    await connectDB()
    console.log('✅ Connected to MongoDB')
    
    // Count subscribers
    const subscriberCount = await Subscriber.countDocuments()
    console.log(`📊 Found ${subscriberCount} subscribers`)
    
    // Get all subscribers to verify data
    const subscribers = await Subscriber.find().limit(5)
    console.log('📋 Recent subscribers:', subscribers.map(s => ({ 
      email: s.email, 
      createdAt: s.createdAt 
    })))
    
    return NextResponse.json({
      success: true,
      database: 'cognivex',
      collection: 'subscribers',
      subscriberCount,
      recentSubscribers: subscribers.map(s => ({
        email: s.email,
        createdAt: s.createdAt,
        status: s.status
      })),
      message: 'Database test successful'
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database test failed',
      database: 'cognivex',
      collection: 'subscribers'
    }, { status: 500 })
  }
} 