import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Login from '@/models/Login'

export async function POST(request: Request) {
  try {
    const { email, success } = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await connectDB()

    const login = await Login.create({
      email,
      ipAddress,
      userAgent,
      success,
      lastLogin: new Date(),
    })

    return NextResponse.json({ success: true, login })
  } catch (error) {
    console.error('Error tracking login:', error)
    return NextResponse.json(
      { error: 'Failed to track login' },
      { status: 500 }
    )
  }
} 