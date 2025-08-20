# OTP (One-Time Password) Authentication Documentation

## Overview

The YAHSHUA HRIS system implements a Two-Factor Authentication (2FA) system using OTP (One-Time Password) to enhance login security. When enabled, users must enter a 6-digit verification code sent to their registered email address after providing valid credentials.

## Architecture

### Components Overview

```
User Login → Credentials Validation → OTP Generation → Email Delivery → OTP Verification → Session Creation
```

### Key Components

1. **Frontend Components**
   - `OTPVerificationModal.tsx` - Main OTP verification UI component
   - `useOTPVerification.ts` - Hook for OTP verification API calls
   - `useOTPResend.ts` - Hook for resending OTP codes

2. **API Routes** (Next.js)
   - `/api/login/otp/verify` - Verifies the OTP code
   - `/api/login/otp/resend` - Resends a new OTP code

3. **Backend Endpoints** (Django)
   - `/api/auth/login/otp/verify/` - Backend OTP verification
   - `/api/auth/login/otp/resend/` - Backend OTP resend

## Authentication Flow

### 1. Initial Login
```typescript
// User submits credentials
POST /api/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response with OTP requirement
{
  "otp_required": true,
  "session_id": "unique-session-id",
  "expires_at": "2024-01-20T10:30:00Z",
  "remaining_attempts": 5,
  "time_remaining_seconds": 300,
  "message": "OTP sent to your email"
}
```

### 2. OTP Verification
```typescript
// User submits OTP code
POST /api/login/otp/verify
{
  "session_id": "unique-session-id",
  "code": "123456",
  "email": "user@example.com",
  "remember_device": false  // Optional: Remember device for 14 days
}

// Successful response
{
  "token": "jwt-token",
  "is_valid": true,
  "account_type": "employer",
  "has_profile": true,
  "message": "Login successful",
  "has_pending_transaction": false,
  "has_active_subscription": true
}
```

### 3. OTP Resend
```typescript
// Request new OTP
POST /api/login/otp/resend
{
  "session_id": "unique-session-id"
}

// Response
{
  "message": "New OTP sent successfully",
  "time_remaining_seconds": 300
}
```

## Frontend Implementation

### OTP Verification Modal

The `OTPVerificationModal` component provides a user-friendly interface for OTP entry:

#### Features
- **6-digit input fields** with automatic focus navigation
- **Paste support** for copying OTP from email
- **Countdown timer** showing expiration time
- **Attempt counter** displaying remaining verification attempts
- **Remember device** option for 14-day authentication persistence
- **Resend functionality** with cooldown period

#### Component Props
```typescript
interface OTPVerificationModalProps {
  email: string;                    // User's email address
  sessionId: string;                // OTP session identifier
  expiresAt: string;               // ISO timestamp of expiration
  remainingAttempts: number;       // Number of attempts left
  timeRemainingSeconds: number;    // Seconds until expiration
  isOpen: boolean;                 // Modal visibility state
  onClose: () => void;             // Close handler
  onSuccess: (data: any) => void;  // Success callback
}
```

### Custom Hooks

#### useOTPVerification
```typescript
interface OTPVerificationPayload {
  session_id: string;
  code: string;
  email: string;
  remember_device?: boolean;
}

// Usage
const { mutate: verifyOTP, isLoading } = useOTPVerification();

verifyOTP(payload, {
  onSuccess: (data) => {
    // Handle successful verification
  },
  onError: (error) => {
    // Handle verification error
  }
});
```

#### useOTPResend
```typescript
interface OTPResendPayload {
  session_id: string;
}

// Usage
const { mutate: resendOTP, isLoading } = useOTPResend();

resendOTP(payload, {
  onSuccess: (data) => {
    // Handle successful resend
  },
  onError: (error) => {
    // Handle resend error
  }
});
```

## User Experience Features

### Input Handling
- **Auto-advance**: Automatically moves to next input field after entering a digit
- **Backspace navigation**: Pressing backspace on empty field moves to previous field
- **Arrow key navigation**: Left/right arrow keys navigate between fields
- **Paste support**: Users can paste the complete 6-digit code

### Visual Feedback
- **Loading states**: Spinner animations during verification/resend
- **Timer display**: Shows remaining time in MM:SS format
- **Expired state**: Clear indication when OTP has expired
- **Attempt counter**: Shows remaining verification attempts
- **Button states**: Disabled states for invalid/incomplete inputs

### Error Handling
- **Incomplete code**: Validation prevents submission of partial codes
- **Expired codes**: Clear messaging when code has expired
- **Failed attempts**: Shows remaining attempts after each failure
- **Network errors**: Graceful handling with toast notifications

## Security Features

### Session Management
- **Session-based OTP**: Each OTP is tied to a unique session ID
- **Expiration time**: Default 5-minute expiration (300 seconds)
- **Attempt limiting**: Maximum 5 attempts per OTP session
- **Rate limiting**: Cooldown period between resend requests

### Device Recognition
- **Remember device**: Optional 14-day device authentication
- **Secure cookies**: HttpOnly, Secure, SameSite=Strict settings
- **Token rotation**: New JWT token issued after successful verification

### Best Practices
1. **Never log OTP codes** in production environments
2. **Use HTTPS** for all OTP-related communications
3. **Implement rate limiting** on backend endpoints
4. **Clear OTP data** from memory after use
5. **Validate session IDs** before processing OTP

## Integration with Login Flow

### Login Component Integration
```typescript
const onSubmit = handleSubmit((data: any) => {
  const callbackReq = {
    onSuccess: (response: any) => {
      if (response.otp_required) {
        // Trigger OTP flow
        setOtpData({
          sessionId: response.session_id,
          expiresAt: response.expires_at,
          remainingAttempts: response.remaining_attempts,
          timeRemainingSeconds: response.time_remaining_seconds,
          email: data.email
        });
        setShowOTPModal(true);
      } else if (response.is_valid) {
        // Direct login without OTP
        setSession(response);
      }
    }
  };
  mutate(data, callbackReq);
});
```

### Session Creation
```typescript
const handleOTPSuccess = (data: any) => {
  // Create session with verified token
  setCookie('token', data.token, {
    maxAge: 60 * 60 * 3,  // 3 hours
    sameSite: 'strict',
    httpOnly: false,
    secure: true,
  });
  
  // Redirect based on account type and profile status
  if (data.account_type === 'employer') {
    location.href = data.has_profile ? '/dashboard' : '/setup-employer-profile';
  } else {
    location.href = data.has_profile ? '/apply-for-a-job' : '/setup-applicant-profile';
  }
};
```

## Troubleshooting

### Common Issues

1. **OTP Not Received**
   - Check spam/junk folder
   - Verify email address is correct
   - Check email service status
   - Resend after cooldown period

2. **Invalid OTP Code**
   - Ensure all 6 digits are entered
   - Check for typos
   - Verify code hasn't expired
   - Request new code if needed

3. **Session Expired**
   - OTP sessions expire after 5 minutes
   - User must restart login process
   - Previous session ID becomes invalid

4. **Too Many Attempts**
   - Maximum 5 attempts per session
   - Must request new OTP after limit reached
   - Implements security against brute force

## Configuration

### Environment Variables
```bash
# Backend API URL for OTP endpoints
NEXT_API_URL=https://api.example.com

# Session configuration
IRON_SESSION_PASSWORD=your-32-character-password
IRON_SESSION_COOKIE_NAME=yahshua-session
```

### Customization Options

#### Timing Configuration
```typescript
// Default OTP expiration (seconds)
const OTP_EXPIRATION = 300;  // 5 minutes

// Resend cooldown (seconds)
const RESEND_COOLDOWN = 30;  // 30 seconds

// Maximum attempts
const MAX_ATTEMPTS = 5;
```

#### UI Customization
```typescript
// Colors and styling can be modified in the component
const inputClassName = 'w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md';
const buttonClassName = 'bg-blue-600 hover:bg-blue-700 text-white';
```

## Testing

### Manual Testing Checklist
- [ ] Successful OTP verification flow
- [ ] Expired OTP handling
- [ ] Resend functionality
- [ ] Copy-paste functionality
- [ ] Keyboard navigation
- [ ] Remember device option
- [ ] Error states and messages
- [ ] Loading states
- [ ] Mobile responsiveness

### Test Scenarios
1. **Happy Path**: Valid credentials → OTP sent → Correct code → Login success
2. **Expired OTP**: Wait for expiration → Attempt verification → Handle error
3. **Invalid Code**: Enter wrong code → Verify error handling → Check attempts
4. **Resend Flow**: Request resend → Verify new code received → Use new code
5. **Network Error**: Simulate network failure → Verify error handling

## API Reference

### POST /api/login/otp/verify

Verifies the submitted OTP code.

**Request Body:**
```json
{
  "session_id": "string",
  "code": "string",
  "email": "string",
  "remember_device": "boolean"
}
```

**Success Response (200):**
```json
{
  "token": "string",
  "is_valid": true,
  "account_type": "string",
  "has_profile": "boolean",
  "message": "string",
  "has_pending_transaction": "boolean",
  "has_active_subscription": "boolean"
}
```

**Error Response (400/500):**
```json
{
  "detail": "string",
  "message": "string"
}
```

### POST /api/login/otp/resend

Resends a new OTP code for the session.

**Request Body:**
```json
{
  "session_id": "string"
}
```

**Success Response (200):**
```json
{
  "message": "string",
  "time_remaining_seconds": "number"
}
```

**Error Response (400/500):**
```json
{
  "detail": "string",
  "message": "string"
}
```

## Future Enhancements

### Planned Features
1. **SMS OTP Delivery**: Alternative to email delivery
2. **Authenticator App Support**: TOTP integration (Google Authenticator, Authy)
3. **Biometric Authentication**: Fingerprint/Face ID for mobile
4. **Backup Codes**: Recovery codes for account access
5. **Admin Controls**: Enable/disable OTP per user or organization

### Security Improvements
1. **IP-based verification**: Additional validation based on IP location
2. **Device fingerprinting**: Enhanced device recognition
3. **Adaptive authentication**: Risk-based OTP requirements
4. **Audit logging**: Comprehensive OTP activity logs

## Support

For issues or questions regarding OTP authentication:
1. Check the troubleshooting section above
2. Review backend logs for OTP generation/validation errors
3. Contact technical support with session ID and timestamp
4. Report bugs at https://github.com/ysc-hris/yahshua-hris-fe/issues