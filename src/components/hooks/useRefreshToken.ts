import { useMutation } from '@tanstack/react-query';

export async function refreshToken() {
  try {
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    };
    const res = await fetch(`/api/refresh/`, config);
    
    // Parse response safely
    let data: any = null;
    try {
      const text = await res.text();
      if (text && text.trim().length > 0) {
        data = JSON.parse(text);
      }
    } catch (parseError) {
      throw new Error('Invalid response from server');
    }
    
    if (!res.ok) {
      const errorMessage = data?.error || data?.message || data?.detail || 'Failed to refresh token';
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (err: any) {
    // If it's already an Error object, throw it directly
    if (err instanceof Error) {
      throw err;
    }
    // Otherwise, try to extract error message
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw new Error(errStringify.response.data.message);
    }
    throw new Error(errStringify.message || 'Failed to refresh token');
  }
}

function useRefreshToken() {
  const query = useMutation(() => refreshToken());
  return query;
}

export default useRefreshToken;

