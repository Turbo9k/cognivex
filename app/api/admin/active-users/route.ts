import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ActiveUser from '@/models/ActiveUser'

// GET /api/admin/active-users - Get all active users
export async function GET() {
  try {
    await connectDB()
    
    // Get all active users from database
    let activeUsers = await ActiveUser.find({}).sort({ lastActivity: -1 })
    
    // If no active users exist, create seed data
    if (activeUsers.length === 0) {
      console.log('No active users found, creating seed data...')
      
      const seedUsers = Array.from({ length: 45 }, (_, i) => ({
        userId: `user_${i + 1}`,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: ['online', 'away', 'idle'][Math.floor(Math.random() * 3)],
        location: ['New York, US', 'London, UK', 'Tokyo, JP', 'Berlin, DE', 'Sydney, AU'][Math.floor(Math.random() * 5)],
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
        device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
        sessionDuration: Math.floor(Math.random() * 480), // 0-8 hours in minutes
        lastActivity: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000), // Last 2 hours
        sessionStart: new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000) // Last 8 hours
      }))
      
      await ActiveUser.insertMany(seedUsers)
      activeUsers = await ActiveUser.find({}).sort({ lastActivity: -1 })
      console.log(`Created ${activeUsers.length} seed active users`)
    }
    
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
        sessionStart: user.sessionStart.toISOString(),
        createdAt: user.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching active users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch active users' },
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