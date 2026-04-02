import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_SESSION_COOKIE = 'aqeela_session'

const protectedPagePrefixes = ['/my-orders', '/add-address', '/seller']
const protectedApiPrefixes = ['/api/addresses', '/api/orders', '/api/payments/stripe/create-session']

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const hasSession = Boolean(request.cookies.get(AUTH_SESSION_COOKIE)?.value)

  const isProtectedPage = protectedPagePrefixes.some((prefix) => pathname.startsWith(prefix))
  const isProtectedApi = protectedApiPrefixes.some((prefix) => pathname.startsWith(prefix))

  if (hasSession || (!isProtectedPage && !isProtectedApi)) {
    return NextResponse.next()
  }

  if (isProtectedApi) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const signInUrl = new URL('/sign-in', request.url)
  signInUrl.searchParams.set('redirect_url', pathname)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}