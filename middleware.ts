import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🔒 Basic Auth voor /beheer
  if (pathname.startsWith('/beheer')) {
    const authHeader = request.headers.get('authorization')
    const username = process.env.LOGIN_USERNAME || ''
    const password = process.env.LOGIN_PASSWORD || ''
    const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')

    if (!authHeader || authHeader !== basicAuth) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Beheerpagina"',
        },
      })
    }
  }

  // 🔁 Redirect alleen de rootpagina
  if (pathname === '/') {
    return NextResponse.redirect('https://wouter.photo')
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/beheer'],
}