import { NextResponse } from 'next/server'

export async function GET() {
  const steps = []
  
  try {
    steps.push('Step 1: Route started')
    
    // Step 2: Check environment variable
    steps.push('Step 2: Checking env vars')
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        error: 'MongoDB URI not found',
        steps,
        mongodb_uri_exists: false
      })
    }
    steps.push('Step 3: MongoDB URI exists')
    
    // Step 4: Try importing connectDB
    steps.push('Step 4: Importing connectDB')
    const { connectDB } = await import('@/lib/mongodb')
    steps.push('Step 5: connectDB imported successfully')
    
    // Step 5: Try connecting to MongoDB
    steps.push('Step 6: Attempting MongoDB connection')
    await connectDB()
    steps.push('Step 7: MongoDB connected successfully')
    
    // Step 6: Try importing AdminUser model
    steps.push('Step 8: Importing AdminUser model')
    const AdminUser = (await import('@/models/AdminUser')).default
    steps.push('Step 9: AdminUser model imported successfully')
    
    // Step 7: Try counting documents
    steps.push('Step 10: Attempting to count AdminUser documents')
    const count = await AdminUser.countDocuments()
    steps.push(`Step 11: Count successful - ${count} admin users found`)
    
    return NextResponse.json({
      success: true,
      steps,
      adminCount: count,
      setupRequired: count === 0
    })
    
  } catch (error) {
    steps.push(`Error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`)
    
    return NextResponse.json({
      error: 'Debug failed',
      steps,
      errorDetails: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 