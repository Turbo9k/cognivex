import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import Quote from '@/models/Quote'
import Login from '@/models/Login'
import User from '@/models/User'
import ActiveUser from '@/models/ActiveUser'

export async function GET() {
  try {
    await connectDB()
    
    // Get current timestamp for "today" calculations
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    
    // Fetch all statistics in parallel
    const [
      totalUsers,
      totalSubscribers,
      activeUsers,
      quotes,
      todayLogins,
      recentActivity
    ] = await Promise.all([
      // Total users
      User.countDocuments({}),
      
      // Total subscribers
      Subscriber.countDocuments({}),
      
      // Active users (logged in within last 30 minutes)
      Login.countDocuments({
        lastLogin: { $gte: thirtyMinutesAgo },
        success: true
      }),
      
      // All quotes with status breakdown
      Quote.find({}).lean(),
      
      // Today's login count
      Login.countDocuments({
        lastLogin: { $gte: todayStart },
        success: true
      }),
      
      // Recent activity (last 10 items)
      Promise.all([
        Login.find({ success: true })
          .sort({ lastLogin: -1 })
          .limit(3)
          .lean(),
        Subscriber.find({})
          .sort({ createdAt: -1 })
          .limit(3)
          .lean(),
        Quote.find({})
          .sort({ createdAt: -1 })
          .limit(4)
          .lean()
      ])
    ])

    // Process quotes statistics
    const quoteStats = {
      total: quotes.length,
      pending: quotes.filter(q => q.status === 'pending').length,
      approved: quotes.filter(q => q.status === 'approved').length,
      rejected: quotes.filter(q => q.status === 'rejected').length
    }

    // Build recent activity feed
    const activityFeed: Array<{
      id: string;
      type: string;
      description: string;
      timestamp: string;
      user: string;
    }> = []
    
    // Add recent logins
    recentActivity[0].forEach(login => {
      activityFeed.push({
        id: `login_${login._id}`,
        type: 'login',
        description: `User logged in`,
        timestamp: login.lastLogin,
        user: login.email
      })
    })
    
    // Add recent subscribers
    recentActivity[1].forEach(subscriber => {
      activityFeed.push({
        id: `sub_${subscriber._id}`,
        type: 'subscription',
        description: 'New user subscribed to newsletter',
        timestamp: subscriber.createdAt,
        user: subscriber.email
      })
    })
    
    // Add recent quotes
    recentActivity[2].forEach(quote => {
      activityFeed.push({
        id: `quote_${quote._id}`,
        type: 'quote',
        description: `New quote request from ${quote.company || 'client'}`,
        timestamp: quote.createdAt,
        user: quote.email
      })
    })
    
    // Sort activity by timestamp (most recent first)
    activityFeed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    const stats = {
      totalUsers,
      totalSubscribers,
      activeUsers,
      totalQuotes: quoteStats.total,
      pendingQuotes: quoteStats.pending,
      approvedQuotes: quoteStats.approved,
      rejectedQuotes: quoteStats.rejected,
      todayLogins,
      recentActivity: activityFeed.slice(0, 10) // Take top 10 most recent
    }

    return NextResponse.json({ 
      success: true, 
      stats,
      lastUpdated: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    // Return mock data if database fails
    const mockStats = {
      totalUsers: 1247 + Math.floor(Math.random() * 10), // Add some variation
      totalSubscribers: 89 + Math.floor(Math.random() * 5),
      activeUsers: 15 + Math.floor(Math.random() * 15),
      totalQuotes: 156 + Math.floor(Math.random() * 10),
      pendingQuotes: 8 + Math.floor(Math.random() * 8),
      approvedQuotes: 98 + Math.floor(Math.random() * 5),
      rejectedQuotes: 46 + Math.floor(Math.random() * 3),
      todayLogins: 30 + Math.floor(Math.random() * 20),
      recentActivity: [
        {
          id: '1',
          type: 'login',
          description: 'Admin user logged in',
          timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
          user: 'admin@cognivex.com'
        },
        {
          id: '2',
          type: 'quote',
          description: 'New quote request from TechCorp',
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          user: 'client@techcorp.com'
        },
        {
          id: '3',
          type: 'subscription',
          description: 'New user subscribed to newsletter',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          user: 'newuser@example.com'
        },
        {
          id: '4',
          type: 'login',
          description: 'Worker dashboard accessed',
          timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
          user: 'worker@cognivex.com'
        },
        {
          id: '5',
          type: 'quote',
          description: 'Quote approved for StartupXYZ',
          timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
          user: 'contact@startupxyz.com'
        }
      ]
    }
    
    return NextResponse.json({ 
      success: false, 
      stats: mockStats,
      error: 'Using mock data - database connection failed',
      lastUpdated: new Date().toISOString()
    })
  }
} 