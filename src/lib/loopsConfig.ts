/**
 * Loops.so Configuration
 * Centralized configuration for Loops integration
 */

export const LOOPS_CONFIG = {
  // Loops API Configuration
  API_BASE_URL: 'https://app.loops.so/api/v1',
  
  // Default values for YAHSHUA HRIS
  DEFAULT_VALUES: {
    product: 'YHRIS',
    userGroup: 'YAHSHUA HRIS',
  },
  
  // Event names for automation triggers
  EVENTS: {
    YHRIS_NEW_USER: 'yhrisNewUser', // Main event for user registration and profile completion
    USER_REGISTERED: 'user_registered', // Legacy - keeping for reference
    USER_LOGIN: 'user_login',
    EMPLOYER_PROFILE_COMPLETED: 'employer_profile_completed', // Legacy
    APPLICANT_PROFILE_COMPLETED: 'applicant_profile_completed',
    COMPANY_PROFILE_UPDATED: 'company_profile_updated',
    SUBSCRIPTION_PURCHASED: 'subscription_purchased',
    FIRST_JOB_POSTED: 'first_job_posted',
    FIRST_APPLICATION_RECEIVED: 'first_application_received',
  },
  
  // Source identifiers
  SOURCES: {
    REGISTRATION: 'registration',
    LOGIN: 'login',
    SETUP_EMPLOYER_PROFILE: 'setup-employer-profile',
    SETUP_APPLICANT_PROFILE: 'setup-applicant-profile',
    DASHBOARD: 'dashboard',
    JOB_POSTING: 'job-posting',
    APPLICATION: 'application',
  },
  
  // Account types
  ACCOUNT_TYPES: {
    EMPLOYER: 'employer',
    APPLICANT: 'applicant',
    ADMIN: 'admin',
  },
  
  // Configuration flags
  FEATURES: {
    ENABLED: true, // Always enabled now since we use server-side API routes
    LOG_ERRORS: process.env.NODE_ENV === 'development', // Only log in development
    AUTO_SYNC_REGISTRATION: true,
    AUTO_SYNC_PROFILE_UPDATES: true,
    TRACK_LOGIN_EVENTS: false, // Simplified - no login tracking
  },
} as const;

/**
 * Utility function to check if Loops integration is enabled
 */
export function isLoopsEnabled(): boolean {
  return LOOPS_CONFIG.FEATURES.ENABLED;
}

/**
 * Get formatted contact data with defaults
 */
export function formatContactData(data: any) {
  return {
    email: data.email,
    firstName: data.firstName || data.first_name,
    lastName: data.lastName || data.last_name,
    userId: data.userId || data.user_id?.toString(),
    userGroup: LOOPS_CONFIG.DEFAULT_VALUES.userGroup,
    product: LOOPS_CONFIG.DEFAULT_VALUES.product,
    company: data.company || data.company_name,
    accountType: data.accountType || data.account_type,
    signupDate: data.signupDate || new Date().toISOString(),
  };
}
