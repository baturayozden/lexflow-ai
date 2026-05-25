import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const host = req.headers.get('host') || ''
  const isAppSubdomain = host.startsWith('app.')

  // Skip auth for public API routes
  if (pathname.startsWith('/api/seed') || pathname.startsWith('/api/cron') || pathname.startsWith('/api/chat') || pathname === '/widget-test') {
    return NextResponse.next()
  }

  // Public intake pages — no auth required
  if (pathname.startsWith('/intake/')) {
    return NextResponse.next()
  }

  // App subdomain routing
  if (isAppSubdomain) {
    if (pathname === '/login' || pathname.startsWith('/api/auth')) {
      return NextResponse.next()
    }
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Platform admins should not use app subdomain
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session.user as any)?.role === 'platform_admin') {
      return NextResponse.redirect(new URL('https://lexflow.co.uk/admin', req.url))
    }
    return NextResponse.next()
  }

  // Main domain - protect /admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Protect /platform routes — redirect to /admin/firms
  if (pathname.startsWith('/platform')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/platform/:path*', '/dashboard/:path*', '/intake/:path*', '/login', '/api/seed', '/api/cron/:path*', '/api/chat'],
}
