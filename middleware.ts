import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_ROUTES    = ['/login', '/register']
const PROTECTED_BASE = ['/dashboard', '/mood', '/habits', '/history', '/settings']

export default auth(function middleware(req: NextRequest & { auth: { user?: { id: string } } | null }) {
  const { nextUrl } = req
  const session = (req as typeof req & { auth: { user?: { id: string } } | null }).auth

  const isAuthenticated  = !!session?.user
  const isAuthRoute      = AUTH_ROUTES.some((r) => nextUrl.pathname.startsWith(r))
  const isProtectedRoute = PROTECTED_BASE.some((r) => nextUrl.pathname.startsWith(r))

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
