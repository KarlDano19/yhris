import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, SessionData } from './lib/session';

async function appMiddleware(request: NextRequest) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore as any, sessionOptions);
  const listPathname = request.nextUrl.pathname.split('/');
  const slicePaths = listPathname.slice(1);
  const firstRoute = slicePaths[0];

  const isLoggedIn = session.isLoggedIn;
  const accountType = session.accountType;
  const isAdmin = session.isAdmin === true;
  const hasProfile = session.hasProfile;
  const hasCompletedOnboarding = session.hasCompletedOnboarding;
  const hasPendingTransaction = session.hasPendingTransaction;
  const hasActiveSubscription = session.hasActiveSubscription;
  const loginType = session.loginType;

  const bypassRoutes: any = ['', 'jobs', 'job-app-form', 'pricing', 'sso', 'verify', 'dragonpay-callback', 'evaluation-form', 'directives', 'landing-page', 'features', 'faqs', 'use-cases', 'employee-issue-response', 'employee-issue-decision', 'login', 'register', 'forgot-password', 'change-password', 'docs', 'how-we-compare', 'offboarding-public', 'privacy-notice', 'blog', 'form-response'];
  const unAuthRoutes: any = ['login', 'register', 'forgot-password', 'change-password'];
  const adminRoutes: any = ['admin'];
  const employerRoutes: any = [
    'manage-subscriptions',
    'checkout',
    'dashboard',
    'post-job',
    'screen-applicants',
    'screening-question-guideline',
    'onboarding',
    'manage',
    'offboarding',
    'employer-profile',
    'setup-employer-profile',
    'evaluation',
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
    'profile',
    'setup-applicant-profile',
    'job-applicant-form',
    // 'application-tracker',
    // 'apply-for-a-job',
    // 'edit-profile',
    // 'notification',
  ];

  if (bypassRoutes.includes(firstRoute)) {
    return NextResponse.next();
  }
  if (isLoggedIn) {
    if (accountType === 'superadmin' || isAdmin) {
      if (!adminRoutes.includes(firstRoute)) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }
    if (accountType === 'employer') {
      if (employerRoutes.includes(firstRoute)) {
        if (
          firstRoute === 'dashboard' ||
          firstRoute === 'offboarding' ||
          firstRoute === 'manage' ||
          firstRoute === 'post-job' ||
          firstRoute === 'screen-applicants' ||
          firstRoute === 'onboarding' ||
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
              if (request.nextUrl.pathname === '/setup-employer-profile') {
                if (hasCompletedOnboarding) {
                  return NextResponse.redirect(new URL('/dashboard', request.url));
                }
                return NextResponse.redirect(new URL('/setup-employer-profile/onboarding-checklist', request.url));
              }
              if (
                request.nextUrl.pathname === '/setup-employer-profile/acceptance-memo' &&
                hasCompletedOnboarding
              ) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
              }
              // Allow access to other sub-routes (onboarding-checklist, etc.)
            } else if (!hasCompletedOnboarding && firstRoute !== 'settings' && firstRoute !== 'notifications' && loginType !== 'yahshua-payroll' && loginType !== 'yg-payroll') {
              // Onboarding gate: block employer routes until checklist is complete.
              // settings and notifications are exempt so users can't get trapped.
              return NextResponse.redirect(new URL('/setup-employer-profile/onboarding-checklist', request.url));
            } else if (firstRoute === 'checkout' && (hasPendingTransaction || hasActiveSubscription)) {
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
        // Business mode is temporarily disabled — redirect to personal mode
        if (firstRoute === 'business-mode') {
          return NextResponse.redirect(new URL('/personal-mode', request.url));
        }
        if (firstRoute === 'personal-mode') {
          if (!hasProfile) {
            return NextResponse.redirect(new URL('/setup-applicant-profile', request.url));
          }
          // Block coming soon sub-routes
          const secondRoute = slicePaths[1];
          const comingSoonRoutes = ['trainings', 'transactions'];
          if (secondRoute && comingSoonRoutes.includes(secondRoute)) {
            return NextResponse.redirect(new URL('/personal-mode', request.url));
          }
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
        // if (
        //   firstRoute === 'application-tracker' ||
        //   firstRoute === 'apply-for-a-job' ||
        //   firstRoute === 'edit-profile' ||
        //   firstRoute === 'notification' ||
        //   firstRoute === 'job-applicant-form'
        // ) {
        //   if (hasProfile) {
        //     // Redirect old applicant routes to personal-mode
        //     return NextResponse.redirect(new URL('/personal-mode', request.url));
        //   }
        //   if (!hasProfile) {
        //     return NextResponse.redirect(new URL('/setup-applicant-profile', request.url));
        //   }
        // }
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
    const sessionRoutes = [...adminRoutes, ...employerRoutes, ...applicantRoutes];
    if (sessionRoutes.includes(firstRoute)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

// Staging (s1.yahshuahris.com) must never be indexed, archived, or quoted by search or AI crawlers.
// Detected at request time, so it works whichever image or env the staging deployment uses:
//   1. the Host header (or X-Forwarded-Host / X-Original-Host when a proxy such as CloudFront rewrites Host), or
//   2. STAGING_NOINDEX=true (or 1) in the staging deployment's runtime environment.
// Production hosts match neither, so production responses are unchanged.
const STAGING_HOSTS = ['s1.yahshuahris.com'];
const STAGING_ROBOTS_TAG = 'noindex, nofollow, noarchive, nosnippet';

const isStagingRequest = (request: NextRequest) => {
  const flag = process.env.STAGING_NOINDEX;
  if (flag === 'true' || flag === '1') return true;
  return ['host', 'x-forwarded-host', 'x-original-host'].some((name) => {
    const value = request.headers.get(name);
    if (!value) return false;
    const host = value.split(',')[0].trim().toLowerCase().replace(/:\d+$/, '');
    return STAGING_HOSTS.includes(host);
  });
};

export async function middleware(request: NextRequest) {
  const staging = isStagingRequest(request);

  if (staging && request.nextUrl.pathname === '/robots.txt') {
    const url = request.nextUrl.clone();
    url.pathname = '/robots-staging.txt';
    const response = NextResponse.rewrite(url);
    response.headers.set('X-Robots-Tag', STAGING_ROBOTS_TAG);
    return response;
  }

  const response = await appMiddleware(request);
  if (staging) {
    response.headers.set('X-Robots-Tag', STAGING_ROBOTS_TAG);
  }
  return response;
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
    '/((?!api|assets|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|mp4|webm|mov|avi)).*)',
  ],
};
