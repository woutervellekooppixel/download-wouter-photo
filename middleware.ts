import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Alleen rootpagina redirecten
  if (pathname === '/') {
    return NextResponse.redirect('https://wouter.photo');
  }

  return NextResponse.next();
}
