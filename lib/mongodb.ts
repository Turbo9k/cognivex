import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

let isConnected = false
let connectionPromise: Promise<void> | null = null

export async function connectDB() {
  if (isConnected) {
    return
  }

  // If no MongoDB URI is provided, skip connection (for deployment without database)
  if (!MONGODB_URI) {
    console.log('No MongoDB URI provided, skipping database connection')
    throw new Error('No MongoDB URI provided')
  }

  // If connection is already in progress, wait for it
  if (connectionPromise) {
    return connectionPromise
  }

  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      // Optimize mongoose connection options
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 3000, // Timeout after 3s instead of 30s
        connectTimeoutMS: 3000,
        socketTimeoutMS: 3000,
        maxPoolSize: 10, // Maintain up to 10 socket connections
      })
      
      // Disable mongoose buffering for faster responses
      mongoose.set('bufferCommands', false)
      
      isConnected = true
      console.log('MongoDB connected successfully')
      resolve()
    } catch (error) {
      console.error('MongoDB connection error:', error)
      isConnected = false
      connectionPromise = null
      
      // Don't throw error during build process
      if (process.env.NODE_ENV === 'production') {
        console.log('Continuing without MongoDB connection in production...')
      }
      reject(error)
    }
  })

  return connectionPromise
} 