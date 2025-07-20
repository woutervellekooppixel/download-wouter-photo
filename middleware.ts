import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Alleen exact '/' redirecten
  if (pathname === '/') {
    return NextResponse.redirect('https://wouter.photo');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'], // middleware alleen op de rootpagina
};