import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("MIDDLEWARE HIT:", pathname);

  const token = request.cookies.get('token')?.value;

  const isProtectedRoute =
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/Profile') ||
    pathname.startsWith('/Admin');

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/onboarding/:path*',
    '/Profile/:path*',
    '/Admin/:path*'
  ],
};