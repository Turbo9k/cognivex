import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { username, email, password, role } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['admin', 'worker']
    const userRole = role && validRoles.includes(role) ? role : 'worker'

    if (username.length < 3 || password.length < 6) {
      return NextResponse.json(
        { error: 'Username must be 3+ chars, password 6+ chars' },
        { status: 400 }
      )
    }

    // Dynamic imports
    const { connectDB } = await import('@/lib/mongodb')
    const AdminUser = (await import('@/models/AdminUser')).default

    await connectDB()

    // Check if this specific username or email already exists
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

    // Define permissions based on role
    const permissions = userRole === 'admin' ? [
      'dashboard_view',
      'subscribers_view', 
      'subscribers_manage',
      'quotes_view',
      'quotes_manage',
      'users_view',
      'users_manage',
      'settings_manage'
    ] : [
      'quotes_view',
      'quotes_manage'
    ]

    // Create the user (admin or worker)
    const adminUser = new AdminUser({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: userRole === 'admin' ? 'super_admin' : 'worker',
      status: 'active',
      permissions: permissions,
      createdBy: 'admin-dashboard'
    })

    await adminUser.save()

    return NextResponse.json({ 
      message: `${userRole === 'admin' ? 'Admin' : 'Worker'} user created successfully`,
      user: {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    })

  } catch (error) {
    console.error('Create user error:', error)
    
    // Handle MongoDB duplicate key errors
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

// Create the specific user you requested
export async function GET() {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/admin/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test',
        email: 'test@cognivex.com',
        password: 'testtest'
      })
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    // Fallback: create directly
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    try {
      const { connectDB } = await import('@/lib/mongodb')
      const AdminUser = (await import('@/models/AdminUser')).default

      await connectDB()

      // Check if test user already exists
      const existingUser = await AdminUser.findOne({ username: 'test' })
      if (existingUser) {
        return NextResponse.json({
          message: 'Test user already exists',
          user: {
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role
          }
        })
      }

      // Create test user
      const adminUser = new AdminUser({
        username: 'test',
        email: 'test@cognivex.com',
        password: 'testtest',
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
        createdBy: 'auto-create'
      })

      await adminUser.save()

      return NextResponse.json({ 
        message: 'Test admin user created successfully',
        user: {
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role
        }
      })

    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to create test user', details: error instanceof Error ? error.message : 'Unknown' },
        { status: 500 }
      )
    }
  }
} 