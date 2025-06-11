import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET() {
  try {
    // Dynamic imports
    const { connectDB } = await import('@/lib/mongodb')
    const AdminUser = (await import('@/models/AdminUser')).default

    await connectDB()
    
    // Get all admin users (without passwords)
    const adminUsers = await AdminUser.find({}, {
      username: 1,
      email: 1,
      role: 1,
      status: 1,
      createdAt: 1,
      lastLogin: 1,
      loginCount: 1
    }).sort({ createdAt: 1 })

    return NextResponse.json({
      success: true,
      adminCount: adminUsers.length,
      adminUsers: adminUsers
    })

  } catch (error) {
    console.error('Check users error:', error)
    return NextResponse.json({
      error: 'Failed to check admin users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Dynamic imports
    const { connectDB } = await import('@/lib/mongodb')
    const AdminUser = (await import('@/models/AdminUser')).default

    await connectDB()
    
    // Delete all admin users (for fresh setup)
    const result = await AdminUser.deleteMany({})

    return NextResponse.json({
      success: true,
      message: 'All admin users deleted',
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.error('Delete users error:', error)
    return NextResponse.json({
      error: 'Failed to delete admin users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 