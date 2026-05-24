import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Skip auth for cron and seed endpoints
  if (pathname.startsWith('/api/seed') || pathname.startsWith('/api/cron')) {
    return NextResponse.next()
  }

  // Protect /admin routes (except login page itself)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Protect /platform routes — platform_admin only
  if (pathname.startsWith('/platform')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    const role = (session.user as Record<string, unknown>)?.role as string | undefined
    if (role !== 'platform_admin') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/platform/:path*', '/api/seed', '/api/cron/:path*'],
}
