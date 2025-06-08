import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cognivex'

let isConnected = false
let connectionPromise: Promise<void> | null = null

export async function connectDB() {
  if (isConnected) {
    return
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
      
      // Don't throw error, just log it to allow the app to continue without database
      console.log('Continuing without MongoDB connection...')
      reject(error)
    }
  })

  return connectionPromise
} 