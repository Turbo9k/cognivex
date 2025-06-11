import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ActiveUser from '@/models/ActiveUser'

// GET /api/admin/active-users - Get all active users
export async function GET() {
  try {
    await connectDB()
    
    // Get all active users from database
    const activeUsers = await ActiveUser.find({}).sort({ lastActivity: -1 })
    
    return NextResponse.json({ 
      success: true, 
      activeUsers: activeUsers.map(user => ({
        id: user._id.toString(),
        userId: user.userId,
        username: user.username,
        email: user.email,
        status: user.status,
        location: user.location,
        ipAddress: user.ipAddress,
        browser: user.browser,
        device: user.device,
        sessionDuration: user.sessionDuration,
        lastActivity: user.lastActivity.toISOString(),
        sessionStart: user.sessionStart.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching active users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch active users', activeUsers: [] },
      { status: 500 }
    )
  }
}

// PUT /api/admin/active-users - Update active user status
export async function PUT(request: Request) {
  try {
    await connectDB()
    
    const { id, status } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'User ID and status are required' },
        { status: 400 }
      )
    }
    
    if (!['online', 'away', 'idle'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }
    
    const updatedUser = await ActiveUser.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        userId: updatedUser.userId,
        username: updatedUser.username,
        email: updatedUser.email,
        status: updatedUser.status,
        location: updatedUser.location,
        ipAddress: updatedUser.ipAddress,
        browser: updatedUser.browser,
        device: updatedUser.device,
        sessionDuration: updatedUser.sessionDuration,
        lastActivity: updatedUser.lastActivity.toISOString(),
        sessionStart: updatedUser.sessionStart.toISOString(),
        createdAt: updatedUser.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating active user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
} 