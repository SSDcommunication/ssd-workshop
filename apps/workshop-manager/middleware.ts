import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)

  // Check if user has auth token in cookies
  const token = request.cookies.get('sb-ixbatrhxequtbngvaexz-auth-token')?.value

  // Redirect to login if not authenticated and trying to access protected routes
  if (!token && requestUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
