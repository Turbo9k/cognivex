import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Admin credentials (in production, this should be in a database with hashed passwords)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || '123',
  password: process.env.ADMIN_PASSWORD || '123',
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    console.log('Admin login attempt:', { username })

    // Validate credentials
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      console.log('Invalid credentials provided')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create JWT token for admin
    const tokenPayload = { 
      userId: 'admin', 
      username: username,
      role: 'admin',
      email: 'admin@example.com'
    }
    
    console.log('Creating JWT token with payload:', tokenPayload)
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' })
    
    console.log('JWT token created:', token.substring(0, 20) + '...')

    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: 'admin',
          username: username,
          role: 'admin',
          email: 'admin@example.com'
        }
      },
      { status: 200 }
    )

    // Set the token cookie
    const cookieOptions = {
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    }
    
    console.log('Setting cookie with options:', { ...cookieOptions, value: cookieOptions.value.substring(0, 20) + '...' })
    
    response.cookies.set(cookieOptions)

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 