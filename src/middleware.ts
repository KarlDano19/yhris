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
    'train',
    'settings',
    'dole',
    'analytics',
    'audit-logs',
    'talent-search',
    'notifications',
  ];
  const applicantRoutes: any = [
    'personal-mode',
    'business-mode',
    'setup-applicant-profile',
    'application-tracker',
    'apply-for-a-job',
    'edit-profile',
    'notification',
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
          firstRoute === 'train' ||
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
        if (firstRoute === 'personal-mode' || firstRoute === 'business-mode') {
          if (!hasProfile) {
            return NextResponse.redirect(new URL('/setup-applicant-profile', request.url));
          }
          // Allow access to personal-mode and business-mode if profile exists
          return NextResponse.next();
        }
        if (firstRoute === 'setup-applicant-profile') {
          if (hasProfile) {
            return NextResponse.redirect(new URL('/personal-mode', request.url));
          }
          // Allow access to setup-applicant-profile if no profile exists
          return NextResponse.next();
        }
        // Handle old applicant routes
        if (
          firstRoute === 'application-tracker' ||
          firstRoute === 'apply-for-a-job' ||
          firstRoute === 'edit-profile' ||
          firstRoute === 'notification' ||
          firstRoute === 'job-applicant-form'
        ) {
          if (hasProfile) {
            // Redirect old applicant routes to personal-mode
            return NextResponse.redirect(new URL('/personal-mode', request.url));
          }
          if (!hasProfile) {
            return NextResponse.redirect(new URL('/setup-applicant-profile', request.url));
          }
        }
      } else {
        // Route not in applicantRoutes - redirect based on profile status
        if (hasProfile) {
          return NextResponse.redirect(new URL('/personal-mode', request.url));
        } else {
          return NextResponse.redirect(new URL('/setup-applicant-profile', request.url));
        }
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
