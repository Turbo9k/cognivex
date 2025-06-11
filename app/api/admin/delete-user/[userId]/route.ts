import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI!

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    
    const db = client.db('cognivex')
    const collection = db.collection('admin_users')

    // Check if user exists
    const existingUser = await collection.findOne({ _id: new ObjectId(userId) })
    
    if (!existingUser) {
      await client.close()
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete the user
    const result = await collection.deleteOne({ _id: new ObjectId(userId) })
    
    await client.close()

    if (result.deletedCount === 1) {
      return NextResponse.json({
        success: true,
        message: 'User deleted successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to delete user' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 