import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/beheer', '/api/add', '/api/update', '/api/delete'];

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');

  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (pwd === process.env.BEHEER_PASSWORD) {
        return NextResponse.next();
      }
    }

    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Beheer"',
      },
    });
  }

  return NextResponse.next();
}