import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/your_database_name'

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(MONGODB_URI)
    isConnected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    isConnected = false
    
    // Don't throw error, just log it to allow the app to continue without database
    // This is helpful for development when MongoDB might not be set up
    console.log('Continuing without MongoDB connection...')
  }
} 