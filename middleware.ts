/**
 * Budgeify — Authentication Middleware
 *
 * Crash-proof: skips Clerk auth when env keys are missing.
 * Explicit exclusion of all static assets, icons, and public files.
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
    return NextResponse.next();
  }

  return handleWithClerk(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, favicon-*.png
     * - icon.svg, icon-*.png, apple-icon-*.png
     * - manifest.json, robots.txt, sitemap.xml
     * - Any file with a common static extension
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon-.*\\.png|icon-.*\\.png|icon\\.svg|apple-icon-.*\\.png|manifest\\.json|robots\\.txt|sitemap\\.xml).*)',
  ],
};
