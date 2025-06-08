import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Quote from '@/models/Quote'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const { id } = params

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