import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const tenantId = request.cookies.get('tenant_id')?.value
  if (!tenantId) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-id', tenantId)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
