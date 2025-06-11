import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectDB()
    
    // Fetch all subscribers, sorted by creation date (newest first)
    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .select('email status source createdAt updatedAt')
      .lean()
    
    return NextResponse.json(subscribers, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      )
    }

    await connectDB()
    const deletedSubscriber = await Subscriber.findByIdAndDelete(id)

    if (!deletedSubscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Subscriber deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    )
  }
} 