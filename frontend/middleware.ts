import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  console.log("ROLE:", role);
  console.log("PATH:", pathname);

  // Kalau belum login
  if (
    (pathname.startsWith("/Admin") ||
      pathname.startsWith("/User") ||
      pathname.startsWith("/onboarding")) &&
    !token
  ) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  // Proteksi admin
  if (pathname.startsWith("/Admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(
        new URL("/User/dashboard", request.url)
      );
    }
  }

  // Proteksi user/customer
  if (pathname.startsWith("/User")) {
    if (role !== "customer") {
      return NextResponse.redirect(
        new URL("/Admin/admin-dashboard", request.url)
      );
    }
  }

  return NextResponse.next();

}

export const config = {
  matcher: [
    "/Admin/:path*",
    "/User/:path*",
    "/onboarding/:path*",
  ],
};