import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminUser from '@/models/AdminUser'
import WorkerUser from '@/models/WorkerUser'

// Allow GET requests for easier browser access
export async function GET() {
  return await setupUsers()
}

export async function POST() {
  return await setupUsers()
}

async function setupUsers() {
  try {
    await connectDB()

    // Check if admin users already exist
    const existingAdmin = await AdminUser.countDocuments()
    const existingWorker = await WorkerUser.countDocuments()

    const results = {
      adminUsers: [] as any[],
      workerUsers: [] as any[],
      message: ''
    }

    // Create default admin user if none exist
    if (existingAdmin === 0) {
      const defaultAdmin = new AdminUser({
        username: '123',
        email: 'admin@cognivex.com',
        password: '123456', // This will be hashed automatically
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
        createdBy: 'system'
      })

      await defaultAdmin.save()
      results.adminUsers.push({
        username: defaultAdmin.username,
        email: defaultAdmin.email,
        role: defaultAdmin.role
      })
    }

    // Create default worker user if none exist
    if (existingWorker === 0) {
      const defaultWorker = new WorkerUser({
        username: 'worker',
        email: 'worker@cognivex.com',
        password: 'worker123', // This will be hashed automatically
        role: 'worker',
        status: 'active',
        permissions: [
          'quotes_view',
          'quotes_process',
          'reports_view',
          'analytics_view'
        ],
        department: 'general',
        employeeId: 'W001',
        createdBy: 'system'
      })

      await defaultWorker.save()
      results.workerUsers.push({
        username: defaultWorker.username,
        email: defaultWorker.email,
        role: defaultWorker.role,
        department: defaultWorker.department
      })
    }

    if (existingAdmin > 0 && existingWorker > 0) {
      results.message = 'Default users already exist'
    } else {
      results.message = 'Default users created successfully'
    }

    return NextResponse.json({
      success: true,
      ...results,
      stats: {
        totalAdminUsers: await AdminUser.countDocuments(),
        totalWorkerUsers: await WorkerUser.countDocuments()
      }
    })

  } catch (error) {
    console.error('Setup users error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to setup users'
    }, { status: 500 })
  }
} 