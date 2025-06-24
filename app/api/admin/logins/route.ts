import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Login from '@/models/Login'
import { getLocationFromIP } from '@/lib/utils'

// GET /api/admin/logins - Get all login attempts
export async function GET() {
  try {
    await connectDB()
    
    // Get all logins, sorted by most recent first
    const logins = await Login.find({})
      .sort({ lastLogin: -1 })
      .limit(1000) // Limit to prevent performance issues

    // Transform the data to match the frontend interface
    const transformedLogins = logins.map(login => ({
      _id: login._id.toString(),
      email: login.email,
      loginTime: login.lastLogin.toISOString(),
      ipAddress: login.ipAddress,
      userAgent: login.userAgent,
      location: getLocationFromIP(login.ipAddress),
      status: login.success ? 'success' : 'failed',
      method: 'password',
      deviceType: getDeviceType(login.userAgent),
      browser: getBrowser(login.userAgent),
      accountType: login.accountType || 'user'
    }))

    return NextResponse.json({ logins: transformedLogins })
  } catch (error) {
    console.error('Error fetching logins:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logins' },
      { status: 500 }
    )
  }
}

function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase()
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile'
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet'
  }
  return 'desktop'
}

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('chrome')) return 'Chrome'
  if (ua.includes('firefox')) return 'Firefox'
  if (ua.includes('safari')) return 'Safari'
  if (ua.includes('edge')) return 'Edge'
  if (ua.includes('opera')) return 'Opera'
  return 'Unknown'
} 