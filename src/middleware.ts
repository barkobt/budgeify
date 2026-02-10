import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/transactions(.*)",
  "/goals(.*)",
  "/analysis(.*)",
  "/calendar(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|favicon.ico|manifest\\.json|manifest\\.webmanifest|robots.txt|sitemap.xml).*)",
    "/(api|trpc)(.*)",
  ],
};
