import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const { id } = params

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status (approved/rejected) is required' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll simulate updating the quote status
    // In a real application, you would update the database
    
    return NextResponse.json({
      message: `Quote ${id} status updated to ${status} (demo mode)`,
      quote: {
        id,
        status,
        updatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { error: 'Failed to update quote status' },
      { status: 500 }
    )
  }
} 