import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    // Get the raw body text first
    const body = await request.text();
    console.log('Raw request body:', body);
    
    // Parse JSON manually with better error handling
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Body that failed to parse:', body);
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { username, password } = parsedBody;
    console.log('Parsed credentials:', { username, password: password ? '***' : undefined });

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Simple credential check for worker
    if (username === 'worker' && password === 'worker') {
      console.log('Worker credentials validated successfully');
      
      // Clear any existing token first
      cookies().delete('token');

      // Create a JWT token with consistent structure
      const payload = {
        userId: 'worker',
        username: 'worker',
        role: 'worker',
        isWorker: true,
        isAuthenticated: true
      }

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
      console.log('Worker JWT token created');

      // Set the token in the same cookie as admin for consistency
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
      }

      cookies().set('token', token, cookieOptions)
      console.log('Worker token cookie set');

      return NextResponse.json({ 
        success: true,
        message: 'Worker login successful',
        user: {
          username: 'worker',
          role: 'worker'
        }
      })
    }

    console.log('Invalid worker credentials provided');
    return NextResponse.json(
      { error: 'Invalid worker credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Worker login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 