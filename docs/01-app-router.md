# App Router Structure

## Overview

The application uses Next.js 14's App Router architecture for modern, performant routing. The structure leverages route groups and layout nesting for role-based access control.

## Directory Structure

```
src/app/
├── (all-layout)/          # Shared layout routes
│   ├── change-password/   # Password reset functionality
│   ├── forgot-password/   # Password recovery
│   ├── login/            # User authentication
│   └── register/         # User registration
├── (auth)/               # Protected routes requiring authentication
│   ├── (applicant)/      # Applicant-specific routes
│   │   ├── (other-pages)/
│   │   └── (setup-profile)/
│   ├── (employer)/       # Employer-specific routes
│   │   ├── audit-logs/
│   │   ├── checkout/
│   │   ├── dashboard/
│   │   ├── dole/
│   │   ├── employee-separation/
│   │   ├── employer-profile/
│   │   ├── manage/
│   │   ├── manage-subscriptions/
│   │   ├── orient/
│   │   ├── post-job/
│   │   ├── screen-applicants/
│   │   ├── settings/
│   │   ├── setup-employer-profile/
│   │   └── train/
│   └── admin/            # Admin-specific routes
├── (un-auth)/            # Public routes
└── api/                  # API route handlers
    ├── get-session/
    ├── login/
    ├── logout/
    └── update-session/
```

## Route Groups Explanation

### (all-layout)
Routes that share a common layout across all user types:
- Authentication forms (login, register)
- Password management
- Shared styling and components

### (auth)
Protected routes requiring authentication. Contains nested route groups for different user roles:

#### (applicant)
Routes specific to job applicants:
- Profile setup and management
- Job application features
- Application tracking

#### (employer) 
Routes for employer/company users:
- Dashboard and analytics
- Job posting and management
- Employee management
- DOLE compliance features
- Training and evaluation systems

#### admin
Administrative routes for system management:
- User monitoring
- System configuration
- Analytics and reporting

### (un-auth)
Public routes accessible without authentication

## Key Files

### layout.tsx
```typescript
// Root layout with providers and analytics
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${golos_text.className}`}>  
        <PostHogProvider>
          <ReactQueryWrapper>
            <Auth>{children}</Auth>
          </ReactQueryWrapper>
          <Toaster position='top-right' />
          {/* Analytics scripts */}
        </PostHogProvider>
      </body>
    </html>
  );
}
```

### auth.tsx
Authentication wrapper that adds header based on user session:
```typescript
async function Auth({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const type = session.accountType;
  const hasProfile = session.hasProfile;
  const hasActiveSubscription = session.hasActiveSubscription;

  return (
    <>
      <Header type={type} hasProfile={hasProfile} hasActiveSubscription={hasActiveSubscription} />
      {children}
    </>
  );
}
```

### page.tsx (Root)
Landing page that redirects based on user authentication status

## Routing Features

### Dynamic Routing
- File-based routing with automatic route generation
- Dynamic segments for user IDs, job IDs, etc.
- Nested layouts for complex UI structures

### Route Protection
- Middleware-based route protection
- Role-based access control
- Automatic redirects based on authentication status

### SEO Optimization
- Metadata configuration per route
- sitemap.ts for search engine optimization
- Server-side rendering for better SEO

## Layout Hierarchy

```
RootLayout
├── PostHogProvider (Analytics)
├── ReactQueryWrapper (State Management)
├── Auth (Authentication Wrapper)
│   ├── Header (Navigation)
│   └── Page Content
└── Toaster (Notifications)
```

## Best Practices

1. **Route Groups**: Use parentheses for logical grouping without affecting URL structure
2. **Layouts**: Leverage nested layouts for shared UI components
3. **Metadata**: Configure SEO metadata at the appropriate level
4. **Loading States**: Implement loading.tsx for better UX
5. **Error Handling**: Use error.tsx for graceful error handling

## API Routes

The `/api` directory contains server-side API handlers:
- Session management endpoints
- Authentication endpoints
- Integration with backend services

These routes follow the App Router conventions and support modern features like:
- Route handlers with HTTP methods
- TypeScript support
- Integration with Iron Session
- Middleware support
