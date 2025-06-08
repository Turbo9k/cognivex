import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Login from '@/models/Login'

export async function GET() {
  try {
    await connectDB()
    const logins = await Login.find({})
      .sort({ lastLogin: -1 })
      .limit(100) // Limit to last 100 logins for performance

    return NextResponse.json(logins)
  } catch (error) {
    console.error('Error fetching logins:', error)
    return NextResponse.json(
      { error: 'Failed to fetch login history' },
      { status: 500 }
    )
  }
} 