import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        setupRequired: true,
        adminCount: 0,
        warning: 'Database not configured',
        mongodb_uri_exists: false
      })
    }

    // Don't connect to database for now, just return test data
    return NextResponse.json({
      setupRequired: true,
      adminCount: 0,
      mongodb_uri_exists: true,
      message: 'Setup test working - MongoDB URI is configured'
    })
  } catch (error) {
    console.error('Admin setup test error:', error)
    return NextResponse.json({
      setupRequired: true,
      adminCount: 0,
      error: 'Setup test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'POST endpoint working',
    mongodb_uri_exists: !!process.env.MONGODB_URI
  })
} 