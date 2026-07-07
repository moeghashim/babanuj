import { NextRequest, NextResponse } from "next/server";

/**
 * Vercel's routing matches paths case-insensitively, so /Collections/Baklava
 * renders the same page as /collections/baklava and self-canonicalizes to the
 * mixed-case URL — Google sees duplicate pages. Every real route on this site
 * (Shopify handles, brand ids, static segments) is lowercase, so 308 any
 * mixed-case path to its lowercase form; unknown handles then 404 in the
 * page components as usual.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const lowercased = pathname.toLowerCase();

  if (pathname !== lowercased) {
    const url = request.nextUrl.clone();
    url.pathname = lowercased;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Skip API routes, the PostHog proxy, Next internals, and static assets
  // (anything with a file extension). next.config.ts redirects run before
  // middleware, so legacy-handle redirects are unaffected.
  matcher: ["/((?!api/|ingest/|_next/|.*\\..*).*)"],
};
