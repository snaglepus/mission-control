import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Check if the request is for an API route - allow those
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check for static assets - allow those
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/favicon') ||
    request.nextUrl.pathname === '/'
  ) {
    // Continue to check auth for root, but allow static assets
    if (request.nextUrl.pathname !== '/') {
      return NextResponse.next()
    }
  }

  const basicAuth = request.headers.get('authorization')

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (
      user === process.env.AUTH_USERNAME &&
      pwd === process.env.AUTH_PASSWORD
    ) {
      return NextResponse.next()
    }
  }

  // Return 401 with WWW-Authenticate header to prompt for credentials
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Mission Control"',
    },
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
