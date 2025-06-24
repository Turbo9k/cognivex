import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Login from '@/models/Login'
import { getLocationFromIP } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const { email, success, accountType = 'user' } = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await connectDB()

    const login = await Login.create({
      email,
      ipAddress,
      userAgent,
      success,
      accountType,
      lastLogin: new Date(),
    })

    return NextResponse.json({ 
      success: true, 
      login: {
        ...login.toObject(),
        location: getLocationFromIP(ipAddress)
      }
    })
  } catch (error) {
    console.error('Error tracking login:', error)
    return NextResponse.json(
      { error: 'Failed to track login' },
      { status: 500 }
    )
  }
} 