import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import AdminUser from '@/models/AdminUser'
import WorkerUser from '@/models/WorkerUser'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify super admin authentication
async function verifySupperAdmin(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return { error: 'Authentication required', status: 401 }
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (decoded.role !== 'super_admin') {
      return { error: 'Super admin access required', status: 403 }
    }

    return { user: decoded }
  } catch (error) {
    return { error: 'Invalid token', status: 401 }
  }
}

// GET - List all users (admins and workers)
export async function GET() {
  try {
    const auth = await verifySupperAdmin(new Request('http://localhost'))
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    await connectDB()

    const [adminUsers, workerUsers] = await Promise.all([
      AdminUser.find({}).select('-password').sort({ createdAt: -1 }),
      WorkerUser.find({}).select('-password').sort({ createdAt: -1 })
    ])

    return NextResponse.json({
      success: true,
      adminUsers: adminUsers.map(user => ({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
        lastLogin: user.lastLogin?.toISOString() || null,
        loginCount: user.loginCount,
        createdAt: user.createdAt.toISOString(),
        createdBy: user.createdBy
      })),
      workerUsers: workerUsers.map(user => ({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
        department: user.department,
        employeeId: user.employeeId,
        lastLogin: user.lastLogin?.toISOString() || null,
        loginCount: user.loginCount,
        createdAt: user.createdAt.toISOString(),
        createdBy: user.createdBy
      }))
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}

// POST - Create new admin or worker user
export async function POST(request: Request) {
  try {
    const auth = await verifySupperAdmin(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const { 
      userType, // 'admin' or 'worker'
      username, 
      email, 
      password, 
      role, 
      permissions, 
      department, 
      employeeId 
    } = body

    // Validation
    if (!userType || !username || !email || !password) {
      return NextResponse.json({
        error: 'User type, username, email, and password are required'
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({
        error: 'Password must be at least 6 characters'
      }, { status: 400 })
    }

    await connectDB()

    // Check for existing users
    const [existingAdmin, existingWorker] = await Promise.all([
      AdminUser.findOne({ $or: [{ username }, { email }] }),
      WorkerUser.findOne({ $or: [{ username }, { email }] })
    ])

    if (existingAdmin || existingWorker) {
      return NextResponse.json({
        error: 'Username or email already exists'
      }, { status: 409 })
    }

    let newUser
    let savedUser

    if (userType === 'admin') {
      newUser = new AdminUser({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password, // Will be hashed automatically by the model
        role: role || 'admin',
        status: 'active',
        permissions: permissions || [
          'dashboard_view',
          'subscribers_view',
          'quotes_view'
        ],
        createdBy: auth.user.username
      })

      savedUser = await newUser.save()

      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully',
        user: {
          id: savedUser._id.toString(),
          username: savedUser.username,
          email: savedUser.email,
          role: savedUser.role,
          status: savedUser.status,
          permissions: savedUser.permissions,
          userType: 'admin'
        }
      })

    } else if (userType === 'worker') {
      newUser = new WorkerUser({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password, // Will be hashed automatically by the model
        role: role || 'worker',
        status: 'active',
        permissions: permissions || [
          'quotes_view',
          'quotes_process'
        ],
        department: department || 'general',
        employeeId: employeeId || null,
        createdBy: auth.user.username
      })

      savedUser = await newUser.save()

      return NextResponse.json({
        success: true,
        message: 'Worker user created successfully',
        user: {
          id: savedUser._id.toString(),
          username: savedUser.username,
          email: savedUser.email,
          role: savedUser.role,
          status: savedUser.status,
          permissions: savedUser.permissions,
          department: savedUser.department,
          employeeId: savedUser.employeeId,
          userType: 'worker'
        }
      })

    } else {
      return NextResponse.json({
        error: 'Invalid user type. Must be "admin" or "worker"'
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Error creating user:', error)
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({
        error: 'Username or email already exists'
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create user'
    }, { status: 500 })
  }
}

// PUT - Update user status or permissions
export async function PUT(request: Request) {
  try {
    const auth = await verifySupperAdmin(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const { userId, userType, status, permissions, role } = body

    if (!userId || !userType) {
      return NextResponse.json({
        error: 'User ID and user type are required'
      }, { status: 400 })
    }

    await connectDB()

    const updateData: any = {}
    if (status) updateData.status = status
    if (permissions) updateData.permissions = permissions
    if (role) updateData.role = role
    updateData.updatedAt = new Date()

    let updatedUser

    if (userType === 'admin') {
      updatedUser = await AdminUser.findByIdAndUpdate(userId, updateData, { new: true }).select('-password')
    } else if (userType === 'worker') {
      updatedUser = await WorkerUser.findByIdAndUpdate(userId, updateData, { new: true }).select('-password')
    } else {
      return NextResponse.json({
        error: 'Invalid user type'
      }, { status: 400 })
    }

    if (!updatedUser) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update user'
    }, { status: 500 })
  }
}

// DELETE - Delete user
export async function DELETE(request: Request) {
  try {
    const auth = await verifySupperAdmin(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userType = searchParams.get('userType')

    if (!userId || !userType) {
      return NextResponse.json({
        error: 'User ID and user type are required'
      }, { status: 400 })
    }

    await connectDB()

    let deletedUser

    if (userType === 'admin') {
      deletedUser = await AdminUser.findByIdAndDelete(userId)
    } else if (userType === 'worker') {
      deletedUser = await WorkerUser.findByIdAndDelete(userId)
    } else {
      return NextResponse.json({
        error: 'Invalid user type'
      }, { status: 400 })
    }

    if (!deletedUser) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user'
    }, { status: 500 })
  }
} 