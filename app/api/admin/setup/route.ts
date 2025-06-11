import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminUser from '@/models/AdminUser'

export async function POST(request: NextRequest) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not configured')
      return NextResponse.json(
        { error: 'Database not configured. Please set up environment variables.' },
        { status: 500 }
      )
    }

    const { username, email, password } = await request.json()

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate field lengths
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    console.log('POST: Attempting to connect to MongoDB...')
    await connectDB()
    console.log('POST: MongoDB connection successful')

    // Check if any admin users already exist
    console.log('POST: Checking existing admin count...')
    const existingAdminCount = await AdminUser.countDocuments()
    console.log('POST: Existing admin count:', existingAdminCount)
    
    if (existingAdminCount > 0) {
      return NextResponse.json(
        { error: 'Admin users already exist. Use the regular admin panel to create new users.' },
        { status: 403 }
      )
    }

    // Check if username or email already exists
    const existingUser = await AdminUser.findOne({
      $or: [
        { username: username.trim() },
        { email: email.trim().toLowerCase() }
      ]
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      )
    }

    // Create the first admin user
    const adminUser = new AdminUser({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: 'super_admin',
      status: 'active',
      permissions: [
        'dashboard_view',
        'subscribers_view',
        'subscribers_manage',
        'quotes_view',
        'quotes_manage',
        'users_view',
        'users_manage',
        'settings_manage'
      ],
      createdBy: 'setup'
    })

    await adminUser.save()

    return NextResponse.json(
      { 
        message: 'First admin user created successfully',
        user: {
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Admin setup error:', error)
    
    // Handle MongoDB duplicate key errors
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not configured')
      return NextResponse.json({
        setupRequired: true,
        adminCount: 0,
        warning: 'Database not configured'
      })
    }

    console.log('Attempting to connect to MongoDB...')
    await connectDB()
    console.log('MongoDB connection successful')
    
    console.log('Checking admin user count...')
    // Check if any admin users exist
    const adminCount = await AdminUser.countDocuments()
    console.log('Admin count:', adminCount)
    
    return NextResponse.json({
      setupRequired: adminCount === 0,
      adminCount: adminCount
    })
  } catch (error) {
    console.error('Admin setup check error:', error)
    
    // Return detailed error information
    return NextResponse.json({
      setupRequired: true,
      adminCount: 0,
      error: 'Database connection failed',
      errorDetails: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    })
  }
} 