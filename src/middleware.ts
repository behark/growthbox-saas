import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get('host') || '';

  // Define the root domain (the main dashboard)
  const ROOT_DOMAIN = 'growthbox.vercel.app';
  
  // Special case for Vercel preview deployment URLs (contains ---)
  const isPreview = host.includes('---');
  
  // Get the pathname
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // If it's the root domain, localhost, or matches the root pattern, serve the dashboard
  if (
    host === 'localhost:3000' ||
    host === ROOT_DOMAIN ||
    host === `www.${ROOT_DOMAIN}` ||
    (isPreview && !host.includes('.localhost'))
  ) {
    return NextResponse.rewrite(new URL(`${path}`, req.url));
  }

  // For subdomain requests, extract the subdomain
  const parts = host.split('.');
  const subdomain = parts[0];
  
  // Rewrite subdomain requests to /domain/[subdomain]
  return NextResponse.rewrite(
    new URL(`/domain/${subdomain}${path}`, req.url)
  );
}
