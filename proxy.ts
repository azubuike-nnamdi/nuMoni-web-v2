import { NextRequest, NextResponse } from "next/server";
import { isStaticAsset } from "./lib/helper";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userType = request.cookies.get('user-type')?.value;
  const accessToken = request.cookies.get('access-token')?.value;
  const userId = request.cookies.get('user-id')?.value;
  const regLevelCookie = request.cookies.get('reg-level')?.value;
  const regLevel = regLevelCookie ? Number(regLevelCookie) : undefined;
  console.log('accessToken', accessToken);
  console.log('userType', userType);
  console.log('userId', userId);
  console.log('pathname', pathname);
  console.log('regLevel', regLevel);

  // Skip static asset requests (extra safety)
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Check if user is trying to access protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/auth');
  const isRootPath = pathname === '/';
  const isBusinessRegistrationRoute = pathname === '/auth/business-registration';

  // Handle root path redirects
  if (isRootPath) {
    if (accessToken && userType && userId) {
      console.log('Redirecting to dashboard: User authenticated on root path');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      console.log('Redirecting to sign-in: User not authenticated on root path');
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
  }

  // If accessing protected routes without proper authentication
  if (isProtectedRoute && (!accessToken || !userType || !userId)) {
    console.log('Redirecting to sign-in: Missing auth credentials');
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // Protect business registration route - require authentication
  if (isBusinessRegistrationRoute && (!accessToken || !userType || !userId)) {
    console.log('Redirecting to sign-in: Business registration requires authentication');
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // If authenticated, check regLevel for route protection
  if (accessToken && userType && userId) {
    // Protect dashboard routes - redirect if regLevel < 4
    if (isProtectedRoute && regLevel !== undefined && regLevel < 4) {
      console.log('Redirecting to business registration: regLevel < 4');
      return NextResponse.redirect(new URL('/auth/business-registration', request.url));
    }

    // Protect business registration route - redirect to dashboard if regLevel >= 4
    if (isBusinessRegistrationRoute && regLevel !== undefined && regLevel >= 4) {
      console.log('Redirecting to dashboard: regLevel >= 4');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If accessing other auth routes while already authenticated, redirect to dashboard
    if (isAuthRoute && !isBusinessRegistrationRoute) {
      console.log('Redirecting to dashboard: User already authenticated');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next|favicon.ico|.*\\.).*)',
    },
  ],
};

