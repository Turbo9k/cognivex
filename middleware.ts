import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// JWT payload decoder for Edge Runtime
function decodeJWTPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/login',
    '/admin/login', 
    '/worker/login',
    '/api/auth',
    '/api/admin/login',
    '/api/auth/worker-login',
    '/api/auth/logout',
    '/api/auth/check-worker',
    '/_next',
    '/favicon.ico'
  ];

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Debug worker paths
  if (pathname.startsWith('/worker')) {
    console.log(`Worker path access: ${pathname}, Token exists: ${!!token}`);
    if (token) {
      const payload = decodeJWTPayload(token);
      console.log('Token payload:', payload);
    }
  }
  
  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists, verify it and get user info
  if (token) {
    const payload = decodeJWTPayload(token);
    
    if (!payload) {
      // Invalid token, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Route analysis
    const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login';
    const isWorkerPath = pathname.startsWith('/worker') && pathname !== '/worker/login';
    const isDashboardPath = pathname === '/dashboard';
    const isAdmin = payload.role === 'admin';
    const isWorker = payload.role === 'worker';
    const isAuthenticated = payload.isAuthenticated;

    // Admin access control (but allow access to admin login page)
    if (isAdminPath && !isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Worker access control (but allow access to worker login page)
    if (isWorkerPath && !isWorker) {
      console.log(`Worker access denied. isWorker: ${isWorker}, role: ${payload.role}`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Dashboard access control
    if (isDashboardPath && !isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 