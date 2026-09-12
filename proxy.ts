import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Authority-only routes
    if (pathname.startsWith('/authority')) {
      if (!token || !['AUTHORITY', 'ADMIN'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Admin-only routes
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        // These routes require login. /leaderboard is deliberately public.
        if (
          pathname.startsWith('/report') ||
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/profile') ||
          pathname.startsWith('/authority') ||
          pathname.startsWith('/admin')
        ) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  // :path* on every entry so future sub-routes (e.g. /profile/settings) are
  // protected by default rather than silently falling outside the matcher.
  matcher: [
    '/report/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/authority/:path*',
    '/admin/:path*',
  ],
};
