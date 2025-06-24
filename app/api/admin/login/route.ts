import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import AdminUser from '@/models/AdminUser'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    console.log('Admin login attempt:', { username })

    // Connect to MongoDB
    await connectDB()

    // Find admin user by username
    const adminUser = await AdminUser.findOne({ username: username.trim() })
    
    if (!adminUser) {
      console.log('Admin user not found:', username)
      
      // Track failed login attempt
      try {
        await fetch(`${request.nextUrl.origin}/api/auth/track-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: username,
            success: false,
            accountType: 'admin'
          })
        })
      } catch (trackError) {
        console.error('Failed to track login:', trackError)
      }
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if account is active
    if (adminUser.status !== 'active') {
      console.log('Admin account not active:', adminUser.status)
      
      // Track failed login attempt
      try {
        await fetch(`${request.nextUrl.origin}/api/auth/track-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: adminUser.email || username,
            success: false,
            accountType: 'admin'
          })
        })
      } catch (trackError) {
        console.error('Failed to track login:', trackError)
      }
      
      return NextResponse.json(
        { error: 'Account is inactive or suspended' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await adminUser.comparePassword(password)
    
    if (!isPasswordValid) {
      console.log('Invalid password for admin user:', username)
      
      // Track failed login attempt
      try {
        await fetch(`${request.nextUrl.origin}/api/auth/track-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: adminUser.email || username,
            success: false,
            accountType: 'admin'
          })
        })
      } catch (trackError) {
        console.error('Failed to track login:', trackError)
      }
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update login info
    await adminUser.updateLoginInfo()

    // Track successful login
    try {
      await fetch(`${request.nextUrl.origin}/api/auth/track-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminUser.email || username,
          success: true,
          accountType: 'admin'
        })
      })
    } catch (trackError) {
      console.error('Failed to track login:', trackError)
    }

    // Create JWT token for admin
    const tokenPayload = { 
      userId: adminUser._id.toString(),
      username: adminUser.username,
      role: 'admin', // Standardize to 'admin' for middleware
      originalRole: adminUser.role, // Keep original role
      email: adminUser.email,
      permissions: adminUser.permissions,
      isAuthenticated: true // Required by middleware
    }
    
    console.log('Creating JWT token for admin:', adminUser.username)
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' })

    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: adminUser._id.toString(),
          username: adminUser.username,
          role: adminUser.role,
          email: adminUser.email,
          permissions: adminUser.permissions
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