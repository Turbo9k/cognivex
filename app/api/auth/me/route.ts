import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { 
      userId: string; 
      username?: string; 
      role?: string; 
      email?: string; 
    };

    // For demo purposes, return user data based on token
    if (decoded.userId === 'admin' && decoded.role === 'admin') {
      return NextResponse.json({
        id: 'admin',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      });
    }

    if (decoded.userId === 'worker' && decoded.role === 'worker') {
      return NextResponse.json({
        id: 'worker',
        username: 'worker',
        email: 'worker@example.com',
        role: 'worker'
      });
    }

    // For regular users, return mock data
    return NextResponse.json({
      id: decoded.userId,
      username: decoded.username || 'user',
      email: decoded.email || 'user@example.com',
      role: decoded.role || 'user'
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 