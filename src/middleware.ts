import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (token) {
    if (
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register')
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/employee-separation') ||
      request.nextUrl.pathname.startsWith('/manage')
    ) {
      try {
        const config = {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            Authorization: `Token ${token}`,
          },
        };
        const res = await (
          await fetch(`${process.env.hostName}/api/employer-profile/`, config)
        ).json();
        if (Object.hasOwn(res, 'profile')) {
          if (!Object.keys(res.profile).length) {
            return NextResponse.redirect(
              new URL('/setup-employer-profile', request.url)
            );
          }
        }
      } catch (err) {
        // Nothing
      }
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
};
