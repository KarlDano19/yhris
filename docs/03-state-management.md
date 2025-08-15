# State Management

## Overview

The application uses a hybrid approach to state management, leveraging different tools for different types of state:
- **TanStack Query (React Query)** for server state management
- **Zustand** for client-side application state
- **React Hook Form** for form state management

## TanStack Query (Server State)

### Configuration

```typescript
// src/app/reactQueryWrapper.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function ReactQueryWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 3,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Query Patterns

#### Data Fetching Hooks
The application follows a consistent pattern for API calls using custom hooks:

```typescript
// Example: useGetEmployeeItems.ts
import { useQuery } from '@tanstack/react-query';

export function useGetEmployeeItems() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      // API call implementation
      const response = await fetch('/api/employees');
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}
```

#### Mutation Hooks
For data modification operations:

```typescript
// Example mutation pattern
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (employeeData) => {
      const response = await fetch('/api/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries(['employees']);
    },
  });
}
```

### Query Keys Strategy

The application uses structured query keys for efficient caching:

```typescript
// Query key patterns
const queryKeys = {
  employees: ['employees'],
  employee: (id: string) => ['employees', id],
  employeesByDepartment: (dept: string) => ['employees', 'department', dept],
  
  jobs: ['jobs'],
  job: (id: string) => ['jobs', id],
  jobApplicants: (id: string) => ['jobs', id, 'applicants'],
  
  profiles: ['profiles'],
  employerProfile: ['profiles', 'employer'],
  applicantProfile: (id: string) => ['profiles', 'applicant', id],
};
```

## Zustand (Client State)

### Store Configuration

```typescript
// src/lib/store.ts
import { create } from 'zustand';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  currentModal: string | null;
  notifications: Notification[];
  
  // User State
  currentUser: User | null;
  preferences: UserPreferences;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setCurrentModal: (modal: string | null) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const useAppStore = create<AppState>()((set, get) => ({
  // Initial state
  sidebarOpen: false,
  currentModal: null,
  notifications: [],
  currentUser: null,
  preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
  },
  
  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentModal: (modal) => set({ currentModal: modal }),
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  setCurrentUser: (user) => set({ currentUser: user }),
  updatePreferences: (newPrefs) => set((state) => ({
    preferences: { ...state.preferences, ...newPrefs }
  })),
}));

export default useAppStore;
```

### Store Usage Patterns

```typescript
// Using the store in components
import useAppStore from '@/lib/store';

function Header() {
  const { sidebarOpen, setSidebarOpen, notifications } = useAppStore();
  
  return (
    <header>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        Toggle Sidebar
      </button>
      <NotificationIcon count={notifications.length} />
    </header>
  );
}
```

### Persistence (if needed)

```typescript
// Example with persistence
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePersistedStore = create(
  persist(
    (set, get) => ({
      preferences: { theme: 'light' },
      setPreferences: (prefs) => set({ preferences: prefs }),
    }),
    {
      name: 'yahshua-hris-preferences',
      storage: {
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
```

## Form State Management

### React Hook Form Integration

```typescript
// Form state pattern using React Hook Form
import { useForm } from 'react-hook-form';

interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
}

function JobPostingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
  } = useForm<JobFormData>({
    defaultValues: {
      title: '',
      description: '',
      requirements: [],
      salary: {
        min: 0,
        max: 0,
        currency: 'USD',
      },
    },
  });

  const onSubmit = async (data: JobFormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('title', { required: 'Title is required' })}
        placeholder="Job Title"
      />
      {errors.title && <span>{errors.title.message}</span>}
      
      {/* Other form fields */}
    </form>
  );
}
```

## State Architecture Patterns

### Data Flow

```
User Action → Component → Hook → API Call → TanStack Query → UI Update
                     ↓
                Zustand Store (for UI state)
                     ↓
                Global State Update
```

### State Categories

#### Server State (TanStack Query)
- Employee data
- Job postings
- Applicant information
- Company profiles
- Reports and analytics
- DOLE compliance data

#### Client State (Zustand)
- UI state (modals, sidebars, loading states)
- User preferences
- Navigation state
- Temporary form data
- Notification system

#### Form State (React Hook Form)
- Form validation
- Field state management
- Form submission handling
- Dynamic form fields

### Optimistic Updates

```typescript
// Example optimistic update pattern
function useUpdateEmployeeStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateEmployeeStatusAPI,
    onMutate: async (newStatus) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['employees']);
      
      // Snapshot current value
      const previousEmployees = queryClient.getQueryData(['employees']);
      
      // Optimistically update
      queryClient.setQueryData(['employees'], (old) => 
        old.map(emp => emp.id === newStatus.id 
          ? { ...emp, status: newStatus.status }
          : emp
        )
      );
      
      return { previousEmployees };
    },
    onError: (err, newStatus, context) => {
      // Rollback on error
      queryClient.setQueryData(['employees'], context.previousEmployees);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries(['employees']);
    },
  });
}
```

## Performance Optimizations

### Query Optimization
1. **Stale Time Configuration**: Prevent unnecessary refetches
2. **Background Refetching**: Keep data fresh without blocking UI
3. **Query Invalidation**: Strategic cache invalidation
4. **Parallel Queries**: Efficient data loading

### State Selectors
```typescript
// Zustand selectors for performance
const useCurrentUser = () => useAppStore(state => state.currentUser);
const useNotificationCount = () => useAppStore(state => state.notifications.length);
```

### Memoization
```typescript
// Memoized selectors
import { useMemo } from 'react';

function EmployeeList() {
  const { data: employees } = useGetEmployeeItems();
  
  const activeEmployees = useMemo(
    () => employees?.filter(emp => emp.status === 'active') || [],
    [employees]
  );
  
  return (
    <div>
      {activeEmployees.map(employee => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
}
```

## Error Handling

### Query Error Handling
```typescript
// Global error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
      onError: (error) => {
        // Global error handling
        console.error('Query error:', error);
        toast.error('Failed to fetch data');
      },
    },
  },
});
```

### State Error Recovery
```typescript
// Error boundaries for state
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// Usage
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <EmployeeManagement />
</ErrorBoundary>
```

## Best Practices

### TanStack Query
1. Use structured query keys
2. Implement proper error handling
3. Configure appropriate stale times
4. Use optimistic updates for better UX
5. Implement proper loading states

### Zustand
1. Keep stores focused and small
2. Use selectors for performance
3. Implement proper TypeScript types
4. Use middleware for persistence when needed
5. Avoid deeply nested state

### Form State
1. Use React Hook Form for complex forms
2. Implement proper validation
3. Handle form errors gracefully
4. Use controlled components when necessary
5. Optimize form performance with proper memoization
