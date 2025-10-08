import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteOrgStructure(orgStructureId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org-structures/${orgStructureId}/`, config);
      if (!res.ok) {
        const errorData = await res.json();
        throw errorData;
      }
      return res.json();
    }
    throw new Error('No authentication token found');
  } catch (err: any) {
    if (typeof err === 'object' && err !== null) {
      throw err;
    }
    throw new Error(err.message || 'Failed to delete organizational structure position');
  }
}

function useDeleteOrgStructure() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(deleteOrgStructure, {
    onSuccess: () => {
      // Invalidate and refetch org structure data
      queryClient.invalidateQueries(['orgStructureItemsCache']);
    },
    onError: (error) => {
      console.error('Error deleting organizational structure position:', error);
    },
  });

  return mutation;
}

export default useDeleteOrgStructure;
