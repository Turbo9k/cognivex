import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    await connectDB();

    // Simple credential check for admin
    if (email === '123' && password === '123') {
      // Track successful admin login
      try {
        await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/auth/track-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            success: true,
            accountType: 'admin'
          })
        })
      } catch (trackError) {
        console.error('Failed to track login:', trackError)
      }

      // Create a JWT token
      const token = jwt.sign(
        { email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Set the token in a cookie
      cookies().set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ success: true });
    }

    // Track failed login attempt for regular users
    try {
      await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/auth/track-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          success: false,
          accountType: 'user'
        })
      })
    } catch (trackError) {
      console.error('Failed to track login:', trackError)
    }

    // For now, return error for regular user logins since we don't have a proper user model
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 