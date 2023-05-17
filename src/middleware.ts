import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('test')?.value;
  if (token) {
    if (
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register')
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    if (
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/employee-separation') ||
      request.nextUrl.pathname.startsWith('/manage') ||
      request.nextUrl.pathname.startsWith('/setup-employer-profile')
    ) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
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
};
