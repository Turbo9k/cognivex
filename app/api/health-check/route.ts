import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const envCheck = {
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      mongodb_uri_length: process.env.MONGODB_URI?.length || 0,
      mongodb_uri_starts_correctly: process.env.MONGODB_URI?.startsWith('mongodb') || false,
      jwt_secret_exists: !!process.env.JWT_SECRET,
      jwt_secret_length: process.env.JWT_SECRET?.length || 0,
      node_env: process.env.NODE_ENV,
      vercel_env: process.env.VERCEL_ENV,
      vercel_url: process.env.VERCEL_URL,
    }

    // Test MongoDB connection if URI exists
    let mongoTest = null
    if (process.env.MONGODB_URI) {
      try {
        const mongoose = await import('mongoose')
        
        // Check if already connected
        if (mongoose.default.connection.readyState === 1) {
          mongoTest = {
            status: 'already_connected',
            database: mongoose.default.connection.name,
            host: mongoose.default.connection.host,
          }
        } else {
          // Try to connect with short timeout
          await mongoose.default.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
          })
          
          mongoTest = {
            status: 'connection_successful',
            database: mongoose.default.connection.name,
            host: mongoose.default.connection.host,
          }
          
          // Disconnect after test
          await mongoose.default.disconnect()
        }
      } catch (mongoError: any) {
        mongoTest = {
          status: 'connection_failed',
          error: mongoError.message,
          error_code: mongoError.code,
          error_name: mongoError.name,
        }
      }
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      mongodb_test: mongoTest,
      recommendations: getRecommendations(envCheck, mongoTest),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

function getRecommendations(envCheck: any, mongoTest: any): string[] {
  const recommendations: string[] = []

  if (!envCheck.mongodb_uri_exists) {
    recommendations.push('❌ MONGODB_URI is not set in Vercel environment variables')
  }

  if (!envCheck.jwt_secret_exists) {
    recommendations.push('❌ JWT_SECRET is not set in Vercel environment variables')
  }

  if (envCheck.mongodb_uri_exists && !envCheck.mongodb_uri_starts_correctly) {
    recommendations.push('⚠️ MONGODB_URI does not start with "mongodb" - check the format')
  }

  if (mongoTest?.status === 'connection_failed') {
    if (mongoTest.error_code === 'ENOTFOUND' || mongoTest.error?.includes('ENOTFOUND')) {
      recommendations.push('❌ Cannot resolve MongoDB hostname - check your connection string')
    } else if (mongoTest.error_code === 'EAUTH' || mongoTest.error?.includes('authentication')) {
      recommendations.push('❌ MongoDB authentication failed - check username/password in connection string')
    } else if (mongoTest.error?.includes('IP')) {
      recommendations.push('❌ IP address not whitelisted - add 0.0.0.0/0 to MongoDB Atlas Network Access')
    } else if (mongoTest.error?.includes('timeout')) {
      recommendations.push('⚠️ Connection timeout - check MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)')
    } else {
      recommendations.push(`❌ MongoDB connection failed: ${mongoTest.error}`)
    }
  }

  if (mongoTest?.status === 'connection_successful') {
    recommendations.push('✅ MongoDB connection is working correctly!')
  }

  if (envCheck.mongodb_uri_exists && envCheck.jwt_secret_exists && mongoTest?.status === 'connection_successful') {
    recommendations.push('✅ All environment variables are configured correctly!')
  }

  return recommendations
}

