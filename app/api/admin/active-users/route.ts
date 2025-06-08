import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Login from '@/models/Login'

export async function GET() {
  try {
    await connectDB()
    
    // Get users active in the last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    
    const activeUsers = await Login.find({
      lastLogin: { $gte: thirtyMinutesAgo },
      success: true
    })
    .sort({ lastLogin: -1 })
    .lean()

    // Calculate session duration for each user
    const usersWithDuration = activeUsers.map(user => ({
      ...user,
      sessionDuration: Math.floor((Date.now() - new Date(user.lastLogin).getTime()) / (1000 * 60))
    }))

    return NextResponse.json(usersWithDuration)
  } catch (error) {
    console.error('Error fetching active users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active users' },
      { status: 500 }
    )
  }
} 