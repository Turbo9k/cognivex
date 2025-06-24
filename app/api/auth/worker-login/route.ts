import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import WorkerUser from '@/models/WorkerUser'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    // Get the raw body text first
    const body = await request.text();
    console.log('Raw request body:', body);
    
    // Parse JSON manually with better error handling
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Body that failed to parse:', body);
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { username, password } = parsedBody;
    console.log('Parsed credentials:', { username, password: password ? '***' : undefined });

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB()

    // Find worker user by username
    const workerUser = await WorkerUser.findOne({ username: username.trim() })
    
    if (!workerUser) {
      console.log('Worker user not found:', username)
      
      // Track failed login attempt
      try {
        await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/auth/track-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: username,
            success: false,
            accountType: 'worker'
          })
        })
      } catch (trackError) {
        console.error('Failed to track login:', trackError)
      }
      
      return NextResponse.json(
        { error: 'Invalid worker credentials' },
        { status: 401 }
      )
    }

    // Check if account is active
    if (workerUser.status !== 'active') {
      console.log('Worker account not active:', workerUser.status)
      
      // Track failed login attempt
      try {
        await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/auth/track-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: workerUser.email || username,
            success: false,
            accountType: 'worker'
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
    const isPasswordValid = await workerUser.comparePassword(password)
    
    if (!isPasswordValid) {
      console.log('Invalid password for worker user:', username)
      
      // Track failed login attempt
      try {
        await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/auth/track-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: workerUser.email || username,
            success: false,
            accountType: 'worker'
          })
        })
      } catch (trackError) {
        console.error('Failed to track login:', trackError)
      }
      
      return NextResponse.json(
        { error: 'Invalid worker credentials' },
        { status: 401 }
      )
    }

    // Update login info
    await workerUser.updateLoginInfo()

    // Track successful login
    try {
      await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/auth/track-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: workerUser.email || username,
          success: true,
          accountType: 'worker'
        })
      })
    } catch (trackError) {
      console.error('Failed to track login:', trackError)
    }

    console.log('Worker credentials validated successfully for:', workerUser.username);
    
    // Clear any existing token first
    cookies().delete('token');

    // Create a JWT token with consistent structure
    const payload = {
      userId: workerUser._id.toString(),
      username: workerUser.username,
      role: workerUser.role,
      email: workerUser.email,
      permissions: workerUser.permissions,
      department: workerUser.department,
      isWorker: true,
      isAuthenticated: true
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
    console.log('Worker JWT token created');

    // Set the token in the same cookie as admin for consistency
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    }

    cookies().set('token', token, cookieOptions)
    console.log('Worker token cookie set');

    return NextResponse.json({ 
      success: true,
      message: 'Worker login successful',
      user: {
        id: workerUser._id.toString(),
        username: workerUser.username,
        role: workerUser.role,
        email: workerUser.email,
        permissions: workerUser.permissions,
        department: workerUser.department
      }
    })
  } catch (error) {
    console.error('Worker login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 