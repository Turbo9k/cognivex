import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

// GET /api/admin/subscribers - Get all subscribers
export async function GET() {
  try {
    await connectDB()
    
    // Get all subscribers from database
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json({ 
      success: true, 
      subscribers: subscribers.map(subscriber => ({
        id: subscriber._id.toString(),
        email: subscriber.email,
        status: subscriber.status || 'active',
        source: subscriber.source || 'website',
        createdAt: subscriber.createdAt.toISOString(),
        updatedAt: subscriber.updatedAt?.toISOString() || subscriber.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers', subscribers: [] },
      { status: 500 }
    )
  }
}

// PUT /api/admin/subscribers - Update subscriber
export async function PUT(request: Request) {
  try {
    await connectDB()
    
    const { id, status, tags } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Subscriber ID is required' },
        { status: 400 }
      )
    }
    
    const updateData: any = {}
    if (status) updateData.status = status
    if (tags !== undefined) updateData.tags = tags
    
    const updatedSubscriber = await Subscriber.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    
    if (!updatedSubscriber) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      subscriber: {
        id: updatedSubscriber._id.toString(),
        email: updatedSubscriber.email,
        status: updatedSubscriber.status,
        source: updatedSubscriber.source,
        tags: updatedSubscriber.tags,
        emailCount: updatedSubscriber.emailCount,
        lastEmailSent: updatedSubscriber.lastEmailSent?.toISOString() || null,
        createdAt: updatedSubscriber.createdAt.toISOString(),
        updatedAt: updatedSubscriber.updatedAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating subscriber:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update subscriber' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/subscribers - Delete subscriber
export async function DELETE(request: Request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Subscriber ID is required' },
        { status: 400 }
      )
    }
    
    const deletedSubscriber = await Subscriber.findByIdAndDelete(id)
    
    if (!deletedSubscriber) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Subscriber deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscriber' },
      { status: 500 }
    )
  }
} 