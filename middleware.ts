import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/my-orders(.*)',
  '/add-address(.*)',
  '/seller(.*)',
  '/api/addresses(.*)',
  '/api/orders(.*)',
  '/api/payments/stripe/create-session(.*)',
])

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export default async function middleware(request: Request, event: unknown) {
  try {
    return await clerkHandler(request as never, event as never)
  } catch (error) {
    console.error('Middleware fallback due to Clerk invocation failure:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}