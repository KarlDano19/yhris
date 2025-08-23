# Component Architecture

## Overview

The application follows a component-based architecture with reusable UI components, page-specific components, and shared utilities. Components are organized by functionality and follow React best practices for maintainability and performance.

## Component Categories

### Shared UI Components (`/src/components/`)
- **ConfirmModal** - Confirmation dialog modal
- **CustomDatePicker** - Enhanced date picker with validation
- **Pagination** - Reusable pagination component
- **CustomToast** - Toast notification system
- **DragDrop** - File drag and drop interface
- **Timer** - Timer component for time tracking
- **ViewDocumentModal** - Document preview modal
- **SuccessPopAlert** - Success notification popup
- **FloatingHelpButton** - Contextual help system
- **FloatingProgress** - Progress indicator overlay
- **RightClickMenu** - Context menu functionality
- **SplitView** - Split panel layout component

### Page Components (`/src/components/pages/`)
Organized by route structure:
- **`(all-layout)/`** - Shared layout components
- **`(auth)/`** - Authenticated user components
  - **`admin/`** - Admin-specific components
  - **`applicant/`** - Applicant-specific components  
  - **`employer/`** - Employer-specific components
- **`(un-auth)/`** - Public page components

### Provider Components
- **PostHogProvider** - Analytics provider
- **ReactQueryWrapper** - Query client provider

## Core Component Documentation

### ConfirmModal

A reusable confirmation dialog for destructive actions.

```typescript
interface ConfirmModalProps {
  message?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  confirmAction: Function;
  isLoading: boolean;
}
```

**Features**:
- Customizable confirmation message
- Loading state with spinner
- Smooth transitions with Headless UI
- Accessible focus management
- Backdrop click to close

**Usage**:
```typescript
import ConfirmModal from '@/components/ConfirmModal';

function DeleteButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteItem();
    setIsDeleting(false);
    setShowConfirm(false);
  };
  
  return (
    <>
      <button onClick={() => setShowConfirm(true)}>Delete</button>
      <ConfirmModal
        message="Are you sure you want to delete this item?"
        isOpen={showConfirm}
        setIsOpen={setShowConfirm}
        confirmAction={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
```

### CustomDatePicker

Enhanced date picker component with validation and custom styling.

```typescript
interface CustomDatePickerProps {
  id: string;
  pickerOnChange: (date: Date | null) => void;
  inputOnChange: (date: Date | null) => void;
  selected?: Date;
  minDate?: Date;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  tabIndex?: number;
}
```

**Features**:
- Date format validation (`MM/DD/YYYY`)
- Custom input with calendar icon
- Keyboard navigation support
- Clear functionality
- Minimum date constraints
- Accessibility compliant

**Usage**:
```typescript
import CustomDatePicker from '@/components/CustomDatePicker';

function DateForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  return (
    <CustomDatePicker
      id="start-date"
      selected={selectedDate}
      pickerOnChange={setSelectedDate}
      inputOnChange={setSelectedDate}
      minDate={new Date()}
      placeholder="Select start date"
      required
    />
  );
}
```

### Pagination

Comprehensive pagination component with responsive design and page size controls.

```typescript
interface PaginationProps {
  pagination: {
    totalPages: number;
    totalRecords: number;
  };
  currentPage: number;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  onPageChange: (selectedItem: { selected: number }) => void;
  pageType?: string;
}
```

**Features**:
- Responsive design (mobile/desktop layouts)
- Configurable page sizes
- Total records display
- Accessible navigation
- Customizable page size options per context

**Usage**:
```typescript
import Pagination from '@/components/Pagination';

function DataTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  return (
    <div>
      {/* Table content */}
      <Pagination
        pagination={{ totalPages: 10, totalRecords: 100 }}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        onPageSizeChange={setPageSize}
        pageType="standard"
      />
    </div>
  );
}
```

## Component Design Patterns

### 1. Compound Components

```typescript
// Modal compound component pattern
<Modal isOpen={isOpen} onClose={onClose}>
  <Modal.Header>
    <Modal.Title>Confirmation</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure?
  </Modal.Body>
  <Modal.Footer>
    <Modal.CancelButton>Cancel</Modal.CancelButton>
    <Modal.ConfirmButton>Confirm</Modal.ConfirmButton>
  </Modal.Footer>
</Modal>
```

### 2. Render Props Pattern

```typescript
interface DataFetcherProps {
  children: (data: any, loading: boolean, error: any) => React.ReactNode;
}

function DataFetcher({ children }: DataFetcherProps) {
  const { data, isLoading, error } = useQuery(['data'], fetchData);
  return children(data, isLoading, error);
}

// Usage
<DataFetcher>
  {(data, loading, error) => {
    if (loading) return <Loading />;
    if (error) return <Error message={error} />;
    return <DataDisplay data={data} />;
  }}
</DataFetcher>
```

### 3. Higher-Order Components (HOCs)

```typescript
function withAuth<T extends {}>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { data: user } = useGetUserDetails();
    
    if (!user) {
      return <LoginPrompt />;
    }
    
    return <Component {...props} />;
  };
}

// Usage
const SecureComponent = withAuth(EmployeeList);
```

### 4. Custom Hooks for Logic Separation

```typescript
function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  const confirm = async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isOpen,
    isLoading,
    openModal,
    closeModal,
    confirm,
  };
}
```

## Styling Conventions

### Tailwind CSS Classes

The application uses consistent Tailwind CSS patterns:

```typescript
// Color scheme
const colors = {
  primary: 'indigo-dye',     // #2C3F58
  secondary: 'savoy-blue',   // #355FD0
  success: 'green-600',
  warning: 'yellow-500',
  error: 'red-600',
};

// Common patterns
const styles = {
  button: 'px-4 py-2 rounded-md font-medium transition-colors',
  input: 'block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600',
  modal: 'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all',
};
```

### Responsive Design

```typescript
// Mobile-first responsive classes
<div className="
  flex flex-col          // Mobile: column layout
  sm:flex-row           // Small screens and up: row layout  
  gap-2                 // Small gap on mobile
  sm:gap-4             // Larger gap on small screens+
  p-4                  // Padding on all sides
  sm:p-6              // Larger padding on small screens+
">
```

### Animation and Transitions

```typescript
// Headless UI transition patterns
<Transition
  enter="ease-out duration-300"
  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  enterTo="opacity-100 translate-y-0 sm:scale-100"
  leave="ease-in duration-200"
  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
>
```

## Performance Optimization

### Component Memoization

```typescript
import React, { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({ ...item, processed: true }));
  }, [data]);
  
  const handleClick = useCallback((id) => {
    onUpdate(id);
  }, [onUpdate]);
  
  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onClick={handleClick} />
      ))}
    </div>
  );
});
```

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Virtual Scrolling

```typescript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
}
```

## Accessibility Best Practices

### ARIA Attributes

```typescript
function AccessibleButton({ children, onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-label={loading ? 'Loading...' : undefined}
      aria-describedby={loading ? 'loading-description' : undefined}
    >
      {loading && (
        <span id="loading-description" className="sr-only">
          Please wait while the action is being processed
        </span>
      )}
      {children}
    </button>
  );
}
```

### Keyboard Navigation

```typescript
function KeyboardNavigableList({ items, onSelect }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        onSelect(items[focusedIndex]);
        break;
    }
  };
  
  return (
    <ul role="listbox" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <li
          key={item.id}
          role="option"
          aria-selected={index === focusedIndex}
          tabIndex={index === focusedIndex ? 0 : -1}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

## Component Testing Patterns

### Unit Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from './ConfirmModal';

describe('ConfirmModal', () => {
  test('calls confirmAction when Yes is clicked', () => {
    const mockConfirm = jest.fn();
    
    render(
      <ConfirmModal
        isOpen={true}
        setIsOpen={() => {}}
        confirmAction={mockConfirm}
        isLoading={false}
      />
    );
    
    fireEvent.click(screen.getByText('Yes'));
    expect(mockConfirm).toHaveBeenCalled();
  });
});
```

### Integration Testing

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProfile from './UserProfile';

test('displays user profile after loading', async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  render(
    <QueryClientProvider client={queryClient}>
      <UserProfile />
    </QueryClientProvider>
  );
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## Best Practices Summary

### Component Design
1. **Single Responsibility**: Each component should have one clear purpose
2. **Prop Interface**: Use TypeScript interfaces for prop definitions
3. **Default Props**: Provide sensible defaults where applicable
4. **Error Boundaries**: Implement error boundaries for robust error handling

### Performance
1. **Memoization**: Use React.memo for expensive components
2. **Callback Optimization**: Use useCallback for event handlers
3. **State Optimization**: Keep state as local as possible
4. **Bundle Splitting**: Use dynamic imports for code splitting

### Accessibility
1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Attributes**: Implement proper ARIA labels and roles
3. **Keyboard Navigation**: Ensure all interactions are keyboard accessible
4. **Focus Management**: Handle focus appropriately in modals and dynamic content

### Maintainability
1. **Consistent Naming**: Follow consistent naming conventions
2. **Documentation**: Document complex components and their props
3. **Separation of Concerns**: Keep business logic separate from presentation
4. **Reusability**: Design components to be reusable across different contexts
