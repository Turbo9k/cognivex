import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminUser from '@/models/AdminUser'

// GET /api/admin/credentials - Get all admin users/credentials
export async function GET() {
  try {
    await connectDB()
    
    // Get all admin users from database
    const adminUsers = await AdminUser.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json({ 
      success: true, 
      credentials: adminUsers.map(user => ({
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        provider: user.provider || 'local',
        status: user.status,
        loginCount: user.loginCount || 0,
        lastLogin: user.lastLogin?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin users', credentials: [] },
      { status: 500 }
    )
  }
}

// PUT /api/admin/credentials - Update admin user
export async function PUT(request: Request) {
  try {
    await connectDB()
    
    const { id, role, status } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const updateData: any = {}
    if (role) updateData.role = role
    if (status) updateData.status = status
    
    const updatedUser = await AdminUser.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        provider: updatedUser.provider,
        status: updatedUser.status,
        loginCount: updatedUser.loginCount,
        lastLogin: updatedUser.lastLogin?.toISOString() || null,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating admin user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/credentials - Delete admin user
export async function DELETE(request: Request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const deletedUser = await AdminUser.findByIdAndDelete(id)
    
    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting admin user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
} 