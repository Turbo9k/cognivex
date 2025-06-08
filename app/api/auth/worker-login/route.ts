import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Simple credential check for worker
    if (username === 'worker' && password === 'worker123') {
      // Create a JWT token with consistent structure
      const token = jwt.sign(
        { 
          userId: 'worker',
          username: 'worker',
          role: 'worker',
          isWorker: true,
          isAuthenticated: true
        },
        JWT_SECRET,
        { expiresIn: '1d' }
      )

      // Set the token in the same cookie as admin for consistency
      cookies().set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
      })

      return NextResponse.json({ 
        success: true,
        message: 'Worker login successful',
        user: {
          username: 'worker',
          role: 'worker'
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid worker credentials' },
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