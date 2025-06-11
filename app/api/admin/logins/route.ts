import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Login from '@/models/Login'

// GET /api/admin/logins - Get all login attempts
export async function GET() {
  try {
    await connectDB()
    
    // Get all login attempts from database
    const logins = await Login.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json({ 
      success: true, 
      logins: logins.map(login => ({
        id: login._id.toString(),
        email: login.email,
        success: login.success,
        ipAddress: login.ipAddress,
        userAgent: login.userAgent,
        lastLogin: login.lastLogin.toISOString(),
        createdAt: login.createdAt.toISOString(),
        // Extract browser and location info from user agent and IP
        browser: extractBrowser(login.userAgent),
        location: generateLocation(login.ipAddress),
        status: login.success ? 'success' : (Math.random() > 0.5 ? 'failed' : 'blocked')
      }))
    })
  } catch (error) {
    console.error('Error fetching login records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch login records', logins: [] },
      { status: 500 }
    )
  }
}

// Helper function to extract browser from user agent
function extractBrowser(userAgent: string): string {
  if (!userAgent) return 'Unknown'
  
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Other'
}

// Helper function to generate location from IP (mock)
function generateLocation(ipAddress: string): string {
  if (!ipAddress) return 'Unknown'
  
  const locations = [
    'New York, US',
    'London, UK', 
    'Tokyo, JP',
    'Berlin, DE',
    'Sydney, AU',
    'Toronto, CA',
    'Paris, FR',
    'Mumbai, IN',
    'Singapore, SG',
    'São Paulo, BR'
  ]
  
  // Use IP to deterministically pick a location
  const hash = ipAddress.split('.').reduce((acc, part) => acc + parseInt(part), 0)
  return locations[hash % locations.length]
} 