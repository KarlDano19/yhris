# Loops.so Integration Documentation

## Overview

This integration automatically syncs user data from YAHSHUA HRIS to Loops.so email marketing platform. It captures user registrations, profile updates, and sends relevant events to trigger email automation sequences.

## Features

- **Automatic User Sync**: New registrations are automatically synced to Loops
- **Profile Updates**: Employer profile completion triggers additional data sync
- **Event Tracking**: Login events and profile completion events for automation
- **Error Handling**: Graceful degradation when Loops is unavailable
- **Development Mode**: Enhanced logging and test components

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
LOOPS_API_KEY=your_loops_api_key_here
```

**Important**: Use `LOOPS_API_KEY` (not `NEXT_PUBLIC_LOOPS_API_KEY`) to keep the API key secure on the server side.

### API Key Setup

1. Log in to your [Loops.so dashboard](https://app.loops.so/)
2. Go to Settings > API Keys
3. Create a new API key with the following permissions:
   - Read contacts
   - Write contacts
   - Send events
4. Copy the API key and add it to your environment variables

## Integration Points

### 1. User Registration
**File**: `/src/components/pages/(all-layout)/register/Content.tsx`

When a user successfully registers:
- Creates/updates contact in Loops
- Captures full name properly (handles both Employer single name field and Applicant first/middle/last name fields)
- Sets user group as "YHRIS"
- Sets product as "YAHSHUA HRIS"
- Triggers `yhrisNewUser` event

### 2. Employer Profile Setup & Company Data Capture
**File**: `/src/components/pages/(auth)/employer/setup-employer-profile/Content.tsx`

When an employer completes their company profile:
- **Updates contact properties only** (no additional events created)
- Applies audience segmentation tags based on company profile
- Determines appropriate automation sequence
- Updates company information in contact fields

**Company Data Captured:**
- Company name, description, industry
- Number of employees (company size)
- Work setup (remote/hybrid/onsite)
- Location (country, city)
- Language and currency preferences

**Audience Segmentation:**
- Business size segments (Small/Medium/Enterprise)
- Industry segments (Technology, etc.)
- Work arrangement segments (Remote-first, Hybrid, Onsite)
- Geographic segments (Philippines market)

**Note**: Profile setup only updates contact properties. Events are only created during registration.

## Data Mapping

### Contact Fields

| HRIS Field | Loops Field | Source |
|------------|-------------|---------|
| email | email | Registration, Profile Setup |
| name (full name) | name | Registration, Profile Setup |
| companyName | company | Profile Setup |
| - | userGroup | Always "YAHSHUA HRIS" |
| - | product | Always "YHRIS" |
| - | source | Form identifier |

### Events

| Event Name | Trigger | Data Included |
|------------|---------|---------------|
| `yhrisNewUser` | Registration success | accountType, registrationDate, source: 'registration' |

## Audience Segmentation

The integration automatically segments contacts based on their company profile data:

### Business Size Segments
- **Small Business**: 1-50 employees (`isSmallBusiness: true`)
- **Medium Business**: 51-500 employees (`isMediumBusiness: true`)
- **Enterprise**: 500+ employees (`isEnterprise: true`)

### Industry Segments
- **Technology Companies**: Tech/Software/IT industry (`isTechCompany: true`)

### Work Arrangement Segments
- **Remote-First**: Companies with remote work setup (`isRemoteFirst: true`)
- **Hybrid**: Companies with hybrid work setup (`isHybrid: true`)
- **Onsite**: Companies with office-based work setup (`isOnsite: true`)

### Geographic Segments
- **Philippines Market**: Companies based in Philippines (`isPhilippines: true`)

### Automation Sequences
Based on company profile, contacts are assigned to appropriate email sequences:
- `small-business-onboarding` (1-50 employees)
- `medium-business-onboarding` (51-500 employees)
- `enterprise-onboarding` (500+ employees)
- `tech-company-onboarding` (Technology industry)
- `general-onboarding` (Default fallback)

## Usage Examples

### Manual Sync
```typescript
import { useLoopsSync } from '@/helpers/useLoopsSync';

function MyComponent() {
  const { syncToLoops, updateContact } = useLoopsSync();
  
  const handleSync = () => {
    syncToLoops({
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      userGroup: 'YHRIS',
      product: 'YAHSHUA HRIS',
      accountType: 'employer',
      source: 'manual',
    });
  };

  const handleUpdate = () => {
    updateContact({
      email: 'user@example.com',
      properties: {
        company: 'New Company Name',
        source: 'profile-update',
      }
    });
  };
}
```

### Send Custom Event
```typescript
import { useLoopsSync } from '@/helpers/useLoopsSync';

function MyComponent() {
  const { sendEvent } = useLoopsSync();
  
  const handleCustomEvent = () => {
    sendEvent({
      email: 'user@example.com',
      eventName: 'subscription_purchased',
      properties: {
        planType: 'premium',
        amount: 99.99,
      }
    });
  };
}
```

## Testing

### Test Component
A test component is available at `/src/components/LoopsTestComponent.tsx`. Add it to any page during development:

```typescript
import LoopsTestComponent from '@/components/LoopsTestComponent';

function DashboardPage() {
  return (
    <div>
      {process.env.NODE_ENV === 'development' && <LoopsTestComponent />}
      {/* Your other components */}
    </div>
  );
}
```

### Manual Testing
1. Set up your Loops API key
2. Add the test component to a page
3. Use the test interface to verify integration
4. Check browser console for detailed logs
5. Verify data appears in your Loops dashboard

## Error Handling

The integration includes robust error handling:

- **Missing API Key**: Logs warning and continues without syncing
- **API Errors**: Logs error details and returns false
- **Network Issues**: Gracefully degrades without breaking user flow
- **Development Mode**: Enhanced logging for debugging

## Configuration Options

All configuration is centralized in `/src/lib/loopsConfig.ts`:

```typescript
export const LOOPS_CONFIG = {
  FEATURES: {
    ENABLED: true, // Automatically enabled when API key is present
    LOG_ERRORS: true, // Enhanced logging in development
    AUTO_SYNC_REGISTRATION: true,
    AUTO_SYNC_PROFILE_UPDATES: true,
    TRACK_LOGIN_EVENTS: true,
  }
};
```

## Security Considerations

- API key is stored as environment variable
- All requests use HTTPS
- No sensitive data is logged in production
- Graceful degradation when service unavailable

## Troubleshooting

### Common Issues

1. **Data not appearing in Loops**
   - Check API key configuration
   - Verify browser console for errors
   - Test with LoopsTestComponent

2. **Console errors about API key**
   - Ensure `NEXT_PUBLIC_LOOPS_API_KEY` is set
   - Restart development server after adding env var

3. **Events not triggering**
   - Check event names match Loops configuration
   - Verify contact exists before sending events

### Debug Mode

Set `NODE_ENV=development` to enable:
- Detailed console logging
- Error messages
- Success confirmations

## API Reference

### Main Service
- `loopsService.createOrUpdateContact(contact)`
- `loopsService.updateContact(email, properties)`
- `loopsService.sendEvent(email, eventName, properties)`

### Hook
- `useLoopsSync()` - Returns sync functions and loading state

### Utilities
- `syncUserRegistration(userData)` - High-level registration sync
- `syncEmployerProfile(profileData)` - High-level profile sync
- `trackUserLogin(email, accountType)` - Track login event

## Support

For issues with this integration:
1. Check this documentation
2. Review browser console logs
3. Test with the provided test component
4. Verify Loops.so API key permissions
