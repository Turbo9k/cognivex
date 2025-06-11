import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simple test without any dependencies
    return NextResponse.json({
      message: 'Test API is working',
      timestamp: new Date().toISOString(),
      env_check: {
        mongodb_uri_exists: !!process.env.MONGODB_URI,
        jwt_secret_exists: !!process.env.JWT_SECRET
      }
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { error: 'Test API failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 