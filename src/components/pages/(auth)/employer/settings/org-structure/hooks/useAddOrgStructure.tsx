import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addOrgStructure(data: {
  position: number;
  description: string;
  parent?: number | null;
  order?: number;
}) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org-structures/`, config);
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
    throw new Error(err.message || 'Failed to add organizational structure position');
  }
}

function useAddOrgStructure() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(addOrgStructure, {
    onSuccess: () => {
      // Invalidate and refetch org structure data
      queryClient.invalidateQueries(['orgStructureItemsCache']);
    },
    onError: (error) => {
      console.error('Error adding organizational structure position:', error);
    },
  });

  return mutation;
}

export default useAddOrgStructure;
