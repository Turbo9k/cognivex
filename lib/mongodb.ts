import mongoose from 'mongoose'

// Use environment variable only - no fallback for security
const MONGODB_URI = process.env.MONGODB_URI

let isConnected = false

export async function connectDB() {
  // If already connected, return early
  if (isConnected && mongoose.connection.readyState === 1) {
    return
  }

  // If no MongoDB URI is provided, throw error
  if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set')
    throw new Error('Database configuration error')
  }

  try {
    // Disconnect if there's an existing connection in a bad state
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }

    console.log('🔄 Attempting MongoDB connection...')
    // Don't log connection string for security

    // Connect to MongoDB with optimized options
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    })
    
    isConnected = true
    console.log('✅ MongoDB connected successfully')
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    isConnected = false
    
    // Provide more specific error information
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      if (error.message.includes('authentication failed')) {
        throw new Error('Database authentication failed - check username/password')
      } else if (error.message.includes('ENOTFOUND')) {
        throw new Error('Database server not found')
      } else if (error.message.includes('timeout')) {
        throw new Error('Database connection timeout')
      }
    }
    
    throw new Error('Database connection failed')
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB')
  isConnected = true
})

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err)
  isConnected = false
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB')
  isConnected = false
}) 