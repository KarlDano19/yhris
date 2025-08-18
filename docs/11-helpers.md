# Helper Functions Documentation

## Overview

The helpers directory contains utility functions that provide common functionality across the application. These functions handle formatting, data manipulation, validation, and other shared operations.

## Helper Functions Reference

### titleCase.ts

Converts the first character of a string to uppercase.

```typescript
const titleCase = (str: any) => str.charAt(0).toUpperCase() + str.slice(1)
```

**Usage**:
```typescript
import titleCase from '@/helpers/titleCase';

const name = titleCase('john'); // "John"
const status = titleCase('active'); // "Active"
```

### date.ts

Provides date formatting utilities for consistent date display.

```typescript
/**
 * Formats a date string into a readable format (MM/DD/YYYY)
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  // Implementation with error handling
}
```

**Features**:
- Input validation and error handling
- Consistent MM/DD/YYYY format
- Handles invalid dates gracefully
- Returns original string if formatting fails

**Usage**:
```typescript
import { formatDate } from '@/helpers/date';

const formatted = formatDate('2024-01-15T10:30:00Z'); // "01/15/2024"
const invalid = formatDate('invalid-date'); // "invalid-date"
const empty = formatDate(''); // ""
```

### classNames.ts

Utility for conditionally combining CSS class names, similar to the popular `clsx` library.

```typescript
export default function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}
```

**Usage**:
```typescript
import classNames from '@/helpers/classNames';

const buttonClass = classNames(
  'btn',
  'btn-primary',
  isLoading && 'btn-loading',
  disabled && 'btn-disabled'
);

// Result: "btn btn-primary btn-loading" (if isLoading is true)
```

### currencyFormat.ts

Formats numeric values as currency with proper thousand separators.

```typescript
export default function formatPrice(value: number) {
  const val = (value / 1).toFixed(2).replace(',', '.');
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
```

**Usage**:
```typescript
import formatPrice from '@/helpers/currencyFormat';

const price = formatPrice(1234567.89); // "1,234,567.89"
const small = formatPrice(99.5); // "99.50"
```

## Extended Helper Functions

### Advanced Date Utilities

```typescript
// Additional date helper functions that could be added
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
  return formatDate(dateString);
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
```

### String Utilities

```typescript
// Enhanced string manipulation helpers
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const toCamelCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, char => char.toLowerCase());
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
```

### Number Utilities

```typescript
// Enhanced number formatting helpers
export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('en-US', options).format(value);
};

export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
```

### Validation Utilities

```typescript
// Common validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value: any): string | null => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'This field is required';
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number): string | null => {
  if (value && value.length < minLength) {
    return `Must be at least ${minLength} characters`;
  }
  return null;
};
```

### Array Utilities

```typescript
// Array manipulation helpers
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
```

### DOM Utilities

```typescript
// DOM manipulation helpers
export const scrollToElement = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

export const downloadFile = (data: Blob | string, filename: string, type: string = 'text/plain'): void => {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
```

### Constants Reference

From `constants.ts`:

```typescript
// Quill editor configuration
export const QUILL_FORMATS = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
  'blockquote', 'list', 'bullet', 'indent', 'link'
];

export const QUILL_MODULES = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

// Template constants
export const CREATEJOB_TEMPLATE = [
  '<p>Ensuring the accounts of the company are accurate and free of error.</p>'
];

export const QUALIFICATION_TEMPLATE = [
  '<ul><li>Must have at least 2 years of experience in accounting.</li><li>Any graduate of business course</li><li>Must have attention to details and a good communicator</li></ul>'
];
```

## Error Handling Patterns

### Safe Execution Wrapper

```typescript
export const safeExecute = <T>(
  fn: () => T,
  fallback: T,
  onError?: (error: any) => void
): T => {
  try {
    return fn();
  } catch (error) {
    if (onError) {
      onError(error);
    }
    return fallback;
  }
};
```

### Async Safe Execution

```typescript
export const safeExecuteAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  onError?: (error: any) => void
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (onError) {
      onError(error);
    }
    return fallback;
  }
};
```

## Performance Utilities

### Debounce and Throttle

```typescript
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
```

## Best Practices

### Helper Function Guidelines

1. **Pure Functions**: Helpers should be pure functions when possible
2. **Error Handling**: Always handle edge cases and invalid inputs
3. **Type Safety**: Use TypeScript for type safety and better DX
4. **Documentation**: Document complex functions with JSDoc
5. **Testing**: Write unit tests for helper functions

### Usage Patterns

```typescript
// Good: Consistent error handling
export const safeFormatDate = (date: string): string => {
  try {
    return formatDate(date);
  } catch (error) {
    console.warn('Date formatting failed:', error);
    return date;
  }
};

// Good: Type safety
export const formatUserName = (user: { firstName?: string; lastName?: string }): string => {
  const { firstName = '', lastName = '' } = user;
  return `${firstName} ${lastName}`.trim() || 'Unknown User';
};

// Good: Composable functions
export const formatDisplayName = (user: any): string => {
  const fullName = formatUserName(user);
  return titleCase(fullName);
};
```

### Performance Considerations

1. **Memoization**: Use memoization for expensive calculations
2. **Lazy Loading**: Implement lazy loading for heavy utilities
3. **Tree Shaking**: Export functions individually for better tree shaking
4. **Bundle Size**: Keep helper functions lightweight

### Security Considerations

1. **Input Validation**: Always validate inputs
2. **XSS Prevention**: Sanitize user inputs when dealing with HTML
3. **Data Sanitization**: Clean data before processing
4. **Safe Parsing**: Use safe JSON parsing methods
