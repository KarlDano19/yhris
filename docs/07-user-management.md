# User Management Documentation

## Overview

The Yahshua HRIS application implements a comprehensive multi-role user management system supporting employers, applicants, and administrators. Each user type has distinct capabilities, access controls, and workflows.

## User Roles and Permissions

### Role Hierarchy

```typescript
export type UserRole = 'applicant' | 'employer' | 'admin' | 'super_admin';

interface UserPermissions {
  canCreateJobs: boolean;
  canManageEmployees: boolean;
  canViewReports: boolean;
  canManageSystem: boolean;
  canAccessFinancials: boolean;
}

const rolePermissions: Record<UserRole, UserPermissions> = {
  applicant: {
    canCreateJobs: false,
    canManageEmployees: false,
    canViewReports: false,
    canManageSystem: false,
    canAccessFinancials: false,
  },
  employer: {
    canCreateJobs: true,
    canManageEmployees: true,
    canViewReports: true,
    canManageSystem: false,
    canAccessFinancials: true,
  },
  admin: {
    canCreateJobs: false,
    canManageEmployees: false,
    canViewReports: true,
    canManageSystem: true,
    canAccessFinancials: false,
  },
  super_admin: {
    canCreateJobs: true,
    canManageEmployees: true,
    canViewReports: true,
    canManageSystem: true,
    canAccessFinancials: true,
  },
};
```

### Access Control Implementation

```typescript
// Permission checking hook
function usePermissions() {
  const { data: userRights } = useGetRights();
  
  const hasPermission = useCallback((permission: keyof UserPermissions): boolean => {
    return userRights?.[permission] || false;
  }, [userRights]);
  
  const requirePermission = useCallback((permission: keyof UserPermissions) => {
    if (!hasPermission(permission)) {
      throw new Error(`Access denied: Missing ${permission} permission`);
    }
  }, [hasPermission]);
  
  return {
    hasPermission,
    requirePermission,
    permissions: userRights,
  };
}

// Usage in components
function JobPostingButton() {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission('canCreateJobs')) {
    return null;
  }
  
  return <Button>Create Job</Button>;
}
```

## User Authentication Flow

### Registration Process

```typescript
interface RegistrationFlow {
  step1: AccountTypeSelection;
  step2: BasicInformation;
  step3: EmailVerification;
  step4: ProfileSetup;
}

// Registration implementation
function useRegistration() {
  const [currentStep, setCurrentStep] = useState<keyof RegistrationFlow>('step1');
  const [registrationData, setRegistrationData] = useState<Partial<T_Register>>({});
  
  const { mutate: register } = useMutation({
    mutationFn: async (data: T_Register) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Send verification email
      sendVerificationEmail(data.email);
      setCurrentStep('step3');
    },
  });
  
  const completeRegistration = useCallback((finalData: Partial<T_Register>) => {
    const completeData = { ...registrationData, ...finalData };
    register(completeData);
  }, [registrationData, register]);
  
  return {
    currentStep,
    setCurrentStep,
    registrationData,
    setRegistrationData,
    completeRegistration,
  };
}
```

### Login and Session Management

```typescript
// Enhanced login with session handling
function useLogin() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (credentials: T_Login) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Update session state
      updateSession(data.sessionData);
      
      // Set authentication cookie
      setCookie('token', data.token, {
        maxAge: 24 * 60 * 60, // 24 hours
        httpOnly: false, // Accessible to client for API calls
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      
      // Redirect based on role and profile status
      handlePostLoginRedirect(data);
    },
  });
}

function handlePostLoginRedirect(userData: any) {
  const { accountType, hasProfile, hasActiveSubscription } = userData;
  
  switch (accountType) {
    case 'admin':
      router.push('/admin/dashboard');
      break;
      
    case 'employer':
      if (!hasProfile) {
        router.push('/setup-employer-profile');
      } else if (!hasActiveSubscription) {
        router.push('/checkout');
      } else {
        router.push('/dashboard');
      }
      break;
      
    case 'applicant':
      if (!hasProfile) {
        router.push('/setup-applicant-profile');
      } else {
        router.push('/apply-for-a-job');
      }
      break;
      
    default:
      router.push('/login');
  }
}
```

## Profile Management

### Employer Profile Management

```typescript
interface EmployerProfileManager {
  profile: T_EmployerProfile | null;
  isLoading: boolean;
  updateProfile: (data: Partial<T_EmployerProfile>) => Promise<void>;
  uploadLogo: (file: File) => Promise<string>;
  validateProfile: () => ValidationResult;
}

function useEmployerProfile(): EmployerProfileManager {
  const { data: profile, isLoading } = useGetEmployerProfile();
  const queryClient = useQueryClient();
  
  const { mutate: updateProfileMutation } = useMutation({
    mutationFn: async (data: Partial<T_EmployerProfile>) => {
      const token = getCookie('token');
      const response = await fetch('/api/employers/profiles/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employerProfileCache']);
      toast.success('Profile updated successfully');
    },
  });
  
  const uploadLogo = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('logo', file);
    
    const token = getCookie('token');
    const response = await fetch('/api/employers/upload-logo/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload logo');
    }
    
    const data = await response.json();
    return data.logoUrl;
  }, []);
  
  const validateProfile = useCallback((): ValidationResult => {
    if (!profile) {
      return { isValid: false, errors: ['Profile not found'] };
    }
    
    const errors: string[] = [];
    
    if (!profile.companyName) errors.push('Company name is required');
    if (!profile.email) errors.push('Email is required');
    if (!profile.mobileNumber) errors.push('Mobile number is required');
    if (!profile.typeOfIndustry) errors.push('Industry type is required');
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [profile]);
  
  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation,
    uploadLogo,
    validateProfile,
  };
}
```

### Applicant Profile Management

```typescript
function useApplicantProfile() {
  const { data: profile, isLoading } = useGetApplicantProfile();
  const queryClient = useQueryClient();
  
  const { mutate: updateProfile } = useMutation({
    mutationFn: async (data: Partial<T_ApplicantProfile>) => {
      const token = getCookie('token');
      const response = await fetch('/api/applicants/profiles/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['applicantProfileCache']);
    },
  });
  
  const uploadResume = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const token = getCookie('token');
    const response = await fetch('/api/applicants/upload-resume/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });
    
    return response.json();
  }, []);
  
  return {
    profile,
    isLoading,
    updateProfile,
    uploadResume,
  };
}
```

## User Administration

### Admin User Management

```typescript
interface AdminUserManager {
  users: User[];
  createUser: (userData: CreateUserData) => Promise<User>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  suspendUser: (userId: string, reason: string) => Promise<void>;
  activateUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  resetPassword: (userId: string) => Promise<void>;
}

function useAdminUserManager(): AdminUserManager {
  const { data: users = [] } = useGetUsers();
  const queryClient = useQueryClient();
  
  const { mutate: createUserMutation } = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await fetch('/api/admin/users/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${getCookie('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
  
  const { mutate: suspendUserMutation } = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/suspend/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${getCookie('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User suspended successfully');
    },
  });
  
  return {
    users,
    createUser: createUserMutation,
    suspendUser: (userId: string, reason: string) => 
      suspendUserMutation({ userId, reason }),
    // ... other methods
  };
}
```

### User Activity Monitoring

```typescript
interface UserActivity {
  userId: string;
  action: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

function useUserActivityMonitor() {
  const logActivity = useCallback(async (activity: Omit<UserActivity, 'timestamp' | 'userId'>) => {
    const token = getCookie('token');
    
    await fetch('/api/user-activity/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...activity,
        timestamp: new Date().toISOString(),
      }),
    });
  }, []);
  
  // Auto-log page visits
  useEffect(() => {
    logActivity({
      action: 'page_visit',
      ipAddress: '', // Will be filled by server
      userAgent: navigator.userAgent,
      metadata: {
        path: window.location.pathname,
        referrer: document.referrer,
      },
    });
  }, [logActivity]);
  
  return { logActivity };
}
```

## Account Security

### Password Management

```typescript
function usePasswordManagement() {
  const { mutate: changePassword } = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await fetch('/api/change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${getCookie('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
  });
  
  const { mutate: requestPasswordReset } = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Password reset email sent');
    },
  });
  
  return {
    changePassword,
    requestPasswordReset,
  };
}
```

### Two-Factor Authentication

```typescript
function useTwoFactorAuth() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  
  const { mutate: enableTwoFactor } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/2fa/enable/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${getCookie('token')}`,
        },
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      setQrCode(data.qrCode);
      setBackupCodes(data.backupCodes);
    },
  });
  
  const { mutate: verifyTwoFactor } = useMutation({
    mutationFn: async (token: string) => {
      const response = await fetch('/api/2fa/verify/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${getCookie('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Two-factor authentication enabled');
      setQrCode(null);
    },
  });
  
  return {
    qrCode,
    backupCodes,
    enableTwoFactor,
    verifyTwoFactor,
  };
}
```

## User Onboarding

### Progressive Profile Completion

```typescript
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  component: React.ComponentType;
}

function useOnboarding(userType: UserRole) {
  const employerSteps: OnboardingStep[] = [
    {
      id: 'company-info',
      title: 'Company Information',
      description: 'Tell us about your company',
      completed: false,
      required: true,
      component: CompanyInfoForm,
    },
    {
      id: 'subscription',
      title: 'Choose Subscription',
      description: 'Select a plan that fits your needs',
      completed: false,
      required: true,
      component: SubscriptionSelection,
    },
    {
      id: 'team-setup',
      title: 'Team Setup',
      description: 'Add your first employees',
      completed: false,
      required: false,
      component: TeamSetupForm,
    },
  ];
  
  const applicantSteps: OnboardingStep[] = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Complete your profile',
      completed: false,
      required: true,
      component: PersonalInfoForm,
    },
    {
      id: 'resume-upload',
      title: 'Upload Resume',
      description: 'Add your resume',
      completed: false,
      required: true,
      component: ResumeUpload,
    },
    {
      id: 'preferences',
      title: 'Job Preferences',
      description: 'Set your job preferences',
      completed: false,
      required: false,
      component: JobPreferencesForm,
    },
  ];
  
  const steps = userType === 'employer' ? employerSteps : applicantSteps;
  const [currentStep, setCurrentStep] = useState(0);
  
  const completeStep = useCallback((stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      steps[stepIndex].completed = true;
      
      // Move to next required incomplete step
      const nextStep = steps.findIndex(step => !step.completed && step.required);
      if (nextStep !== -1) {
        setCurrentStep(nextStep);
      }
    }
  }, [steps]);
  
  const progress = useMemo(() => {
    const completedRequired = steps.filter(step => step.completed && step.required).length;
    const totalRequired = steps.filter(step => step.required).length;
    return (completedRequired / totalRequired) * 100;
  }, [steps]);
  
  return {
    steps,
    currentStep,
    setCurrentStep,
    completeStep,
    progress,
    isComplete: progress === 100,
  };
}
```

## Data Export and Privacy

### GDPR Compliance

```typescript
function useDataExport() {
  const { mutate: requestDataExport } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/export-data/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${getCookie('token')}`,
        },
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Data export requested. You will receive an email when ready.');
    },
  });
  
  const { mutate: requestAccountDeletion } = useMutation({
    mutationFn: async (reason: string) => {
      const response = await fetch('/api/delete-account/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${getCookie('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Account deletion requested. This will be processed within 30 days.');
    },
  });
  
  return {
    requestDataExport,
    requestAccountDeletion,
  };
}
```

## Best Practices

### Security Implementation

1. **Password Policies**: Enforce strong password requirements
2. **Session Management**: Secure session handling with proper expiration
3. **Access Control**: Role-based permissions with principle of least privilege
4. **Audit Logging**: Track all user activities for security monitoring
5. **Data Protection**: Encrypt sensitive user data at rest and in transit

### User Experience

1. **Progressive Disclosure**: Show information progressively based on user role
2. **Contextual Help**: Provide help and guidance throughout the user journey
3. **Error Handling**: Clear error messages with actionable next steps
4. **Performance**: Optimize profile loading and updates for fast response
5. **Mobile Experience**: Responsive design for all user management features

### Scalability Considerations

1. **Caching Strategy**: Cache user profiles and permissions data
2. **Pagination**: Implement pagination for user lists in admin interface
3. **Search Optimization**: Efficient search across user data
4. **Batch Operations**: Support bulk user operations for admins
5. **Integration Points**: Design for integration with external identity providers

This user management system provides a robust foundation for the HRIS application with comprehensive role-based access control, security features, and scalability considerations.
