# Development Guide

## Quick Start

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Installation

```bash
# Clone the repository
git clone https://github.com/yahshua/hris-frontend.git
cd yahshua-hris-fe

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Development Server

The development server runs on `http://localhost:3000` with:
- Hot reloading for instant feedback
- TypeScript compilation
- Error overlay for debugging
- API proxy configuration

## Development Workflow

### 1. Environment Setup

#### Required Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NODE_ENV=development

# Optional for full functionality
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_id
```

#### VS Code Configuration

Install recommended extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter

### 2. Project Structure Navigation

```
src/
├── app/                    # Next.js App Router
│   ├── (all-layout)/      # Shared layouts
│   ├── (auth)/            # Protected routes
│   ├── (un-auth)/         # Public routes
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── hooks/            # Custom hooks
│   └── pages/            # Page components
├── helpers/              # Utility functions
├── lib/                  # Core libraries
├── types/               # TypeScript definitions
└── svg/                 # SVG components
```

### 3. Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint

# Code Quality
npm run type-check      # TypeScript validation
npm run format          # Prettier formatting
npm run analyze         # Bundle analysis

# Testing
npm run test            # Run unit tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run e2e             # End-to-end tests
```

## Coding Standards

### TypeScript Guidelines

#### Type Definitions
```typescript
// Use interfaces for object shapes
interface UserProfile {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Use type aliases for unions and primitives
type Status = 'active' | 'inactive' | 'pending';
type UserId = string;

// Use generics for reusable types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

#### Component Props
```typescript
// Always define prop interfaces
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### React Best Practices

#### Component Organization
```typescript
// Component file structure
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Types
interface Props {
  userId: string;
}

// Hooks
import useGetUserProfile from '@/components/hooks/useGetUserProfile';

// Component
export default function UserProfile({ userId }: Props) {
  // State
  const [isEditing, setIsEditing] = useState(false);
  
  // Queries
  const { data: profile, isLoading } = useGetUserProfile(userId);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [userId]);
  
  // Event handlers
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  // Render
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

#### Hooks Pattern
```typescript
// Custom hooks for business logic
function useEmployeeManager(departmentId: string) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  const { data: employees, isLoading } = useGetEmployeeItems();
  
  const departmentEmployees = useMemo(() => 
    employees?.filter(emp => emp.departmentId === departmentId) || [],
    [employees, departmentId]
  );
  
  const selectEmployee = useCallback((employeeId: string) => {
    setSelectedEmployees(prev => [...prev, employeeId]);
  }, []);
  
  return {
    employees: departmentEmployees,
    selectedEmployees,
    selectEmployee,
    isLoading,
  };
}
```

### Styling Guidelines

#### Tailwind CSS Patterns
```typescript
// Use consistent spacing scale
const spacing = {
  xs: 'p-2',     // 8px
  sm: 'p-3',     // 12px
  md: 'p-4',     // 16px
  lg: 'p-6',     // 24px
  xl: 'p-8',     // 32px
};

// Component styling
function Card({ children, size = 'md' }: CardProps) {
  const baseClasses = 'bg-white rounded-lg shadow-sm border';
  const sizeClasses = spacing[size];
  
  return (
    <div className={`${baseClasses} ${sizeClasses}`}>
      {children}
    </div>
  );
}
```

#### Responsive Design
```typescript
// Mobile-first approach
<div className="
  flex flex-col          // Mobile: column
  sm:flex-row           // Small screens+: row
  gap-4                 // All screens: gap
  p-4                   // All screens: padding
  sm:p-6               // Small screens+: larger padding
">
```

## API Integration

### Custom Hooks Pattern

```typescript
// Query hook
function useGetEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const token = getCookie('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Mutation hook
function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (employeeData: CreateEmployeeData) => {
      const token = getCookie('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create employee');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch employees
      queryClient.invalidateQueries(['employees']);
    },
  });
}
```

### Error Handling

```typescript
// Global error handler
function ApiErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600 mt-2">{error.message}</p>
          <button
            onClick={resetErrorBoundary}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}
      onError={(error) => {
        console.error('API Error:', error);
        // Send to error tracking service
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

## State Management

### Zustand Store Pattern

```typescript
// Store definition
interface AppStore {
  // State
  user: User | null;
  isLoading: boolean;
  notifications: Notification[];
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  notifications: [],
  
  // Actions
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  addNotification: (notification) => 
    set((state) => ({
      notifications: [...state.notifications, notification]
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
}));
```

### Form State Management

```typescript
// React Hook Form pattern
function EmployeeForm({ employee, onSubmit }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<EmployeeFormData>({
    defaultValues: employee || {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
    },
  });
  
  const departmentValue = watch('department');
  
  const onFormSubmit = async (data: EmployeeFormData) => {
    try {
      await onSubmit(data);
      toast.success('Employee saved successfully');
    } catch (error) {
      toast.error('Failed to save employee');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <input
        {...register('firstName', { required: 'First name is required' })}
        placeholder="First Name"
      />
      {errors.firstName && (
        <span className="text-red-500">{errors.firstName.message}</span>
      )}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

## Testing Strategy

### Unit Testing

```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmployeeCard from './EmployeeCard';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function renderWithProviders(component: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
}

describe('EmployeeCard', () => {
  const mockEmployee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    department: 'Engineering',
  };
  
  test('displays employee information', () => {
    renderWithProviders(<EmployeeCard employee={mockEmployee} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });
  
  test('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    renderWithProviders(
      <EmployeeCard employee={mockEmployee} onEdit={onEdit} />
    );
    
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockEmployee);
  });
});
```

### Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetEmployees from './useGetEmployees';

describe('useGetEmployees', () => {
  test('fetches employees successfully', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
    
    const { result } = renderHook(() => useGetEmployees(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toBeDefined();
  });
});
```

## Performance Optimization

### Code Splitting

```typescript
// Route-based code splitting
import { lazy, Suspense } from 'react';

const EmployeeManagement = lazy(() => import('./EmployeeManagement'));
const JobPosting = lazy(() => import('./JobPosting'));

function Dashboard() {
  const [activeTab, setActiveTab] = useState('employees');
  
  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab('employees')}>Employees</button>
        <button onClick={() => setActiveTab('jobs')}>Jobs</button>
      </nav>
      
      <Suspense fallback={<div>Loading...</div>}>
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'jobs' && <JobPosting />}
      </Suspense>
    </div>
  );
}
```

### Memoization

```typescript
// Component memoization
const EmployeeCard = React.memo(({ employee, onEdit }: EmployeeCardProps) => {
  return (
    <div className="p-4 border rounded">
      <h3>{employee.name}</h3>
      <p>{employee.email}</p>
      <button onClick={() => onEdit(employee)}>Edit</button>
    </div>
  );
});

// Callback memoization
function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  const handleEdit = useCallback((employee: Employee) => {
    // Edit logic
  }, []);
  
  return (
    <div>
      {employees.map(employee => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}
```

### Image Optimization

```typescript
// Next.js Image component
import Image from 'next/image';

function UserAvatar({ user }: { user: User }) {
  return (
    <Image
      src={user.profilePicture || '/default-avatar.png'}
      alt={`${user.name} avatar`}
      width={64}
      height={64}
      className="rounded-full"
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

## Debugging

### Development Tools

#### React Developer Tools
- Component tree inspection
- Props and state debugging
- Performance profiling

#### TanStack Query DevTools
```typescript
// Enable in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
}
```

#### Redux DevTools (if using Redux)
```typescript
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
```

### Error Debugging

#### Console Debugging
```typescript
// Conditional logging
const debug = process.env.NODE_ENV === 'development';

function debugLog(message: string, data?: any) {
  if (debug) {
    console.log(`[DEBUG] ${message}`, data);
  }
}

// Usage
debugLog('User profile loaded', userProfile);
```

#### Error Boundary with Logging
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}
```

## Git Workflow

### Branch Strategy

```bash
# Feature development
git checkout -b feature/employee-management
git commit -m "feat: add employee CRUD operations"
git push origin feature/employee-management

# Hotfix
git checkout -b hotfix/login-bug
git commit -m "fix: resolve login redirect issue"
git push origin hotfix/login-bug
```

### Commit Messages

Follow conventional commits:
```bash
feat: add new employee form component
fix: resolve date picker validation issue
docs: update API integration guide
style: improve button hover states
refactor: extract common form validation logic
test: add unit tests for user hooks
chore: update dependencies
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Common Issues and Solutions

### TypeScript Issues

```typescript
// Problem: Type assertion needed
const userInput = event.target.value as string;

// Solution: Type guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

if (isString(event.target.value)) {
  // TypeScript knows value is string here
}
```

### React Query Issues

```typescript
// Problem: Stale data showing
// Solution: Proper cache invalidation
const { mutate } = useMutation({
  mutationFn: updateEmployee,
  onSuccess: () => {
    queryClient.invalidateQueries(['employees']);
    queryClient.invalidateQueries(['employee', employeeId]);
  },
});
```

### State Management Issues

```typescript
// Problem: State updates not reflecting
// Solution: Immutable updates
const [employees, setEmployees] = useState<Employee[]>([]);

// Wrong
employees.push(newEmployee);
setEmployees(employees);

// Correct
setEmployees(prev => [...prev, newEmployee]);
```

### Performance Issues

```typescript
// Problem: Unnecessary re-renders
// Solution: Proper dependency arrays
useEffect(() => {
  fetchData();
}, [id]); // Only re-run when id changes

// Problem: Heavy computations on every render
// Solution: useMemo
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);
```

### Styling Issues

```typescript
// Problem: Inconsistent spacing
// Solution: Use design tokens
const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
};

// Problem: Complex conditional classes
// Solution: Use clsx or classNames utility
import classNames from '@/helpers/classNames';

const buttonClasses = classNames(
  'px-4 py-2 rounded',
  variant === 'primary' && 'bg-blue-500 text-white',
  variant === 'secondary' && 'bg-gray-200 text-gray-800',
  isLoading && 'opacity-50 cursor-not-allowed'
);
```

## Best Practices Summary

### Code Quality
1. **Type Everything**: Use TypeScript for all components and functions
2. **Test Coverage**: Aim for 80%+ test coverage
3. **Error Handling**: Implement comprehensive error boundaries
4. **Performance**: Profile and optimize regularly
5. **Accessibility**: Follow WCAG guidelines

### Development Process
1. **Small Commits**: Make frequent, small commits with clear messages
2. **Code Reviews**: All code should be reviewed before merging
3. **Documentation**: Keep documentation up to date
4. **Refactoring**: Regularly refactor to maintain code quality
5. **Monitoring**: Monitor application performance and errors

### Team Collaboration
1. **Consistent Style**: Use Prettier and ESLint configurations
2. **Shared Components**: Build reusable component library
3. **API Contracts**: Document and version API interfaces
4. **Knowledge Sharing**: Regular code reviews and team discussions
5. **Documentation**: Maintain comprehensive documentation
