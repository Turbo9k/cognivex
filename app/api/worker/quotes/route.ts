import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Quote from '@/models/Quote'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectDB()
    
    // Fetch all quotes, sorted by creation date (newest first)
    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({
      success: true,
      quotes,
      count: quotes.length,
      message: 'Quotes retrieved successfully'
    })
    
  } catch (error) {
    console.error('Error fetching quotes:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch quotes. Please check database connection.',
      quotes: [],
      count: 0
    }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { quoteId, status } = body
    
    if (!quoteId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Quote ID and status are required'
      }, { status: 400 })
    }
    
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Status must be either "approved" or "rejected"'
      }, { status: 400 })
    }
    
    // Update the quote status
    const updatedQuote = await Quote.findByIdAndUpdate(
      quoteId,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    )
    
    if (!updatedQuote) {
      return NextResponse.json({
        success: false,
        error: 'Quote not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      quote: updatedQuote,
      message: `Quote ${status} successfully`
    })
    
  } catch (error) {
    console.error('Error updating quote:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update quote. Please try again.'
    }, { status: 500 })
  }
} 