import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    if (payload.role === 'worker' && payload.isWorker && payload.isAuthenticated) {
      return NextResponse.json({ 
        authenticated: true,
        user: {
          username: payload.username,
          role: payload.role
        }
      });
    }
    
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
} 