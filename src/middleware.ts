/**
 * Budgeify — Authentication Middleware (v4.6)
 *
 * Crash-proof: skips Clerk auth when env keys are missing.
 * Static assets, manifest, robots, and image files are excluded at matcher level.
 * Public routes: landing, auth pages, webhooks.
 * Protected routes: /dashboard and sub-routes.
 */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/cron(.*)",
  "/api/vitals(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (
    req.nextUrl.pathname.startsWith('/dashboard') &&
    req.method !== 'GET' &&
    req.method !== 'HEAD'
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.url), 303);
  }

  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    return;
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico   (browser favicon)
     * - manifest.json, robots.txt (public meta files)
     * - *.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.ico, *.txt, *.json (static assets)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|manifest\\.json|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|json)$).*)",
  ],
};
