# TypeScript Type Definitions

## Overview

The application uses comprehensive TypeScript type definitions to ensure type safety across all components, API interactions, and business logic. Types are organized in the `/src/types/` directory and provide strong typing for the HRIS domain.

## Core Type Structure

### Session and Authentication Types

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

### User Management Types

#### Login & Registration
```typescript
export type T_Login = {
  email: string;
  password: string;
};

export type T_Register = {
  accountType: string;
  name: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type T_UserPassword = {
  password: string;
  confirmPassword: string;
  code: string;
};
```

#### Profile Types
```typescript
export type T_EmployerProfile = {
  companyName: string;
  companyLogo: Blob;
  companyDescription: string;
  typeOfIndustry: string;
  noOfEmployees: string;
  workSetUp: string;
  email: string;
  mobileNumber: string;
  landlineNumber: string;
  building: string;
  street: string;
  locality: string;
  city: string;
  zipCode: string;
  country: string;
  language: string;
  currency: string;
  imagePath: any;
};

export type T_ApplicantProfile = {
  id: number;
  userId: number;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  about: string;
  imagePath: string;
  profilePicture: string;
  birthDay: any;
  age: number;
  gender: string;
  religion: string;
  nationality: string;
  civilStatus: string;
  address: string;
  mobile: string;
  landLineNo: string;
  contactPersonName: string;
  contactPersonAddress: string;
  contactPersonContactNo: string;
  contactPersonRelationship: string;
  contactPersonAge: number;
};
```

### Job Management Types

#### Job Creation
```typescript
export type T_CreateJob = {
  id: number;
  JobNo: string;
  country: string;
  isActive: boolean;
  language: string;
  jobTitle: string;
  placeAdvertise: string;
  jobType: string[];
  schedule: string[];
  hireCount: number;
  hireDate: string;
  salary: {
    salaryType: string;
    salaryValue: string;
  };
  rate: string;
  benefits: string[];
  jobDescription: string;
  qualifications: string;
  jobDescriptionFile: File;
  postAs: string;
  postAsUpload: File;
  postIn: string[];
};

export type T_ApplyJob = {
  applicantId: number;
  jobStageId: number;
  status: string;
};
```

### Employee Management Types

#### Employee Separation
```typescript
export type T_Separation = {
  date: string;
  name: string;
  position: string;
  department: string;
  reason: string;
};

export type T_SeparationEmail = {
  id: string;
  actionType: string;
  emailType: string;
  dateReceived?: any;
  separationLetter: any;
  signDocuments: any;
  quitClaim: any;
  dateReceived: any;
  lastPay: any;
};
```

#### Employee Orientation
```typescript
export type T_ApplicantOrientEmail = {
  id?: string;
  is_contract_sent?: boolean;
  is_contract_received?: boolean;
  contract_received_date?: string;
  is_orientation_completed?: boolean;
  is_introduction_sent?: boolean;
  is_enrolled?: boolean;
};
```

### Document Management Types

#### Email Templates
```typescript
export type EmailTemplate = {
  subject: string;
  to: string;
  cc: string;
  bcc: string;
  body: string;
  attachment: string;
};

export type T_NTEForm = {
  template: string;
  subject?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  message: string;
};
```

#### Directives and Policies
```typescript
export type T_Directive = {
  type: string;
  title: string;
  email: string[];
  withResponse: boolean;
  file: Array | never;
  body: string;
  name: string;
  position: string;
  signature: string | File;
  qrCode: any;
  policyField: T_PolicyField[];
  eligibility: string;
  application: string;
  coverage: string;
  termination: string;
  purpose: string;
  policy: string;
  procedure: string;
};

export type T_PolicyField = {
  inputLabel: string;
  inputName: string;
};

export type T_Benefit = {
  title: string;
  email: string[];
  purpose: string;
  benefits: string;
  coverage: string;
  eligibility: string;
  cc: string[];
  bcc: string[];
};
```

### Incident Management Types

```typescript
export type T_IncidentReport = {
  name: string;
  position: string;
  department: string;
  incidentDate: string;
  incidentPlace: string;
  briefBackground: string;
};

export type T_Investigation = {
  employee_issue: string;
  date: string;
  presider: string;
  witness: string;
  resultOfInvestigation: string;
  decision: string;
  other: string;
  isAttendHearing: string;
  briefBackground: string;
  attachments: File;
};

export type T_IncidentReportEmail = {
  id: string;
  actionType: string;
  emailType: string;
  issueNTEForm: T_NTEForm;
  sendDecisionForm: any;
  dateReceived: any;
  // NTE fields
  nte_subject: string;
  nte_to: string;
  nte_cc: string;
  nte_bcc: string;
  nte_message: string;
  // Decision fields
  decision_subject: string;
  decision_to: string;
  decision_cc: string;
  decision_bcc: string;
  decision_message: string;
};
```

### Modal Types

```typescript
export type T_LetterModal = {
  type: acceptance | separation;
  id: number;
};

export type T_DocumentsModal = {
  isOpen: boolean;
  id: number;
};

export type T_LastPayModal = {
  isOpen: boolean;
  id: number;
};

export type T_QuitclaimModal = {
  isOpen: boolean;
  id: number;
};

export type T_DeleteSepartionModal = {
  open: boolean;
  id: number;
  name: string;
};

export type T_JobPreviewModal = {
  isOpen: boolean;
  id: number | null;
};

export type T_SendNTEModal = {
  id: number;
  attachment?: string;
};

export type T_SendDecisionModal = {
  isOpen: boolean;
  id: number;
};

export type T_InvestigationModal = {
  isOpen: boolean;
  id: number;
};

export type T_InvestigationReportDetailsModal = {
  isOpen: boolean;
  id: number;
};

export type T_UploadEmployeeIssueAttachmentModal = {
  isOpen: boolean;
  id: number;
};

export type T_NTEAttachmentViewModal = {
  isOpen: boolean;
  id: number;
};

export type T_DecisionAttachmentViewModal = {
  isOpen: boolean;
  id: number;
};

export type T_DesignBenefitsModal = {
  isOpen: boolean;
  id: number;
};
```

### Payment and Subscription Types

```typescript
export type T_Payment = {
  users: string;
  path: string;
  url: string;
  additional_employees: number;
  plan_id: number;
  payment_id: number;
  subscription_type: string;
  periodicity: string;
  periodicity_duration: string;
  voucher_code: string;
};

export type Voucher = {
  id: number;
  code: string;
  discount: string;
  applied_plan: string;
  no_of_employees: string;
  redeemed: boolean;
  redemption_count: {
    id: number;
    name: string;
    plan: string;
    date: string;
  }[];
  redemption_from: string;
  redemption_to: string;
  prepared_by: string;
};
```

### Data Export Types

```typescript
export type T_ExportAgreement = {
  is_export_agree: boolean;
};

export interface CachedProfileData {
  is_export_agreed: boolean;
}
```

## Extended Type Definitions

### API Response Types

```typescript
// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Pagination wrapper
export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  page_size: number;
}

// Error response
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}
```

### Form Types

```typescript
// Generic form state
export interface FormState<T> {
  data: T;
  errors: Record<keyof T, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Form field configuration
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: (value: any) => string | null;
}

// Dynamic form configuration
export interface DynamicForm {
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  onSubmit: (data: Record<string, any>) => Promise<void>;
}
```

### Table and List Types

```typescript
// Table column configuration
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Sort configuration
export interface SortConfig<T> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}

// Filter configuration
export interface FilterConfig {
  [key: string]: any;
}

// List view props
export interface ListViewProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string;
  sortConfig?: SortConfig<T>;
  onSort?: (key: keyof T) => void;
  onRowClick?: (row: T) => void;
  onRowSelect?: (selectedRows: T[]) => void;
  selectable?: boolean;
}
```

### Component Props Types

```typescript
// Modal props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
}

// Button props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

// Input props
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}
```

### Business Logic Types

```typescript
// Employee status
export type EmployeeStatus = 'active' | 'inactive' | 'terminated' | 'on_leave';

// Job status
export type JobStatus = 'draft' | 'published' | 'closed' | 'expired';

// Application status
export type ApplicationStatus = 'pending' | 'reviewing' | 'interviewing' | 'offered' | 'hired' | 'rejected';

// Document status
export type DocumentStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'expired';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Permission levels
export type PermissionLevel = 'read' | 'write' | 'admin' | 'owner';

// User roles
export type UserRole = 'applicant' | 'employer' | 'admin' | 'super_admin';
```

### Utility Types

```typescript
// Make all properties optional except specified ones
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Make specified properties required
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Extract array element type
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Create a type with only the keys that have string values
export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

// Deep partial type
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Type-safe key-value pair
export type KeyValuePair<T, K extends keyof T> = {
  key: K;
  value: T[K];
};
```

### Hook Types

```typescript
// Query hook return type
export interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isRefetching: boolean;
}

// Mutation hook return type
export interface MutationResult<T, V> {
  mutate: (variables: V) => void;
  mutateAsync: (variables: V) => Promise<T>;
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

// Pagination hook return type
export interface PaginationResult {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
}
```

## Type Guards and Validators

```typescript
// Type guards
export const isEmployerProfile = (profile: any): profile is T_EmployerProfile => {
  return profile && typeof profile.companyName === 'string';
};

export const isApplicantProfile = (profile: any): profile is T_ApplicantProfile => {
  return profile && typeof profile.firstname === 'string';
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Runtime type validation
export const validateUserRole = (role: string): role is UserRole => {
  return ['applicant', 'employer', 'admin', 'super_admin'].includes(role);
};

export const validateEmployeeStatus = (status: string): status is EmployeeStatus => {
  return ['active', 'inactive', 'terminated', 'on_leave'].includes(status);
};
```

## Best Practices

### Type Definition Guidelines

1. **Descriptive Names**: Use clear, descriptive names for types
2. **Consistent Prefixes**: Use `T_` prefix for domain types, `I_` for interfaces
3. **Composition**: Compose complex types from simpler ones
4. **Generics**: Use generics for reusable type patterns
5. **Documentation**: Document complex types with JSDoc comments

### Type Safety Patterns

```typescript
// Use const assertions for better type inference
const statuses = ['active', 'inactive', 'terminated'] as const;
export type EmployeeStatus = typeof statuses[number];

// Use branded types for IDs
export type UserId = string & { __brand: 'UserId' };
export type JobId = string & { __brand: 'JobId' };

// Use discriminated unions for polymorphic data
export type ApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Use mapped types for transformations
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Optional<T, K extends keyof T> = {
  [P in K]?: T[P];
} & {
  [P in Exclude<keyof T, K>]: T[P];
};
```

### Error Handling Types

```typescript
// Result type for error handling
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Safe async wrapper
export const safeAsync = async <T>(
  fn: () => Promise<T>
): Promise<Result<T>> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
};
```

This comprehensive type system ensures type safety throughout the application and provides excellent developer experience with IntelliSense support.
