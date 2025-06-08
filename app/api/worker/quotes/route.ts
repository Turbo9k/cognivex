import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Quote from '@/models/Quote'

// GET /api/worker/quotes - Get all quote requests
export async function GET() {
  try {
    await connectDB()
    
    // Get all quotes from database
    let quotes = await Quote.find({}).sort({ createdAt: -1 })
    
    // If no quotes exist, create seed data
    if (quotes.length === 0) {
      console.log('No quotes found, creating seed data...')
      
      const seedQuotes = Array.from({ length: 25 }, (_, i) => ({
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        company: `Company ${i + 1}`,
        message: `Request for quote on project ${i + 1}. Need pricing for services and timeline.`,
        status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      }))
      
      await Quote.insertMany(seedQuotes)
      quotes = await Quote.find({}).sort({ createdAt: -1 })
      console.log(`Created ${quotes.length} seed quotes`)
    }
    
    return NextResponse.json({ 
      success: true, 
      quotes: quotes.map(quote => ({
        id: quote._id.toString(),
        name: quote.name,
        email: quote.email,
        company: quote.company,
        message: quote.message,
        status: quote.status,
        createdAt: quote.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

// PUT /api/worker/quotes - Update quote status
export async function PUT(request: Request) {
  try {
    await connectDB()
    
    const { id, status } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Quote ID and status are required' },
        { status: 400 }
      )
    }
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }
    
    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
    
    if (!updatedQuote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      quote: {
        id: updatedQuote._id.toString(),
        name: updatedQuote.name,
        email: updatedQuote.email,
        company: updatedQuote.company,
        message: updatedQuote.message,
        status: updatedQuote.status,
        createdAt: updatedQuote.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update quote' },
      { status: 500 }
    )
  }
} 