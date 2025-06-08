import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/forgot-password' || path === '/reset-password' || path === '/admin/login' || path === '/worker/login';

  // Get the tokens from the cookies
  const token = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('session_token')?.value;
  const workerToken = request.cookies.get('worker_token')?.value;

  // Redirect logic
  if (isPublicPath && (token || adminToken || workerToken)) {
    // If the user is logged in and tries to access a public path, redirect to appropriate dashboard
    if (path === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (path === '/worker/login') {
      return NextResponse.redirect(new URL('/worker/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check if the path is an admin route
  const isAdminPath = path.startsWith('/admin') && path !== '/admin/login';
  const isWorkerPath = path.startsWith('/worker') && path !== '/worker/login';

  if (isAdminPath && !adminToken) {
    // If no admin token, redirect to admin login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isWorkerPath && !workerToken) {
    // If no worker token, redirect to worker login
    return NextResponse.redirect(new URL('/worker/login', request.url));
  }

  if (!isPublicPath && !token && !adminToken && !workerToken) {
    // If the user is not logged in and tries to access a protected path, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
}; 