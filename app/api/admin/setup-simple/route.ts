import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        setupRequired: true,
        adminCount: 0,
        warning: 'Database not configured'
      })
    }

    // Dynamic imports to avoid import-time errors
    const { connectDB } = await import('@/lib/mongodb')
    const AdminUser = (await import('@/models/AdminUser')).default

    await connectDB()
    const adminCount = await AdminUser.countDocuments()
    
    return NextResponse.json({
      setupRequired: adminCount === 0,
      adminCount: adminCount
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({
      setupRequired: true,
      adminCount: 0,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

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

    const existingAdminCount = await AdminUser.countDocuments()
    if (existingAdminCount > 0) {
      return NextResponse.json(
        { error: 'Admin users already exist' },
        { status: 403 }
      )
    }

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

    return NextResponse.json({ 
      message: 'Admin user created successfully',
      user: {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    })

  } catch (error) {
    console.error('Setup POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
} 