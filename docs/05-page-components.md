# Page Components Documentation

## Overview

Page components in the Yahshua HRIS application are organized by route structure and user roles. They encapsulate the complete functionality for specific pages and integrate with the layout system, authentication, and business logic.

## Structure Overview

```
src/components/pages/
├── (all-layout)/          # Shared layout pages
├── (auth)/               # Authenticated pages
│   ├── admin/           # Admin-specific pages
│   ├── applicant/       # Applicant-specific pages
│   ├── employer/        # Employer-specific pages
│   └── MenuItem.tsx     # Navigation menu component
└── (un-auth)/           # Public pages
```

## Authentication Flow Pages

### Login Component

Handles user authentication with role-based redirection.

```typescript
interface LoginProps {
  redirectTo?: string;
}

function Login({ redirectTo }: LoginProps) {
  const [credentials, setCredentials] = useState<T_Login>({
    email: '',
    password: '',
  });
  
  const { mutate: login, isLoading } = useLogin();
  
  const handleSubmit = (data: T_Login) => {
    login(data, {
      onSuccess: (response) => {
        // Update session
        updateSession(response.sessionData);
        
        // Redirect based on role
        switch (response.accountType) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'employer':
            router.push('/dashboard');
            break;
          case 'applicant':
            router.push('/apply-for-a-job');
            break;
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  
  return (
    <AuthLayout title="Login to Your Account">
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthLayout>
  );
}
```

### Registration Component

Multi-step registration with account type selection.

```typescript
function Register() {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<'employer' | 'applicant'>('employer');
  
  const { mutate: register, isLoading } = useRegister();
  
  const handleAccountTypeSelect = (type: 'employer' | 'applicant') => {
    setAccountType(type);
    setStep(2);
  };
  
  const handleRegistration = (data: T_Register) => {
    register({ ...data, accountType }, {
      onSuccess: () => {
        toast.success('Registration successful! Please check your email.');
        router.push('/login');
      },
    });
  };
  
  return (
    <AuthLayout title="Create Your Account">
      {step === 1 && (
        <AccountTypeSelector onSelect={handleAccountTypeSelect} />
      )}
      {step === 2 && (
        <RegistrationForm
          accountType={accountType}
          onSubmit={handleRegistration}
          isLoading={isLoading}
          onBack={() => setStep(1)}
        />
      )}
    </AuthLayout>
  );
}
```

## Employer Pages

### Dashboard Component

Main employer dashboard with metrics and quick actions.

```typescript
interface DashboardProps {
  loginType: string;
}

function Dashboard({ loginType }: DashboardProps) {
  const { data: profile } = useGetEmployerProfile();
  const { data: employees } = useGetEmployeeItems();
  const { data: jobs } = useGetActiveJobs();
  
  const metrics = useMemo(() => ({
    totalEmployees: employees?.length || 0,
    activeJobs: jobs?.filter(job => job.status === 'active').length || 0,
    pendingApplications: jobs?.reduce((acc, job) => acc + job.applicationsCount, 0) || 0,
  }), [employees, jobs]);
  
  return (
    <EmployerLayout>
      <DashboardHeader profile={profile} />
      
      <MetricsGrid metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentApplications />
        <QuickActions />
      </div>
      
      <RecentActivity />
    </EmployerLayout>
  );
}
```

### Job Management Pages

```typescript
// Job Posting Component
function PostJob() {
  const [step, setStep] = useState(1);
  const [jobData, setJobData] = useState<Partial<T_CreateJob>>({});
  
  const { mutate: createJob, isLoading } = useCreateJob();
  
  const handleNext = (stepData: any) => {
    setJobData(prev => ({ ...prev, ...stepData }));
    setStep(prev => prev + 1);
  };
  
  const handleSubmit = (finalData: any) => {
    const completeJobData = { ...jobData, ...finalData };
    createJob(completeJobData, {
      onSuccess: () => {
        toast.success('Job posted successfully!');
        router.push('/screen-applicants');
      },
    });
  };
  
  return (
    <EmployerLayout>
      <JobPostingWizard
        step={step}
        onNext={handleNext}
        onBack={() => setStep(prev => prev - 1)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </EmployerLayout>
  );
}

// Applicant Screening Component
function ScreenApplicants() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    rating: 'all',
    experience: 'all',
  });
  
  const { data: jobs } = useGetJobs();
  const { data: applicants } = useGetJobApplicants(selectedJob);
  
  const filteredApplicants = useMemo(() => {
    return applicants?.filter(applicant => {
      if (filters.status !== 'all' && applicant.status !== filters.status) return false;
      if (filters.rating !== 'all' && applicant.rating < parseInt(filters.rating)) return false;
      return true;
    }) || [];
  }, [applicants, filters]);
  
  return (
    <EmployerLayout>
      <ScreeningHeader />
      
      <div className="flex gap-6">
        <JobSelector
          jobs={jobs}
          selected={selectedJob}
          onSelect={setSelectedJob}
        />
        
        <div className="flex-1">
          <ApplicantFilters
            filters={filters}
            onChange={setFilters}
          />
          
          <ApplicantList
            applicants={filteredApplicants}
            onStatusChange={handleStatusChange}
            onScheduleInterview={handleScheduleInterview}
          />
        </div>
      </div>
    </EmployerLayout>
  );
}
```

### Employee Management Pages

```typescript
// Employee Management Component
function ManageEmployees() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState({
    department: 'all',
    status: 'active',
    search: '',
  });
  
  const { data: employees, isLoading } = useGetEmployeeItems();
  const { data: departments } = useGetDepartmentItems();
  
  const filteredEmployees = useMemo(() => {
    return employees?.filter(employee => {
      if (filters.department !== 'all' && employee.department !== filters.department) return false;
      if (filters.status !== 'all' && employee.status !== filters.status) return false;
      if (filters.search && !employee.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    }) || [];
  }, [employees, filters]);
  
  return (
    <EmployerLayout>
      <EmployeeHeader
        view={view}
        onViewChange={setView}
        onAddEmployee={() => setShowAddModal(true)}
      />
      
      <EmployeeFilters
        filters={filters}
        departments={departments}
        onChange={setFilters}
      />
      
      {view === 'list' ? (
        <EmployeeTable employees={filteredEmployees} />
      ) : (
        <EmployeeGrid employees={filteredEmployees} />
      )}
      
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </EmployerLayout>
  );
}
```

## Applicant Pages

### Job Search Component

```typescript
function JobSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: 'all',
    jobType: 'all',
    salary: 'all',
    company: 'all',
  });
  
  const { data: jobs, isLoading } = useGetPublicJobs({
    search: searchQuery,
    ...filters,
  });
  
  const { mutate: applyToJob } = useApplyToJob();
  
  const handleApply = (jobId: string) => {
    applyToJob({ jobId }, {
      onSuccess: () => {
        toast.success('Application submitted successfully!');
      },
    });
  };
  
  return (
    <ApplicantLayout>
      <SearchHeader
        query={searchQuery}
        onSearch={setSearchQuery}
      />
      
      <div className="flex gap-6">
        <JobFilters
          filters={filters}
          onChange={setFilters}
        />
        
        <div className="flex-1">
          {isLoading ? (
            <JobListSkeleton />
          ) : (
            <JobList
              jobs={jobs}
              onApply={handleApply}
              onSave={handleSaveJob}
            />
          )}
        </div>
      </div>
    </ApplicantLayout>
  );
}
```

### Application Tracker Component

```typescript
function ApplicationTracker() {
  const { data: applications, isLoading } = useGetMyApplications();
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  
  const filteredApplications = useMemo(() => {
    if (selectedStatus === 'all') return applications || [];
    return applications?.filter(app => app.status === selectedStatus) || [];
  }, [applications, selectedStatus]);
  
  const statusCounts = useMemo(() => {
    const counts = { all: 0, pending: 0, reviewing: 0, interviewing: 0, offered: 0, hired: 0, rejected: 0 };
    applications?.forEach(app => {
      counts.all++;
      counts[app.status]++;
    });
    return counts;
  }, [applications]);
  
  return (
    <ApplicantLayout>
      <TrackerHeader />
      
      <StatusTabs
        counts={statusCounts}
        selected={selectedStatus}
        onSelect={setSelectedStatus}
      />
      
      {isLoading ? (
        <ApplicationListSkeleton />
      ) : (
        <ApplicationList
          applications={filteredApplications}
          onWithdraw={handleWithdraw}
          onViewDetails={handleViewDetails}
        />
      )}
    </ApplicantLayout>
  );
}
```

## Admin Pages

### User Management Component

```typescript
function UserManagement() {
  const [userType, setUserType] = useState<'all' | 'employer' | 'applicant'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: users, isLoading } = useGetUsers({
    type: userType,
    search: searchQuery,
  });
  
  const { mutate: suspendUser } = useSuspendUser();
  const { mutate: activateUser } = useActivateUser();
  
  const handleUserAction = (userId: string, action: 'suspend' | 'activate') => {
    const mutation = action === 'suspend' ? suspendUser : activateUser;
    mutation({ userId }, {
      onSuccess: () => {
        toast.success(`User ${action}d successfully`);
        queryClient.invalidateQueries(['users']);
      },
    });
  };
  
  return (
    <AdminLayout>
      <UserManagementHeader
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        userType={userType}
        onUserTypeChange={setUserType}
      />
      
      <UserTable
        users={users}
        isLoading={isLoading}
        onUserAction={handleUserAction}
        onViewDetails={handleViewUserDetails}
      />
    </AdminLayout>
  );
}
```

## Shared Components

### Layout Components

```typescript
// Base layout with navigation
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Breadcrumb[];
}

function EmployerLayout({ children, title, breadcrumbs }: LayoutProps) {
  const { data: profile } = useGetEmployerProfile();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userType="employer" profile={profile} />
      
      <div className="lg:pl-64">
        <Header
          title={title}
          breadcrumbs={breadcrumbs}
          user={profile}
        />
        
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Navigation Component (MenuItem.tsx)

```typescript
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  badge?: number;
  onClick?: () => void;
}

function MenuItem({ icon, label, href, isActive, badge, onClick }: MenuItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <Link
      href={href}
      onClick={handleClick}
      className={classNames(
        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
        isActive
          ? 'bg-savoy-blue text-white'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <span className="mr-3 h-6 w-6">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="ml-3 inline-block py-0.5 px-2 text-xs rounded-full bg-red-100 text-red-600">
          {badge}
        </span>
      )}
    </Link>
  );
}
```

## Page Component Patterns

### Data Fetching Pattern

```typescript
function PageComponent() {
  // 1. Fetch data with loading and error states
  const { data, isLoading, error } = useGetData();
  
  // 2. Handle loading state
  if (isLoading) return <PageSkeleton />;
  
  // 3. Handle error state
  if (error) return <ErrorBoundary error={error} />;
  
  // 4. Handle empty state
  if (!data || data.length === 0) return <EmptyState />;
  
  // 5. Render content
  return <PageContent data={data} />;
}
```

### Form Handling Pattern

```typescript
function FormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>();
  
  const { mutate: submitForm } = useSubmitForm();
  
  const onSubmit = (data: FormData) => {
    submitForm(data, {
      onSuccess: () => {
        toast.success('Form submitted successfully');
        router.push('/success-page');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  
  return (
    <Layout>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Form fields */}
        <SubmitButton isLoading={isSubmitting} />
      </Form>
    </Layout>
  );
}
```

### Modal Management Pattern

```typescript
function PageWithModals() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const openModal = (modalType: string, item?: any) => {
    setActiveModal(modalType);
    setSelectedItem(item);
  };
  
  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };
  
  return (
    <Layout>
      <PageContent onOpenModal={openModal} />
      
      {/* Conditional modal rendering */}
      {activeModal === 'edit' && (
        <EditModal
          item={selectedItem}
          isOpen={true}
          onClose={closeModal}
        />
      )}
      
      {activeModal === 'delete' && (
        <ConfirmModal
          message="Are you sure you want to delete this item?"
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </Layout>
  );
}
```

## Best Practices

### Performance Optimization

1. **Code Splitting**: Use dynamic imports for heavy components
2. **Memoization**: Memoize expensive computations and components
3. **Virtualization**: Use virtual scrolling for large lists
4. **Lazy Loading**: Load data and components as needed

### Error Handling

1. **Error Boundaries**: Wrap page components in error boundaries
2. **Graceful Degradation**: Provide fallbacks for failed operations
3. **User Feedback**: Show clear error messages and recovery options
4. **Retry Mechanisms**: Implement retry for failed API calls

### Accessibility

1. **Keyboard Navigation**: Ensure all interactions are keyboard accessible
2. **Screen Readers**: Provide proper ARIA labels and descriptions
3. **Focus Management**: Handle focus properly in modals and forms
4. **Color Contrast**: Ensure sufficient color contrast for readability

### State Management

1. **Local State**: Keep state as local as possible
2. **Form State**: Use React Hook Form for complex forms
3. **Server State**: Use TanStack Query for API data
4. **Global State**: Use Zustand for global application state

This page component architecture provides a scalable foundation for the HRIS application with consistent patterns, proper error handling, and excellent user experience.
