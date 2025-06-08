import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Login from '@/models/Login'

// GET /api/admin/logins - Get all login attempts
export async function GET() {
  try {
    await connectDB()
    
    // Get all login attempts from database
    let logins = await Login.find({}).sort({ createdAt: -1 })
    
    // If no logins exist, create seed data
    if (logins.length === 0) {
      console.log('No login records found, creating seed data...')
      
      const seedLogins = Array.from({ length: 1230 }, (_, i) => ({
        email: `user${Math.floor(Math.random() * 100) + 1}@example.com`,
        success: Math.random() > 0.15, // 85% success rate
        ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: [
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
        ][Math.floor(Math.random() * 4)],
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }))
      
      await Login.insertMany(seedLogins)
      logins = await Login.find({}).sort({ createdAt: -1 })
      console.log(`Created ${logins.length} seed login records`)
    }
    
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
      { success: false, error: 'Failed to fetch login records' },
      { status: 500 }
    )
  }
}

// Helper function to extract browser from user agent
function extractBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Unknown'
}

// Helper function to generate location from IP (mock)
function generateLocation(ipAddress: string): string {
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