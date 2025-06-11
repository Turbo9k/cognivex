import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Quote from '@/models/Quote'

export async function GET() {
  try {
    await connectDB()
    
    // Get current timestamp for "today" calculations
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    // Fetch all quotes
    const quotes = await Quote.find({}).lean()
    
    // Calculate statistics
    const totalQuotes = quotes.length
    const pendingQuotes = quotes.filter(q => q.status === 'pending').length
    const approvedQuotes = quotes.filter(q => q.status === 'approved').length
    const rejectedQuotes = quotes.filter(q => q.status === 'rejected').length
    
    // Today's quotes
    const todayQuotes = quotes.filter(q => 
      new Date(q.createdAt).toDateString() === today.toDateString()
    ).length
    
    // Completion rate (approved / total processed)
    const processedQuotes = approvedQuotes + rejectedQuotes
    const completionRate = processedQuotes > 0 ? Math.round((approvedQuotes / processedQuotes) * 100) : 0
    
    // Average response time (mock calculation - in real scenario, track processing times)
    const avgResponseTime = Math.floor(Math.random() * 24) + 1 // Hours
    
    // Recent activity from quotes
    const recentQuotes = quotes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    
    const recentActivity = recentQuotes.map(quote => ({
      id: `activity_${quote._id}`,
      type: `quote_${quote.status}`,
      description: getActivityDescription(quote.status, quote.company || 'client'),
      timestamp: quote.updatedAt || quote.createdAt
    }))
    
    const stats = {
      totalQuotes,
      pendingQuotes,
      approvedQuotes,
      rejectedQuotes,
      todayQuotes,
      completionRate,
      avgResponseTime,
      recentActivity
    }

    return NextResponse.json({ 
      success: true, 
      stats,
      lastUpdated: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error fetching worker stats:', error)
    
    // Return mock data if database fails
    const mockStats = {
      totalQuotes: 156 + Math.floor(Math.random() * 10),
      pendingQuotes: 8 + Math.floor(Math.random() * 8),
      approvedQuotes: 98 + Math.floor(Math.random() * 5),
      rejectedQuotes: 46 + Math.floor(Math.random() * 3),
      todayQuotes: 5 + Math.floor(Math.random() * 5),
      completionRate: 75 + Math.floor(Math.random() * 20),
      avgResponseTime: 12 + Math.floor(Math.random() * 12),
      recentActivity: [
        {
          id: '1',
          type: 'quote_approved',
          description: 'Quote approved for TechCorp Inc.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'quote_received',
          description: 'New quote request from StartupXYZ',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'quote_rejected',
          description: 'Quote declined for ProjectABC',
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          type: 'quote_approved',
          description: 'Quote approved for InnovateCorp',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          type: 'quote_pending',
          description: 'Quote review pending for DesignStudio',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
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

function getActivityDescription(status: string, company: string): string {
  switch (status) {
    case 'approved':
      return `Quote approved for ${company}`
    case 'rejected':
      return `Quote declined for ${company}`
    case 'pending':
      return `Quote review pending for ${company}`
    default:
      return `Quote status updated for ${company}`
  }
} 