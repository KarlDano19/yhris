/**
 * Formats a date string into a readable format (MM/DD/YYYY)
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Format as MM/DD/YYYY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format ISO datetime string to local timezone for date-only display
 * Parses ISO string and formats it according to user's device timezone
 * @param isoString - ISO 8601 datetime string from backend
 * @param useShortMonth - If true, uses short month format (e.g., "Jan 1, 2023"), otherwise MM/DD/YYYY
 * @returns Formatted date string
 */
export const formatDateToLocal = (isoString: string | null, useShortMonth: boolean = false): string => {
  if (!isoString) return '';
  
  // Parse the ISO string to a Date object (automatically converts to local timezone)
  const date = new Date(isoString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // Format using user's device locale and timezone
  if (useShortMonth) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  
  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

/**
 * Format ISO datetime string to local timezone with date and time
 * Parses ISO string and formats it with HTML tags for display
 * @param isoString - ISO 8601 datetime string from backend
 * @param useShortMonth - If true, uses short month format without HTML tags (e.g., "Jan 1, 2023, 02:30 PM"), otherwise returns HTML formatted string
 * @returns Formatted string with HTML tags or plain text depending on useShortMonth
 */
export const formatDateTimeToLocal = (isoString: string | null, useShortMonth: boolean = false): string => {
  if (!isoString) return '';
  
  // Parse the ISO string to a Date object
  const date = new Date(isoString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // Format time in 12-hour format with AM/PM (using local timezone)
  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  } as Intl.DateTimeFormatOptions;
  
  if (useShortMonth) {
    // Return plain text format with short month
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  
  // Extract date components for HTML format
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const timeString = date.toLocaleTimeString('en-US', timeOptions);
  
  // Return formatted string with HTML tags
  return `<strong>Date:</strong> ${month}/${day}/${year}&nbsp;&nbsp;&nbsp;&nbsp;<strong>Time:</strong> ${timeString}`;
};

/**
 * Format ISO datetime string to local timezone, returning date and time separately
 * Parses ISO string and formats it according to user's device timezone
 * @param isoString - ISO 8601 datetime string from backend
 * @returns Object with formattedDate (e.g., "January 1, 2023") and formattedTime (e.g., "14:30")
 */
export const formatDateTimeSeparate = (isoString: string | null): { formattedDate: string; formattedTime: string } => {
  if (!isoString) return { formattedDate: '', formattedTime: '' };
  
  // Parse the ISO string to a Date object (automatically converts to local timezone)
  const date = new Date(isoString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return { formattedDate: '', formattedTime: '' };
  }
  
  // Format date (e.g., "January 1, 2023")
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString(undefined, options);
  
  // Format time (HH:MM format)
  const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  
  return { formattedDate, formattedTime };
}; 