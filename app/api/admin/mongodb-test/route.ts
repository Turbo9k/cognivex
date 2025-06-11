import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function GET() {
  const diagnostics = {
    mongodb_uri_exists: !!process.env.MONGODB_URI,
    mongodb_uri_masked: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@') : 'Not set',
    mongoose_version: mongoose.version,
    current_state: mongoose.connection.readyState,
    connection_states: {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    }
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({
      error: 'MongoDB URI not configured',
      diagnostics
    })
  }

  try {
    // If already connected, disconnect first for clean test
    if (mongoose.connection.readyState !== 0) {
      console.log('Disconnecting existing connection...')
      await mongoose.disconnect()
    }

    console.log('Testing MongoDB connection with URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'))
    
    // Try to connect with detailed options
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Longer timeout for debugging
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    })

    // Test a simple operation
    const db = mongoose.connection.db
    if (!db) {
      throw new Error('Database connection not available')
    }
    const adminDb = db.admin()
    const serverStatus = await adminDb.serverStatus()

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      diagnostics,
      connection_info: {
        database_name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        ready_state: mongoose.connection.readyState,
        mongodb_version: serverStatus.version
      }
    })

  } catch (error) {
    console.error('MongoDB connection error:', error)
    
    return NextResponse.json({
      error: 'MongoDB connection failed',
      diagnostics,
      error_details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : undefined,
        code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
  }
} 