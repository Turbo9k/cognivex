import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Quote from '@/models/Quote'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Optional file system operations for local development only
let readData: () => any, writeData: (data: any) => boolean
try {
  const dataModule = require('@/lib/data')
  readData = dataModule.readData
  writeData = dataModule.writeData
} catch {
  // File system not available (expected on Vercel)
  readData = () => ({ quotes: [] })
  writeData = () => false
}

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

    // Save to MongoDB (primary storage)
    let mongoSaveSuccess = false
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
      mongoSaveSuccess = true
      console.log('Quote saved to MongoDB successfully')
    } catch (mongoError) {
      console.error('Failed to save quote to MongoDB:', mongoError)
      // If MongoDB fails, we need to throw an error since file system won't work on Vercel
      throw new Error('Failed to save quote to database. Please try again.')
    }

    // Try to save to file system (for local development only - will fail on Vercel)
    try {
      const data = readData()
      data.quotes.push(quote)
      writeData(data)
      console.log('Quote also saved to file system (local dev only)')
    } catch (fileError) {
      // File system write is optional - it will fail on Vercel, which is fine
      console.log('File system save skipped (expected on Vercel):', fileError instanceof Error ? fileError.message : 'Unknown error')
    }

    console.log('Quote created successfully:', quote)
    return NextResponse.json({ 
      success: true, 
      quote,
      message: 'Quote submitted successfully' 
    })
  } catch (error) {
    console.error('Request processing error:', error)
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Database') || errorMessage.includes('MongoDB') || errorMessage.includes('MONGODB_URI')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      )
    }
    
    if (errorMessage.includes('required')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Try to fetch from MongoDB first
    try {
      await connectDB()
      const quotes = await Quote.find({}).sort({ createdAt: -1 })
      return NextResponse.json({ 
        success: true, 
        quotes: quotes.map(quote => ({
          id: quote._id.toString(),
          name: quote.name,
          email: quote.email,
          company: quote.company,
          message: quote.message,
          status: quote.status,
          priority: quote.priority || 'medium',
          createdAt: quote.createdAt.toISOString()
        }))
      })
    } catch (mongoError) {
      console.error('Failed to fetch from MongoDB:', mongoError)
      // Fallback to file system for local development
      try {
        const data = readData()
        return NextResponse.json({ 
          success: true, 
          quotes: data.quotes 
        })
      } catch (fileError) {
        throw new Error('Failed to fetch quotes from both database and file system')
      }
    }
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
} 