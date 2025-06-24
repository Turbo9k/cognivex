import { NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import { connectDB } from '@/lib/mongodb'
import Quote from '@/models/Quote'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, message } = body

    // Validate required fields
    if (!name || !email || !company || !message) {
      console.error('Missing required fields:', { name, email, company, message })
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create quote
    const quote = {
      id: Date.now().toString(),
      name,
      email,
      company,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    // Read existing data and save to file system (for backward compatibility)
    const data = readData()
    data.quotes.push(quote)
    
    if (!writeData(data)) {
      throw new Error('Failed to save quote to file system')
    }

    // Also save to MongoDB for admin/worker access
    try {
      await connectDB()
      
      const mongoQuote = new Quote({
        name,
        email,
        company,
        message,
        status: 'pending'
      })
      
      await mongoQuote.save()
      console.log('Quote saved to MongoDB successfully')
    } catch (mongoError) {
      console.error('Failed to save quote to MongoDB:', mongoError)
      // Continue with file system save even if MongoDB fails
    }

    console.log('Quote created successfully:', quote)
    return NextResponse.json({ 
      success: true, 
      quote,
      message: 'Quote submitted successfully' 
    })
  } catch (error) {
    console.error('Request processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const data = readData()
    return NextResponse.json({ 
      success: true, 
      quotes: data.quotes 
    })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
} 