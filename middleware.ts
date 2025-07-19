import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root
  if (pathname === '/') {
    return NextResponse.redirect('https://wouter.photo');
  }

  // Redirect all unknown slugs (not starting with /_next or /api)
  if (!pathname.startsWith('/_next') && !pathname.startsWith('/api') && pathname.split('/').length === 2) {
    return NextResponse.redirect('https://wouter.photo');
  }

  return NextResponse.next();
}
