import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Quote from '@/models/Quote'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectDB()

    // Get current date for today's calculations
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    // Fetch statistics in parallel
    const [
      totalQuotes,
      approvedQuotes,
      todayQuotes,
      quotesWithResponseTime
    ] = await Promise.all([
      Quote.countDocuments(),
      Quote.countDocuments({ status: 'approved' }),
      Quote.countDocuments({ 
        createdAt: { $gte: todayStart }
      }),
      Quote.find({ 
        status: { $in: ['approved', 'rejected'] },
        updatedAt: { $exists: true }
      }).select('createdAt updatedAt')
    ])

    // Calculate completion rate
    const completionRate = totalQuotes > 0 
      ? Math.round((approvedQuotes / totalQuotes) * 100) 
      : 0

    // Calculate average response time (in hours)
    let avgResponseTime = 0
    if (quotesWithResponseTime.length > 0) {
      const totalResponseTime = quotesWithResponseTime.reduce((sum, quote) => {
        const responseTime = new Date(quote.updatedAt).getTime() - new Date(quote.createdAt).getTime()
        return sum + (responseTime / (1000 * 60 * 60)) // Convert to hours
      }, 0)
      avgResponseTime = Math.round(totalResponseTime / quotesWithResponseTime.length)
    }

    const stats = {
      totalQuotes,
      completionRate,
      avgResponseTime,
      todayQuotes
    }

    return NextResponse.json({
      success: true,
      stats,
      message: 'Worker statistics retrieved successfully'
    })
    
  } catch (error) {
    console.error('Error fetching worker stats:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch worker statistics. Please check database connection.',
      stats: null
    }, { status: 500 })
  }
} 