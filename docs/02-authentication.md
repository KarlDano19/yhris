# Authentication & Sessions

## Overview

The application uses Iron Session for secure, server-side session management with custom middleware for route protection and role-based access control.

## Session Configuration

### Session Data Structure
```typescript
export interface SessionData {
  isLoggedIn: boolean;
  token: string;
  email: string;
  accountType: string;
  loginType: string;
  hasProfile: boolean;
  hasPendingTransaction: boolean;
  hasActiveSubscription: boolean;
}
```

### Default Session
```typescript
export const defaultSession: SessionData = {
  isLoggedIn: false,
  token: '',
  email: '',
  accountType: '',
  loginType: '',
  hasProfile: false,
  hasPendingTransaction: false,
  hasActiveSubscription: false,
};
```

### Session Options
```typescript
export const sessionOptions: SessionOptions = {
  password: 'nI6xnF+V1OJj/GqGxaEwf6s1L48EBjclCu+TdQoFS6Y=',
  cookieName: 'iron_session_id',
  cookieOptions: {
    secure: false, // Set to true in production with HTTPS
  },
};
```

## Middleware Implementation

The middleware (`src/middleware.ts`) handles comprehensive route protection:

### Route Categories
```typescript
const bypassRoutes = ['', 'jobs', 'job-app-form', 'pricing', 'sso', 'verify', 'dragonpay-callback', 'evaluation-form', 'directives', 'landing-page'];
const unAuthRoutes = ['login', 'register', 'forgot-password', 'change-password'];
const adminRoutes = ['admin'];
const employerRoutes = ['manage-subscriptions', 'checkout', 'dashboard', 'post-job', /* ... */];
const applicantRoutes = ['application-tracker', 'apply-for-a-job', 'edit-profile', /* ... */];
```

### Authentication Logic
```typescript
export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  const isLoggedIn = session.isLoggedIn;
  const accountType = session.accountType;
  const hasProfile = session.hasProfile;
  
  // Route protection logic based on user state
  if (isLoggedIn) {
    // Role-based routing
    if (accountType === 'admin') {
      // Admin route handling
    } else if (accountType === 'employer') {
      // Employer route handling with profile checks
    } else if (accountType === 'applicant') {
      // Applicant route handling
    }
  } else {
    // Redirect to login for protected routes
  }
}
```

## API Endpoints

### Session Management
- `GET /api/get-session` - Retrieve current session data
- `POST /api/login` - Authenticate user and create session (with OTP support)
- `POST /api/logout` - Destroy session
- `POST /api/update-session` - Update session properties

### OTP Authentication
- `POST /api/login/otp/verify` - Verify OTP code
- `POST /api/login/otp/resend` - Resend OTP code

### Login API Route with OTP
```typescript
// Login endpoint with OTP support
export async function POST(request: Request) {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  
  // Validate credentials with backend
  const response = await validateCredentials(credentials);
  
  if (response.otp_required) {
    // Return OTP session data
    return NextResponse.json({
      otp_required: true,
      session_id: response.session_id,
      expires_at: response.expires_at,
      remaining_attempts: response.remaining_attempts,
      time_remaining_seconds: response.time_remaining_seconds,
      message: "OTP sent to your email"
    });
  }
  
  // Set session data for direct login
  session.isLoggedIn = true;
  session.email = userEmail;
  session.accountType = userType;
  session.token = response.token;
  
  await session.save();
  return NextResponse.json({ success: true });
}
```

## Authentication Flow

### Login Process with OTP
1. User submits credentials via login form
2. Frontend calls `/api/login` endpoint
3. Backend validates credentials with external API
4. If OTP is required:
   - OTP code is generated and sent to user's email
   - Frontend displays OTP verification modal
   - User enters 6-digit code
   - Code is verified via `/api/login/otp/verify`
   - Session is created upon successful verification
5. If OTP is not required:
   - Session is created directly with user data
6. User is redirected based on role and profile status

### OTP Verification Process
1. User receives 6-digit code via email
2. Code is entered in verification modal
3. Frontend validates code format (6 digits)
4. Code is sent with session ID for verification
5. Backend validates:
   - Session ID validity
   - Code correctness
   - Expiration status
   - Attempt limits
6. Upon success, JWT token is issued
7. Session is created with authentication data

### Session Validation
1. Middleware checks session on each request
2. Route access is validated against user role
3. Profile completion status is enforced
4. Subscription status is validated for premium features
5. OTP device recognition (if "Remember Device" was selected)

### Logout Process
1. User triggers logout action
2. Session is destroyed on server
3. OTP session (if any) is invalidated
4. User is redirected to login page
5. Client-side state is cleared

## Role-Based Access Control

### Admin Users
- Full system access
- User management capabilities
- Analytics and reporting
- System configuration

### Employer Users
- Company profile management
- Job posting and management
- Employee management
- DOLE compliance features
- Subscription management

### Applicant Users
- Profile management
- Job search and application
- Application tracking
- Interview scheduling

## Profile Setup Enforcement

The system enforces profile completion:

```typescript
// Employer profile check
if (hasProfile) {
  if (firstRoute === 'setup-employer-profile') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
} else {
  if (firstRoute !== 'setup-employer-profile') {
    return NextResponse.redirect(new URL('/setup-employer-profile', request.url));
  }
}
```

## Subscription Management

Subscription status affects route access:

```typescript
if (firstRoute === 'checkout' && (hasPendingTransaction || hasActiveSubscription)) {
  return NextResponse.redirect(new URL('/manage-subscriptions', request.url));
}
```

## Security Features

### Session Security
- Server-side session storage
- Encrypted session cookies
- Configurable cookie options
- Automatic session expiration
- OTP-based two-factor authentication

### OTP Security
- Time-based expiration (5 minutes default)
- Limited verification attempts (5 attempts)
- Session-bound OTP codes
- Rate limiting on resend requests
- Optional device recognition (14 days)
- Secure email delivery

### Route Protection
- Middleware-based protection
- Role-based access control
- Profile completion enforcement
- Subscription status validation
- OTP verification enforcement

### CSRF Protection
- Iron Session provides built-in CSRF protection
- Secure cookie configuration
- HttpOnly cookies for security
- Session ID validation for OTP

## Best Practices

### Session Management
1. Always validate session data before use
2. Update session when user data changes
3. Implement proper logout functionality
4. Handle session expiration gracefully

### Route Protection
1. Use middleware for consistent protection
2. Implement fallback routes for unauthorized access
3. Provide clear error messages
4. Maintain redirect logic for better UX

### Security Considerations
1. Use HTTPS in production
2. Configure secure cookie options
3. Implement session timeout
4. Validate all user inputs
5. Log security events for monitoring

## Session Helper Functions

```typescript
// Get session in server components
async function getSession() {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  return session;
}

// Update session helper
export async function updateSession(updates: Partial<SessionData>) {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  Object.assign(session, updates);
  await session.save();
}
```

## Error Handling

### Session Errors
- Handle session corruption gracefully
- Provide fallback authentication
- Log errors for monitoring
- Clear invalid sessions

### Authentication Errors
- Provide clear error messages
- Implement retry mechanisms
- Handle network failures
- Maintain security during errors
