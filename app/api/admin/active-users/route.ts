import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return mock active users data for demo
    const mockActiveUsers = Array.from({ length: 45 }, (_, i) => ({
      _id: `user_${i + 1}`,
      email: `user${i + 1}@example.com`,
      username: `user${i + 1}`,
      status: ['online', 'away', 'idle'][Math.floor(Math.random() * 3)],
      lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      sessionDuration: Math.floor(Math.random() * 120) + 10, // 10-130 minutes
      ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      location: ['New York, US', 'London, UK', 'Tokyo, JP', 'Berlin, DE', 'Sydney, AU'][Math.floor(Math.random() * 5)],
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
      device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)]
    }));

    return NextResponse.json(mockActiveUsers)
  } catch (error) {
    console.error('Error fetching active users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active users' },
      { status: 500 }
    )
  }
} 