import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Quote from '@/models/Quote'

export async function GET() {
  try {
    await connectDB()
    
    // Get all quote requests, sorted by most recent
    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Quote ID and status are required' },
        { status: 400 }
      )
    }

    await connectDB()
    const quote = await Quote.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    )
  }
} 