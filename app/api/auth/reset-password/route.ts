import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // For demo purposes, we'll simulate the password reset process
    // In a real application, you would connect to the database and send an email
    
    // Simulate database check
    const mockUser = email === 'demo@example.com';
    if (!mockUser) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 }
      );
    }

    // Generate reset token (for demo)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // For demo purposes, we'll just return success
    // In production, this would save the token to database and send email
    return NextResponse.json({
      message: 'Password reset email sent (demo mode)',
      resetToken: resetToken // In production, this wouldn't be returned
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // For demo purposes, we'll simulate the password reset
    // In a real application, you would validate the token against the database
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Simulate password update
    return NextResponse.json({
      message: 'Password has been reset successfully (demo mode)',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 