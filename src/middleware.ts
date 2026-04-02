import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/contact',
  '/admissions',
  '/academics',
  '/research',
  '/campus',
  '/apply',
  '/apply/status',
  '/payments',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/sso-callback',
  '/api/auth(.*)',
  '/api/clerk-webhook',
  '/api/payment/success',
  '/api/flow(.*)',
  '/api/cron(.*)',
  '/api/admissions(.*)',
  '/api/settings(.*)',
  '/api/application(.*)',
  '/api/quiz(.*)',
])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js)$|_next).*)',
    '/(api|trpc)(/.*)?$',
  ],
}
