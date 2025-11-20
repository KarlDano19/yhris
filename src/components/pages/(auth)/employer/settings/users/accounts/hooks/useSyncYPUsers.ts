import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Type definitions
type SyncResponse = {
  message: string;
  sync_results: {
    users_synced: number;
    users_created: number;
    users_updated: number;
    users_skipped: number;
    errors: string[];
  };
};

type SyncError = {
  message: string;
  details?: any;
};

async function syncYPUsers(): Promise<SyncResponse> {
  try {
    const token = getCookie('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sync_all: true // Updated to match the new API expectations
      }),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/yp-sync/users/`, 
      config
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw {
        message: errorData.message || 'Failed to sync users from Yahshua Payroll',
        details: errorData,
        status: res.status
      };
    }

    return await res.json();
  } catch (err: any) {
    // Handle different error types
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server');
    }
    
    if (err.message) {
      throw err;
    }

    // Handle promise rejection from fetch
    if (typeof err === 'object' && err.then) {
      const errorResponse = await err;
      throw {
        message: errorResponse.message || 'An unexpected error occurred',
        details: errorResponse
      };
    }

    throw new Error('An unexpected error occurred during sync');
  }
}

function useSyncYPUsers() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<SyncResponse, SyncError, void>({
    mutationFn: syncYPUsers,
    onSuccess: (data) => {
      // Invalidate accounts list to refresh the data after sync
      queryClient.invalidateQueries(['accountsList']);
      
      // You can also update the cache directly if needed
      // queryClient.setQueryData(['accountsList'], (oldData: any) => {
      //   // Update the cached data with new synced users
      //   return { ...oldData, /* updated data */ };
      // });
    },
    onError: (error) => {
      console.error('YP User Sync Error:', error);
    }
  });

  return {
    syncUsers: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}

export default useSyncYPUsers;