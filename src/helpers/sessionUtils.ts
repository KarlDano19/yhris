/**
 * Session Utilities for Loops Integration
 * Helper functions to get user data from session
 */

/**
 * Get current user email from session via API call
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  try {
    const response = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const sessionData = await response.json();
      return sessionData.email || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user email from session:', error);
    return null;
  }
}

/**
 * Get user data from session storage (if available in browser)
 */
export function getUserEmailFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try to get from localStorage first
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.email || null;
    }
    
    // Try to get from sessionStorage
    const sessionUser = sessionStorage.getItem('user_email');
    return sessionUser || null;
  } catch (error) {
    console.error('Error getting email from storage:', error);
    return null;
  }
}

/**
 * Comprehensive email getter - tries multiple sources
 */
export async function getUserEmail(responseData?: any, formData?: any): Promise<string | null> {
  // Try response data first
  if (responseData?.email) return responseData.email;
  if (responseData?.user?.email) return responseData.user.email;
  
  // Try form data
  if (formData?.email) return formData.email;
  
  // Try session API
  const sessionEmail = await getCurrentUserEmail();
  if (sessionEmail) return sessionEmail;
  
  // Try browser storage
  const storageEmail = getUserEmailFromStorage();
  if (storageEmail) return storageEmail;
  
  return null;
}
