import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');

  if (request.nextUrl.pathname.startsWith('/beheer')) {
    const username = process.env.LOGIN_USERNAME;
    const password = process.env.LOGIN_PASSWORD;

    if (!basicAuth) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }

    const [scheme, encoded] = basicAuth.split(' ');
    if (scheme !== 'Basic') return new NextResponse('Invalid auth scheme', { status: 401 });

    const decoded = atob(encoded);
    const [user, pass] = decoded.split(':');

    if (user !== username || pass !== password) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/beheer'],
};