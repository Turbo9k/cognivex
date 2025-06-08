import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Login from '@/models/Login'

export async function GET() {
  try {
    await connectDB()
    
    // Get the last 100 login attempts, sorted by most recent
    const logs = await Login.find()
      .sort({ lastLogin: -1 })
      .limit(100)
      .lean()

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching credential logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credential logs' },
      { status: 500 }
    )
  }
} 