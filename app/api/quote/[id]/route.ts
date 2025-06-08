import { NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'

interface Quote {
  id: string
  name: string
  email: string
  company: string
  message: string
  status: string
  createdAt: string
}

// Reference to the quotes array from the main route
declare global {
  var quotes: any[]
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const quoteId = params.id

    // Read existing data
    const data = readData()
    
    // Find and update the quote
    const quoteIndex = data.quotes.findIndex((q: Quote) => q.id === quoteId)
    if (quoteIndex === -1) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Update quote status
    data.quotes[quoteIndex] = {
      ...data.quotes[quoteIndex],
      status
    }

    // Save to file
    if (!writeData(data)) {
      throw new Error('Failed to update quote')
    }

    return NextResponse.json({ 
      success: true, 
      quote: data.quotes[quoteIndex]
    })
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    )
  }
} 