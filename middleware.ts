/**
 * Budgeify v2.0 - Authentication Middleware
 *
 * 🎓 MENTOR NOTU - Middleware Nedir?
 * ----------------------------------
 * Middleware, her HTTP isteği sunucuya ulaşmadan ÖNCE çalışan koddur.
 *
 * Akış:
 * İstek → Middleware → Route Handler → Response
 *
 * Kullanım alanları:
 * 1. Authentication (giriş kontrolü)
 * 2. Redirects (yönlendirmeler)
 * 3. Headers (güvenlik başlıkları)
 * 4. Logging (istek kaydı)
 *
 * Clerk Middleware:
 * - Kullanıcının oturum durumunu kontrol eder
 * - Protected route'lara giriş yapmamış kullanıcıları yönlendirir
 * - Session bilgisini request'e ekler
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * 🎓 MENTOR NOTU - Route Matchers:
 *
 * createRouteMatcher, glob pattern'leri ile route eşleştirme yapar.
 * Regex yazmak yerine daha okunabilir bir syntax sunar.
 *
 * Patterns:
 * - '/dashboard' → tam eşleşme
 * - '/dashboard(.*)' → /dashboard ile başlayan tüm route'lar
 * - '/api/(.*)' → /api altındaki tüm route'lar
 */

// Public routes - giriş yapmadan erişilebilir
const isPublicRoute = createRouteMatcher([
  '/', // Landing page
  '/sign-in(.*)', // Giriş sayfası
  '/sign-up(.*)', // Kayıt sayfası
  '/api/webhooks(.*)', // Webhook endpoints (Clerk callbacks)
]);

// Auth routes - giriş yapmış kullanıcıları dashboard'a yönlendir
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  /**
   * 🎓 MENTOR NOTU - Auth Logic:
   *
   * 1. Kullanıcı giriş yapmış + auth sayfasında → Dashboard'a yönlendir
   *    (Zaten giriş yapmış kullanıcı neden sign-in'de olsun?)
   *
   * 2. Kullanıcı giriş yapmamış + protected route → Sign-in'e yönlendir
   *    (Yetkisiz erişimi engelle)
   *
   * 3. Diğer durumlar → Devam et
   */

  // Giriş yapmış kullanıcı auth sayfalarına erişmeye çalışıyorsa
  if (userId && isAuthRoute(request)) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Giriş yapmamış kullanıcı protected route'a erişmeye çalışıyorsa
  if (!userId && !isPublicRoute(request)) {
    const signInUrl = new URL('/sign-in', request.url);
    // Giriş sonrası geri dönülecek URL'i kaydet
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Normal akışa devam et
  return NextResponse.next();
});

/**
 * 🎓 MENTOR NOTU - Matcher Config:
 *
 * matcher, middleware'in hangi route'larda çalışacağını belirler.
 * Static dosyalar (_next, images, favicon) dahil edilmez - performans için.
 *
 * '/((?!.*\\..*|_next).*)' → Dosya uzantısı olmayan ve _next olmayan tüm route'lar
 * '/' → Ana sayfa
 * '/(api|trpc)(.*)' → API route'ları
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
