import {useMutation, UseMutationResult } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { DirectiveReadRequest } from '@/types/directives';

/**
 * Hook to mark a directive as read
 */
export const useMarkDirectiveAsRead = (directiveId: string | number): UseMutationResult<any, Error, DirectiveReadRequest> => {
    return useMutation({
      mutationFn: async ({ email }) => {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/read/`;
          
          // Try to get the token, but it's optional for this endpoint
          const token = getCookie('token');
          
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          
          // Only add the Authorization header if we have a token
          if (token) {
            headers['Authorization'] = `Token ${token}`;
          }
          
          console.log('Making request to mark directive as read:', {
            url: apiUrl,
            email,
            headers: { ...headers, Authorization: token ? 'Token [REDACTED]' : undefined }
          });
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email }),
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response from server:', errorData);
            throw new Error(errorData.message || `Failed to mark as read: ${response.status}`);
          }
          
          return response.json();
        } catch (err: any) {
          console.error('Error marking directive as read:', err);
          throw err;
        }
      },
    });
  }; 

export default useMarkDirectiveAsRead;