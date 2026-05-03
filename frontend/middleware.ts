import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log("MIDDLEWARE HIT:", request.nextUrl.pathname);

  const token = request.cookies.get('token')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/onboarding/:path*'],
};

