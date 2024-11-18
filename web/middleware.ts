import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const config = {
  matcher: ['/', '/(en|fr)/:path*']
};

export default async function middleware(req: NextRequest) {
  const localeMiddleware = createMiddleware(routing);
  const protectedRoutes: string[] =
  [
    '/fr/admin-actions', '/en/admin-actions',
    '/fr/areas-created', '/en/areas-created',
    '/fr/choose-reaction', '/en/choose-reaction',
    '/fr/choose-trigger', '/en/choose-trigger',
    '/fr/choose-service', '/en/choose-service',
    '/fr/create-area', '/en/create-area',
    '/fr/forgot-password', '/en/forgot-password',
    '/fr/profile', '/en/profile',
    '/fr/set-params', '/en/set-params',
  ];
  const { pathname } = req.nextUrl;
  const isAuthenticated: RequestCookie | undefined  = req.cookies.get('accessToken'); 
  const isProtectedRoute: boolean = protectedRoutes.includes(pathname)

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(`/en/`, req.url);
    return NextResponse.redirect(loginUrl);
  }
  return localeMiddleware(req);
}
