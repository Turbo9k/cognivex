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
    '/api/worker/login',
    '/_next',
    '/favicon.ico'
  ];

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  
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
    const isAdminPath = pathname.startsWith('/admin');
    const isWorkerPath = pathname.startsWith('/worker');
    const isDashboardPath = pathname === '/dashboard';
    const isAdmin = payload.role === 'admin';
    const isWorker = payload.role === 'worker';
    const isAuthenticated = payload.isAuthenticated;

    // Admin access control
    if (isAdminPath && !isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Worker access control  
    if (isWorkerPath && !isWorker) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Dashboard access control
    if (isDashboardPath && !isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect authenticated users from login pages
    if (isAuthenticated && (pathname === '/login' || pathname === '/admin/login' || pathname === '/worker/login')) {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if (isWorker) {
        return NextResponse.redirect(new URL('/worker/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 