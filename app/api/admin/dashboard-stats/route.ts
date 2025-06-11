import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Subscriber from '@/models/Subscriber'
import Quote from '@/models/Quote'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB()

    // Fetch all statistics in parallel
    const [
      totalUsers,
      totalSubscribers,
      totalQuotes,
      activeUsers,
      pendingQuotes,
      approvedQuotes,
      rejectedQuotes,
      recentSubscribers,
      recentLogins,
      recentQuoteRequests
    ] = await Promise.all([
      // Total users count
      User.countDocuments(),
      
      // Total subscribers count
      Subscriber.countDocuments(),
      
      // Total quotes count
      Quote.countDocuments(),
      
      // Active users (logged in within last 24 hours)
      User.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      
      // Quote analytics
      Quote.countDocuments({ status: 'pending' }),
      Quote.countDocuments({ status: 'approved' }),
      Quote.countDocuments({ status: 'rejected' }),
      
      // Recent subscribers (last 10)
      Subscriber.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('email createdAt'),
      
      // Recent logins for activity feed
      User.find({ lastLogin: { $exists: true } })
        .sort({ lastLogin: -1 })
        .limit(5)
        .select('email lastLogin'),
      
      // Recent quote requests for activity feed
      Quote.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('clientEmail createdAt status')
    ])

    // Build recent activity feed
    const recentActivity: Array<{
      type: 'login' | 'subscription' | 'quote'
      user: string
      time: string
      details: string
    }> = []

    // Add recent logins
    recentLogins.forEach(login => {
      if (login.lastLogin) {
        recentActivity.push({
          type: 'login',
          user: login.email,
          time: formatTimeAgo(login.lastLogin),
          details: 'User logged in'
        })
      }
    })

    // Add recent subscriptions
    recentSubscribers.slice(0, 3).forEach(subscriber => {
      recentActivity.push({
        type: 'subscription',
        user: subscriber.email,
        time: formatTimeAgo(subscriber.createdAt),
        details: 'New subscription'
      })
    })

    // Add recent quote requests
    recentQuoteRequests.forEach(quote => {
      recentActivity.push({
        type: 'quote',
        user: quote.clientEmail || 'Anonymous',
        time: formatTimeAgo(quote.createdAt),
        details: `Quote request ${quote.status}`
      })
    })

    // Sort by most recent and limit to 10
    recentActivity.sort((a, b) => {
      const timeA = parseTimeAgo(a.time)
      const timeB = parseTimeAgo(b.time)
      return timeA - timeB
    })

    const stats = {
      totalUsers,
      totalSubscribers,
      totalQuotes,
      activeUsers,
      recentActivity: recentActivity.slice(0, 10),
      quoteAnalytics: {
        pending: pendingQuotes,
        approved: approvedQuotes,
        rejected: rejectedQuotes,
        totalProcessed: pendingQuotes + approvedQuotes + rejectedQuotes
      },
      recentSubscribers: recentSubscribers.map(sub => ({
        email: sub.email,
        createdAt: sub.createdAt.toISOString()
      }))
    }

    return NextResponse.json({
      success: true,
      stats,
      message: 'Dashboard statistics retrieved successfully'
    })
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard statistics. Please check database connection.',
      stats: null
    }, { status: 500 })
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMins = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMins < 1) {
    return 'just now'
  } else if (diffInMins < 60) {
    return `${diffInMins}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    return `${diffInDays}d ago`
  }
}

// Helper function to parse time ago back to milliseconds for sorting
function parseTimeAgo(timeStr: string): number {
  if (timeStr === 'just now') return 0
  
  const match = timeStr.match(/(\d+)([mhd]) ago/)
  if (!match) return 0
  
  const value = parseInt(match[1])
  const unit = match[2]
  
  switch (unit) {
    case 'm': return value * 60 * 1000
    case 'h': return value * 60 * 60 * 1000
    case 'd': return value * 24 * 60 * 60 * 1000
    default: return 0
  }
} 