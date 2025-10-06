# RBAC Permission Implementation Guide

This guide shows you how to use and test your RBAC system throughout your application.

## 🔧 Backend Implementation

### 1. Protect API Views with Permissions

#### Using the @require_permission decorator:
```python
from app.views.rbac import require_permission

class EmployeeAPIView(API):
    @require_permission('create_employee')
    def post(self, request):
        # Only users with 'create_employee' permission can access this
        # Your employee creation logic here
        pass
    
    @require_permission('edit_employee')
    def patch(self, request, employee_id):
        # Only users with 'edit_employee' permission can access this
        # Your employee update logic here
        pass
```

#### Manual permission checking in views:
```python
class PayrollAPIView(API):
    def get(self, request):
        if not request.user.has_permission('create_payroll'):
            return self.error_response("Insufficient permissions", {}, 403)
        
        # Your payroll logic here
        pass
```

### 2. Check Permissions in Business Logic

#### In any view or service:
```python
def some_business_function(user, employer_id):
    # Check if user can perform action
    if user.has_permission('export_employee', employer_id):
        # Allow export
        return generate_employee_export()
    else:
        # Deny access
        raise HumanReadableError("You don't have permission to export employees")
```

### 3. Get User's All Permissions

#### For frontend consumption:
```python
# In a view
user_permissions = request.user.get_permissions(employer_id)
# Returns queryset of Permission objects

# Convert to list of permission names
permission_names = list(user_permissions.values_list('name', flat=True))
# Returns: ['create_employee', 'edit_employee', 'create_payroll', ...]
```

## 🎨 Frontend Implementation

### 1. Create Permission Hook

Create a hook to check user permissions:

```typescript
// hooks/useUserPermissions.ts
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getUserPermissions() {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/permissions/`, {
    headers: { Authorization: `Token ${token}` }
  });
  return res.json();
}

export function useUserPermissions() {
  return useQuery({
    queryKey: ['userPermissions'],
    queryFn: getUserPermissions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useHasPermission(permissionName: string) {
  const { data: permissions } = useUserPermissions();
  
  if (!permissions) return false;
  
  // Check if permission exists in any category
  for (const category in permissions) {
    if (permissions[category].some((p: any) => p.name === permissionName)) {
      return true;
    }
  }
  return false;
}
```

### 2. Conditional Rendering Based on Permissions

#### Hide/Show UI elements:
```typescript
import { useHasPermission } from '@/hooks/useUserPermissions';

function EmployeeManagement() {
  const canCreate = useHasPermission('create_employee');
  const canEdit = useHasPermission('edit_employee');
  const canExport = useHasPermission('export_employee');

  return (
    <div>
      <h1>Employee Management</h1>
      
      {canCreate && (
        <button onClick={createEmployee}>
          Create Employee
        </button>
      )}
      
      <table>
        {employees.map(employee => (
          <tr key={employee.id}>
            <td>{employee.name}</td>
            <td>
              {canEdit && (
                <button onClick={() => editEmployee(employee.id)}>
                  Edit
                </button>
              )}
            </td>
          </tr>
        ))}
      </table>
      
      {canExport && (
        <button onClick={exportEmployees}>
          Export to Excel
        </button>
      )}
    </div>
  );
}
```

### 3. Route Protection

#### Protect entire pages/routes:
```typescript
// components/ProtectedRoute.tsx
import { useHasPermission } from '@/hooks/useUserPermissions';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, requiredPermission, fallback }: ProtectedRouteProps) {
  const hasPermission = useHasPermission(requiredPermission);
  const router = useRouter();

  useEffect(() => {
    if (!hasPermission) {
      // Redirect to unauthorized page or show error
      router.push('/unauthorized');
    }
  }, [hasPermission, router]);

  if (!hasPermission) {
    return fallback || <div>Access Denied: You don't have permission to view this page.</div>;
  }

  return <>{children}</>;
}
```

#### Usage in pages:
```typescript
// pages/payroll/index.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function PayrollPage() {
  return (
    <ProtectedRoute requiredPermission="create_payroll">
      <div>
        <h1>Payroll Management</h1>
        {/* Payroll content here */}
      </div>
    </ProtectedRoute>
  );
}
```

### 4. Navigation Menu Based on Permissions

#### Dynamic menu items:
```typescript
import { useHasPermission } from '@/hooks/useUserPermissions';

function Navigation() {
  const canManageEmployees = useHasPermission('create_employee');
  const canManagePayroll = useHasPermission('create_payroll');
  const canViewReports = useHasPermission('generate_reports');
  const canManageSettings = useHasPermission('settings_access');

  return (
    <nav>
      {canManageEmployees && (
        <Link href="/employees">Employee Management</Link>
      )}
      
      {canManagePayroll && (
        <Link href="/payroll">Payroll</Link>
      )}
      
      {canViewReports && (
        <Link href="/reports">Reports</Link>
      )}
      
      {canManageSettings && (
        <Link href="/settings">Settings</Link>
      )}
    </nav>
  );
}
```

## 🧪 Testing Your RBAC System

### 1. Test Permission Checking API

Use your existing endpoint to test permission checking:

```javascript
// Test if current user has specific permission
fetch('/api/users/permissions/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    permission: 'create_employee',
    user_id: 123 // optional, defaults to current user
  })
})
.then(res => res.json())
.then(data => {
  console.log('Has permission:', data.has_permission); // true/false
});
```

### 2. Test Different User Scenarios

#### Scenario A: HR Manager
1. Create role: "HR Manager"
2. Assign permissions: `create_employee`, `edit_employee`, `create_payroll`
3. Assign role to user
4. Login as that user
5. Test: Should see Employee and Payroll menus, can create/edit employees

#### Scenario B: Recruiter
1. Create role: "Recruiter" 
2. Assign permissions: `create_job`, `view_applicant`, `screen_applicants`
3. Assign role to user
4. Login as that user  
5. Test: Should only see Recruitment features, no payroll access

#### Scenario C: Employee Viewer
1. Create role: "Employee Viewer"
2. Assign permissions: `view_employee` (read-only)
3. Assign role to user
4. Login as that user
5. Test: Can view employee list but no Create/Edit buttons

### 3. Debug Permission Issues

#### Check user's permissions:
```python
# In Django shell or view
user = User.objects.get(id=123)
permissions = user.get_permissions(employer_id=1)
print("User permissions:", [p.name for p in permissions])

# Check specific permission
has_perm = user.has_permission('create_employee', employer_id=1)
print(f"Can create employee: {has_perm}")
```

#### Frontend debugging:
```typescript
// In component
const { data: permissions } = useUserPermissions();
console.log('All user permissions:', permissions);

const canCreate = useHasPermission('create_employee');
console.log('Can create employee:', canCreate);
```

## 🚀 Next Steps

1. **Start with one module** - Pick Employee Management and add permission checks
2. **Protect API endpoints** - Add `@require_permission` decorators to views
3. **Update frontend** - Hide/show buttons based on permissions
4. **Test thoroughly** - Create test users with different role combinations
5. **Expand gradually** - Add permission checks to other modules

## 💡 Best Practices

- **Be specific with permissions** - `create_employee` vs generic `employee_access`
- **Check permissions early** - At API endpoint level AND UI level
- **Cache permissions** - Use React Query to avoid repeated API calls
- **Graceful degradation** - Hide features rather than show error messages
- **Test edge cases** - Users with no roles, multiple conflicting roles
- **Log permission denials** - For security auditing and debugging

Your RBAC system is now ready to secure your entire HRIS application! 🔒
