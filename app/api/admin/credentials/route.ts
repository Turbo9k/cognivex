import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return mock credentials data for demo
    const mockCredentials = Array.from({ length: 89 }, (_, i) => ({
      _id: `cred_${i + 1}`,
      email: `user${i + 1}@example.com`,
      username: `user${i + 1}`,
      role: ['user', 'moderator', 'admin'][Math.floor(Math.random() * 3)],
      status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)],
      provider: ['local', 'google', 'github', 'microsoft'][Math.floor(Math.random() * 4)],
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ['read', 'write', 'delete'].slice(0, Math.floor(Math.random() * 3) + 1)
    }));

    return NextResponse.json(mockCredentials)
  } catch (error) {
    console.error('Error fetching credentials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credentials' },
      { status: 500 }
    )
  }
} 