import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Simple credential check for worker
    if (username === 'worker' && password === 'worker123') {
      // Create a JWT token
      const token = jwt.sign(
        { username, role: 'worker' },
        JWT_SECRET,
        { expiresIn: '1d' }
      )

      // Set the token in a cookie
      cookies().set('worker_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
      })

      return NextResponse.json({ 
        success: true,
        message: 'Login successful'
      })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Worker login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 