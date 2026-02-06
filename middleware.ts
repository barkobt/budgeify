/**
 * Budgeify — Authentication Middleware
 *
 * Crash-proof: skips Clerk auth when env keys are missing.
 * This allows local dev and Vercel preview builds to work without secrets.
 */

import { NextResponse, type NextRequest } from 'next/server';

const clerkEnabled = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY
);

function isAuthPage(pathname: string): boolean {
  return pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
}

async function handleWithClerk(request: NextRequest) {
  try {
    const { clerkMiddleware, createRouteMatcher } = await import(
      '@clerk/nextjs/server'
    );
    const isPublicRoute = createRouteMatcher([
      '/',
      '/sign-in(.*)',
      '/sign-up(.*)',
      '/api/webhooks(.*)',
    ]);

    const middleware = clerkMiddleware(async (auth, req) => {
      const { userId } = await auth();

      if (userId && isAuthPage(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      if (!userId && !isPublicRoute(req)) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }

      return NextResponse.next();
    });

    return middleware(request, {} as never);
  } catch {
    // Clerk import or runtime failure — fall through
    return NextResponse.next();
  }
}

export default async function middleware(request: NextRequest) {
  if (!clerkEnabled) {
    // No Clerk keys — allow all routes (demo mode)
    return NextResponse.next();
  }

  return handleWithClerk(request);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
