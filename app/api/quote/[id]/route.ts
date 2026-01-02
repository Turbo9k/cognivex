import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Quote from '@/models/Quote'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const quoteId = params.id

    // Validate status
    if (!status || !['pending', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, in-progress, completed, cancelled' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Find and update the quote
    const updatedQuote = await Quote.findByIdAndUpdate(
      quoteId,
      { status },
      { new: true }
    )

    if (!updatedQuote) {
      return NextResponse.json(
        { error: 'Quote not found' },
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
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Database') || errorMessage.includes('MongoDB') || errorMessage.includes('MONGODB_URI')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      )
    }
    
    if (errorMessage.includes('Cast to ObjectId')) {
      return NextResponse.json(
        { error: 'Invalid quote ID format' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id

    // Connect to MongoDB
    await connectDB()

    // Find the quote
    const quote = await Quote.findById(quoteId)

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      quote: {
        id: quote._id.toString(),
        name: quote.name,
        email: quote.email,
        company: quote.company,
        message: quote.message,
        status: quote.status,
        createdAt: quote.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Database') || errorMessage.includes('MongoDB') || errorMessage.includes('MONGODB_URI')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      )
    }
    
    if (errorMessage.includes('Cast to ObjectId')) {
      return NextResponse.json(
        { error: 'Invalid quote ID format' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
} 