import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    // Basic validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // For demo purposes, we'll simulate user registration
    // In a real application, you would save to database
    
    // Simulate checking if user already exists
    if (email === 'existing@example.com') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password (for demo, we'll still hash it properly)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simulate successful registration
    return NextResponse.json(
      { 
        message: 'User registered successfully (demo mode)',
        user: {
          email,
          username,
          id: `user_${Date.now()}`
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 