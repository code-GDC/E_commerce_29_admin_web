import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only allow public access to the root path (login) and check for the token on all `/dashboard` paths
  const isDashboardPath = path.startsWith("/dashboard");

  // Get token from cookies
  const token = request.cookies.get("admin")?.value;

  // If on a dashboard path and no token is found, redirect to login ("/")
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Optional: If the user is logged in and tries to access the login page, redirect to the dashboard
  if (path === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*", // Match all routes under `/dashboard`
    "/",                 // Match the root path for conditional redirection if already logged in
  ],
};
