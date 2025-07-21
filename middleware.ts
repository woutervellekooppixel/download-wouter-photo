import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/beheer', '/api/add', '/api/update', '/api/delete'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const cookie = req.cookies.get('auth')?.value;

  if (isProtected && cookie !== process.env.LOGIN_PASSWORD) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/beheer', '/api/(add|update|delete)'],
};