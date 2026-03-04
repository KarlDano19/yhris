import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, SessionData } from './lib/session';

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  const listPathname = request.nextUrl.pathname.split('/');
  const slicePaths = listPathname.slice(1);
  const firstRoute = slicePaths[0];

  const isLoggedIn = session.isLoggedIn;
  const accountType = session.accountType;
  const hasProfile = session.hasProfile;
  const hasPendingTransaction = session.hasPendingTransaction;
  const hasActiveSubscription = session.hasActiveSubscription;

  const bypassRoutes: any = ['', 'jobs', 'job-app-form', 'pricing', 'sso', 'verify', 'dragonpay-callback', 'evaluation-form', 'directives', 'landing-page', 'features', 'faqs', 'use-cases', 'employee-issue-response', 'employee-issue-decision', 'login', 'register', 'forgot-password', 'change-password', 'docs', 'how-we-compare', 'separation'];
  const unAuthRoutes: any = ['login', 'register', 'forgot-password', 'change-password'];
  const adminRoutes: any = ['admin'];
  const employerRoutes: any = [
    'manage-subscriptions',
    'checkout',
    'dashboard',
    'post-job',
    'screen-applicants',
    'screening-question-guideline',
    'orient',
    'manage',
    'employee-separation',
    'employer-profile',
    'setup-employer-profile',
    'admin',
    'evaluation',
    'settings',
    'dole',
    'analytics',
    'audit-logs',
    'talent-search',
    'notifications',
  ];
  const applicantRoutes: any = [
    'application-tracker',
    'apply-for-a-job',
    'edit-profile',
    'notification',
    'setup-applicant-profile',
    'job-applicant-form',
  ];

  if (bypassRoutes.includes(firstRoute)) {
    return NextResponse.next();
  }
  if (isLoggedIn) {
    if (accountType === 'admin') {
      if (!adminRoutes.includes(firstRoute)) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    if (accountType === 'employer') {
      if (employerRoutes.includes(firstRoute)) {
        if (
          firstRoute === 'dashboard' ||
          firstRoute === 'employee-separation' ||
          firstRoute === 'manage' ||
          firstRoute === 'post-job' ||
          firstRoute === 'screen-applicants' ||
          firstRoute === 'orient' ||
          firstRoute === 'manage-subscriptions' ||
          firstRoute === 'checkout' ||
          firstRoute === 'employer-profile' ||
          firstRoute === 'setup-employer-profile' ||
          firstRoute === 'evaluation' ||
          firstRoute === 'settings' ||
          firstRoute === 'dole' ||
          firstRoute === 'talent-search' ||
          firstRoute === 'analytics' ||
          firstRoute === 'audit-logs' ||
          firstRoute === 'notifications'
        ) {
          if (hasProfile) {
            if (firstRoute === 'setup-employer-profile') {
              return NextResponse.redirect(new URL('/dashboard', request.url));
            }
            if (firstRoute === 'checkout' && (hasPendingTransaction || hasActiveSubscription)) {
              return NextResponse.redirect(new URL('/manage-subscriptions', request.url));
            }
          }
          if (!hasProfile) {
            if (firstRoute !== 'setup-employer-profile') {
              return NextResponse.redirect(new URL('/setup-employer-profile', request.url));
            }
          }
        }
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    if (accountType === 'applicant') {
      if (applicantRoutes.includes(firstRoute)) {
        if (
          firstRoute === 'application-tracker' ||
          firstRoute === 'apply-for-a-job' ||
          firstRoute === 'edit-profile' ||
          firstRoute === 'notification' ||
          firstRoute === 'setup-applicant-profile' ||
          firstRoute === 'job-applicant-form'
        ) {
          if (hasProfile) {
            if (firstRoute === 'setup-applicant-profile') {
              return NextResponse.redirect(new URL('/apply-for-a-job', request.url));
            }
          }
          if (!hasProfile) {
            if (firstRoute !== 'setup-applicant-profile') {
              return NextResponse.redirect(new URL('/setup-applicant-profile', request.url));
            }
          }
        }
      } else {
        return NextResponse.redirect(new URL('/apply-for-a-job', request.url));
      }
    }
  } else {
    const sessionRoutes = [...employerRoutes, ...applicantRoutes];
    if (sessionRoutes.includes(firstRoute)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|assets|_next/static|_next/image|favicon.ico).*)',
  ],
};
