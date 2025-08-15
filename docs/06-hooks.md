# Custom Hooks Documentation

## Overview

The application uses custom React hooks to encapsulate API calls and data fetching logic. All hooks follow TanStack Query patterns for efficient server state management with consistent error handling and caching strategies.

## Hook Categories

### Query Hooks (Data Fetching)
- **useGetEmployeeItems** - Fetch employee list data
- **useGetEmployerProfile** - Fetch employer profile information
- **useGetApplicantProfile** - Fetch applicant profile information
- **useGetUserDetails** - Fetch current user details
- **useGetRights** - Fetch user permissions and rights
- **useGetDepartmentItems** - Fetch department list
- **useGetPositionItems** - Fetch position/job title list
- **useGetLocationItems** - Fetch location list
- **useGetEmailTemplateItems** - Fetch email template list
- **useGetEvaluationTemplateItems** - Fetch evaluation template list
- **useGetThirdPartyIntegrationItems** - Fetch integration settings
- **useGetUsers** - Fetch user list
- **useGetAdminProfile** - Fetch admin profile

### Mutation Hooks (Data Modification)
- **useLogout** - Handle user logout
- **useSyncEmployees** - Sync employees with third-party systems
- **useEnrollEmployeeToYP** - Enroll employee to YP system

### Utility Hooks
- **useTagTo** - Email recipient tagging
- **useTagCc** - Email CC recipient tagging  
- **useTagBcc** - Email BCC recipient tagging

## Common Hook Patterns

### Standard Query Hook Structure

```typescript
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function fetchData() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/endpoint/`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useCustomHook() {
  const query = useQuery(['cacheKey'], () => fetchData(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}
```

### Standard Mutation Hook Structure

```typescript
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function mutateData(payload) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    };
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/endpoint/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    // Error handling logic
  }
}

function useCustomMutation() {
  const mutation = useMutation((data) => mutateData(data));
  return mutation;
}
```

## Detailed Hook Documentation

### useGetEmployeeItems

**Purpose**: Fetches employee list data with select view type filter

**API Endpoint**: `GET /api/employees/?view_type=select`

**Cache Key**: `['employeeItemsCache']`

**Returns**: Array of employee objects

**Usage**:
```typescript
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';

function EmployeeList() {
  const { data: employees, isLoading, error } = useGetEmployeeItems();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {employees?.map(employee => (
        <div key={employee.id}>{employee.name}</div>
      ))}
    </div>
  );
}
```

### useGetEmployerProfile

**Purpose**: Fetches employer profile information

**API Endpoint**: `GET /api/employers/profiles/`

**Cache Key**: `['employerProfileCache']`

**Returns**: Employer profile object

**Usage**:
```typescript
import useGetEmployerProfile from '@/components/hooks/useGetEmployerProfile';

function EmployerDashboard() {
  const { data: profile, isLoading } = useGetEmployerProfile();
  
  return (
    <div>
      <h1>{profile?.companyName}</h1>
      <p>{profile?.companyDescription}</p>
    </div>
  );
}
```

### useGetApplicantProfile

**Purpose**: Fetches applicant profile information

**API Endpoint**: `GET /api/applicants/profiles/`

**Cache Key**: `['applicantProfileCache']`

**Returns**: Applicant profile object

**Usage**:
```typescript
import useGetApplicantProfile from '@/components/hooks/useGetApplicantProfile';

function ApplicantDashboard() {
  const { data: profile, isLoading } = useGetApplicantProfile();
  
  return (
    <div>
      <h1>{profile?.firstname} {profile?.lastname}</h1>
      <p>{profile?.about}</p>
    </div>
  );
}
```

### useGetUserDetails

**Purpose**: Fetches current user account details

**API Endpoint**: `GET /api/user-accounts/details/`

**Cache Key**: `['userDetailsCache']`

**Returns**: User details object

**Usage**:
```typescript
import useGetUserDetails from '@/components/hooks/useGetUserDetails';

function UserProfile() {
  const { data: user, isLoading } = useGetUserDetails();
  
  return (
    <div>
      <p>Email: {user?.email}</p>
      <p>Account Type: {user?.accountType}</p>
    </div>
  );
}
```

### useGetRights

**Purpose**: Fetches user permissions and access rights

**API Endpoint**: `GET /api/rights/`

**Cache Key**: `['userRightsCache']`

**Returns**: User rights/permissions object

**Usage**:
```typescript
import useGetRights from '@/components/hooks/useGetRights';

function SecureComponent() {
  const { data: rights } = useGetRights();
  
  if (!rights?.canEditEmployees) {
    return <div>Access Denied</div>;
  }
  
  return <EmployeeEditor />;
}
```

### useGetDepartmentItems

**Purpose**: Fetches list of departments

**API Endpoint**: `GET /api/departments/`

**Cache Key**: `['departmentItemsCache']`

**Returns**: Array of department objects

### useGetPositionItems

**Purpose**: Fetches list of positions/job titles with select view

**API Endpoint**: `GET /api/positions/?view_type=select`

**Cache Key**: `['positionItemsCache']`

**Returns**: Array of position objects

### useGetLocationItems

**Purpose**: Fetches list of locations with select view

**API Endpoint**: `GET /api/locations/?view_type=select`

**Cache Key**: `['locationItemsCache']`

**Returns**: Array of location objects

### useLogout

**Purpose**: Handles user logout functionality

**API Endpoint**: `POST /api/logout/`

**Type**: Mutation

**Usage**:
```typescript
import useLogout from '@/components/hooks/useLogout';

function LogoutButton() {
  const { mutate: logout, isLoading } = useLogout();
  
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        window.location.href = '/login';
      },
      onError: (error) => {
        console.error('Logout failed:', error);
      },
    });
  };
  
  return (
    <button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

### useSyncEmployees

**Purpose**: Synchronizes employees with third-party integration systems

**API Endpoint**: `POST /api/employees/sync-third-party-integration/`

**Type**: Mutation

**Usage**:
```typescript
import useSyncEmployees from '@/components/hooks/useSyncEmployees';

function SyncButton() {
  const { mutate: syncEmployees, isLoading } = useSyncEmployees();
  
  const handleSync = () => {
    syncEmployees(undefined, {
      onSuccess: (data) => {
        toast.success('Employees synced successfully');
      },
      onError: (error) => {
        toast.error('Sync failed');
      },
    });
  };
  
  return (
    <button onClick={handleSync} disabled={isLoading}>
      {isLoading ? 'Syncing...' : 'Sync Employees'}
    </button>
  );
}
```

## Error Handling Patterns

All hooks implement consistent error handling:

```typescript
// Error handling in async functions
catch (err: any) {
  let errStringify = await err;
  
  // Handle API response errors
  if (Object.hasOwn(errStringify, 'response')) {
    throw errStringify.response.data.message;
  }
  
  // Handle detail errors
  if (Object.hasOwn(errStringify, 'detail')) {
    throw errStringify;
  }
  
  // Handle generic errors
  throw errStringify.message;
}
```

## Cache Configuration

All query hooks use consistent cache configuration:

```typescript
{
  refetchOnWindowFocus: false,    // Don't refetch when window gains focus
  keepPreviousData: true,         // Keep previous data while fetching new data
}
```

## Authentication Pattern

All hooks use token-based authentication:

```typescript
const token = getCookie('token');
const config = {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    Authorization: `Token ${token}`,
  },
};
```

## Best Practices

### Using Hooks in Components

1. **Conditional Rendering**: Always handle loading and error states
```typescript
const { data, isLoading, error } = useCustomHook();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
if (!data) return <EmptyState />;
```

2. **Optimistic Updates**: Use mutations with cache invalidation
```typescript
const { mutate } = useCustomMutation();

const handleSubmit = (data) => {
  mutate(data, {
    onSuccess: () => {
      queryClient.invalidateQueries(['relatedDataCache']);
    },
  });
};
```

3. **Dependent Queries**: Handle dependent data fetching
```typescript
const { data: user } = useGetUserDetails();
const { data: profile } = useGetEmployerProfile({
  enabled: !!user && user.accountType === 'employer',
});
```

### Performance Considerations

1. **Selective Data Fetching**: Only fetch data when needed
2. **Cache Optimization**: Use appropriate cache keys and strategies
3. **Error Boundaries**: Implement error boundaries for hook failures
4. **Loading States**: Provide meaningful loading indicators

### Security Considerations

1. **Token Validation**: Always check for valid tokens
2. **Error Messages**: Don't expose sensitive information in errors
3. **Permissions**: Validate user permissions before data access
4. **Input Validation**: Validate data before sending to API

## Future Enhancements

1. **Pagination Support**: Add pagination for large datasets
2. **Real-time Updates**: Implement WebSocket or polling for real-time data
3. **Offline Support**: Add offline capability with cache persistence
4. **Background Sync**: Implement background data synchronization
5. **Query Invalidation**: More granular cache invalidation strategies
